<script setup lang="ts">
import { ref } from 'vue'
import { submitContactForm } from '@/api/services'

const form = ref({
  name: '',
  email: '',
  message: ''
})
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const submit = async () => {
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const res = await submitContactForm(form.value)
    if (res.data?.success) {
      successMsg.value = res.data.message || 'Message sent successfully.'
      form.value = { name: '', email: '', message: '' }
    } else {
      errorMsg.value = res.data?.message || 'Failed to send message.'
    }
  } catch (error: any) {
    errorMsg.value = error.response?.data?.message || 'An error occurred.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto flex flex-col pt-32 px-8 pb-24">
    <h1 class="text-sm tracking-[0.2em] uppercase text-gray-400 mb-12">Get in touch</h1>
    
    <div class="mb-12">
      <p class="text-lg font-light leading-relaxed text-gray-800">
        We would love to hear about your next project. Reach out to us to schedule a consultation.
      </p>
    </div>

    <form @submit.prevent="submit" class="flex flex-col space-y-8">
      <div class="flex flex-col space-y-2">
        <label for="name" class="text-xs tracking-widest uppercase text-gray-400">Name</label>
        <input 
          id="name" 
          v-model="form.name" 
          type="text" 
          required
          class="border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-gray-900 transition-colors text-sm"
        />
      </div>
      
      <div class="flex flex-col space-y-2">
        <label for="email" class="text-xs tracking-widest uppercase text-gray-400">Email</label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          required
          class="border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-gray-900 transition-colors text-sm"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="message" class="text-xs tracking-widest uppercase text-gray-400">Message</label>
        <textarea 
          id="message" 
          v-model="form.message" 
          required
          rows="4"
          class="border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-gray-900 transition-colors text-sm resize-none"
        ></textarea>
      </div>

      <div class="pt-4">
        <button 
          type="submit" 
          :disabled="loading"
          class="text-xs tracking-[0.2em] uppercase border border-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Sending...' : 'Send Message' }}
        </button>
      </div>

      <p v-if="successMsg" class="text-sm text-green-600 mt-4">{{ successMsg }}</p>
      <p v-if="errorMsg" class="text-sm text-red-600 mt-4">{{ errorMsg }}</p>
    </form>
  </div>
</template>
