<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { submitContactForm, getSettings } from '@/api/services'
import { useSEO } from '@/composables/useSEO'
import { Instagram, Facebook, Twitter } from 'lucide-vue-next'

useSEO(() => ({
  title: 'Contact Us',
  description: 'Hubungi HALO ARSITEK untuk berdiskusi dan mewujudkan desain impian Anda bersama kami.'
}))

const settings = ref<any>(null)
const form = ref({
  name: '',
  email: '',
  message: ''
})
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

onMounted(async () => {
  try {
    const res = await getSettings()
    if (res.data?.success) {
      settings.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching settings', error)
  }
})

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
  <div class="w-full min-h-[100dvh] flex flex-col justify-center px-6 md:px-12 lg:px-24 xl:px-32 py-24 md:py-12 relative">
    <div class="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-12 md:mt-0">
      
      <!-- Left Column: Details + Image -->
      <div class="flex flex-col space-y-8 md:space-y-16">
        
        <!-- Text details grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-sm leading-relaxed">
          
          <!-- Address -->
          <div class="col-span-1 flex flex-col space-y-1">
            <span class="text-gray-400 text-xs uppercase tracking-wider font-medium">Address</span>
            <p class="text-gray-900" v-html="settings?.contact_address?.split(', ').join('<br>') || 'Jl. Arsitektur No. 42<br>Jakarta Selatan<br>DKI Jakarta 12345'"></p>
          </div>
          
          <!-- Email & Phone -->
          <div class="col-span-1 flex flex-col space-y-6">
            <div class="flex flex-col space-y-1">
              <span class="text-gray-400 text-xs uppercase tracking-wider font-medium">E-mail</span>
              <a :href="`mailto:${settings?.contact_email}`" class="text-gray-900 hover:text-black transition-colors">{{ settings?.contact_email || 'hello@haloarsitek.com' }}</a>
            </div>
            <div class="flex flex-col space-y-1">
              <span class="text-gray-400 text-xs uppercase tracking-wider font-medium">Phone</span>
              <a :href="`tel:${settings?.contact_phone}`" class="text-gray-900 hover:text-black transition-colors">{{ settings?.contact_phone || '+62 812 3456 7890' }}</a>
            </div>
          </div>
          
          <!-- Social -->
          <div class="col-span-1 flex flex-col space-y-1">
            <span class="text-gray-400 text-xs uppercase tracking-wider font-medium">Social</span>
            <div class="flex space-x-5 pt-1">
              <a :href="settings?.social_instagram || '#'" target="_blank" class="text-gray-900 hover:opacity-70 transition-opacity" aria-label="Instagram">
                <Instagram class="w-4 h-4" />
              </a>
              <a :href="settings?.social_facebook || '#'" target="_blank" class="text-gray-900 hover:opacity-70 transition-opacity" aria-label="Facebook">
                <Facebook class="w-4 h-4" />
              </a>
              <a :href="settings?.social_twitter || '#'" target="_blank" class="text-gray-900 hover:opacity-70 transition-opacity" aria-label="Twitter">
                <Twitter class="w-4 h-4" />
              </a>
            </div>
          </div>
          
        </div>

        <!-- Image -->
        <div class="w-full max-w-lg aspect-[16/9] bg-[#f3f3f3] overflow-hidden rounded-md">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover grayscale opacity-80" />
        </div>
      </div>

      <!-- Right Column: Form -->
      <div class="flex flex-col">
        <form @submit.prevent="submit" class="flex flex-col space-y-10">
          
          <div class="flex flex-col border-b border-gray-300">
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Name"
              required
              class="w-full bg-transparent py-3 px-0 text-sm font-light focus:outline-none placeholder-gray-400 transition-colors"
            />
          </div>
          
          <div class="flex flex-col border-b border-gray-300">
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="E-mail"
              required
              class="w-full bg-transparent py-3 px-0 text-sm font-light focus:outline-none placeholder-gray-400 transition-colors"
            />
          </div>
          
          <div class="flex flex-col border-b border-gray-300">
            <textarea 
              v-model="form.message" 
              placeholder="Message"
              required
              rows="4"
              class="w-full bg-transparent py-3 px-0 text-sm font-light focus:outline-none placeholder-gray-400 resize-none transition-colors"
            ></textarea>
          </div>
          
          <div class="pt-4 flex flex-col items-start">
            <button 
              type="submit" 
              :disabled="loading"
              class="text-xs uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-50 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Sending...' : 'Send Message' }}
            </button>
            <p v-if="successMsg" class="text-xs text-green-600 mt-4">{{ successMsg }}</p>
            <p v-if="errorMsg" class="text-xs text-red-600 mt-4">{{ errorMsg }}</p>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>
