<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { submitContactForm, getSettings } from '@/api/services'
import { useSEO } from '@/composables/useSEO'

useSEO(() => ({
  title: 'Contact Us',
  description: 'Hubungi HALO ARSITEK untuk berdiskusi dan mewujudkan desain arsitektur impian Anda.'
}))

const settings = ref<any>(null)
const isFormModalOpen = ref(false)
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
      successMsg.value = res.data.message || 'Message sent successfully. We will get back to you shortly.'
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
  <div 
    class="w-full min-h-[100dvh] bg-[#555d50] text-[#eae7e1] relative flex justify-center selection:bg-white selection:text-[#555d50]"
    style="background-image: radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.08) 100%), url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.045\'/%3E%3C/svg%3E');"
  >
    <div class="w-full h-full min-h-[100dvh] relative px-8 sm:px-12 md:px-24 lg:px-32 pt-24 md:pt-28 pb-16 flex flex-col justify-between box-border">

      <!-- Main Contact Grid (Exact Layout from UI/UX) -->
      <div class="w-full my-auto py-12 md:py-16 flex flex-col space-y-12 md:space-y-16 animate-fade-up">
        
        <!-- Row 1: Office & Instagram -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
          <div class="md:col-span-3 text-sm md:text-base font-light text-[#eae7e1] tracking-wide select-none">
            Office
          </div>
          <div class="md:col-span-6 text-sm md:text-base font-light text-[#eae7e1]/90 leading-relaxed">
            {{ settings?.contact_address || 'The Green BSD, Cilenggang, Kec. Serpong, Kota Tangerang Selatan, Banten 15310 Indonesia' }}
          </div>
          <div class="md:col-span-3 text-left md:text-right">
            <a 
              :href="settings?.social_instagram || 'https://instagram.com/haloarsitek'" 
              target="_blank" 
              class="text-sm md:text-base font-light text-[#eae7e1] hover:text-white hover:underline transition-all lowercase tracking-wide inline-block"
            >
              instagram
            </a>
          </div>
        </div>

        <!-- Row 2: General Inquiry -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
          <div class="md:col-span-3 text-sm md:text-base font-light text-[#eae7e1] tracking-wide select-none">
            General Inquiry
          </div>
          <div class="md:col-span-6 flex flex-col space-y-1 text-sm md:text-base font-light text-[#eae7e1]/90 leading-relaxed">
            <a :href="`mailto:${settings?.contact_email || 'info@haloarsitek.com'}`" class="hover:text-white hover:underline transition-all">
              {{ settings?.contact_email || 'info@haloarsitek.com' }}
            </a>
            <a :href="`https://wa.me/${settings?.contact_whatsapp || '6287702507729'}`" target="_blank" class="hover:text-white hover:underline transition-all">
              {{ settings?.contact_phone || '087702507729' }} (whatsapp)
            </a>
          </div>
          <div class="md:col-span-3 text-left md:text-right">
            <button 
              @click="isFormModalOpen = true" 
              class="text-xs md:text-sm uppercase tracking-[0.18em] text-[#eae7e1]/90 hover:text-white border-b border-[#eae7e1]/40 hover:border-white pb-0.5 transition-all cursor-pointer"
            >
              Send Message &rarr;
            </button>
          </div>
        </div>

        <!-- Row 3: Press & Partnerships -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
          <div class="md:col-span-3 text-sm md:text-base font-light text-[#eae7e1] tracking-wide select-none">
            Press & Partnerships
          </div>
          <div class="md:col-span-6 text-sm md:text-base font-light text-[#eae7e1]/90 leading-relaxed">
            <a href="mailto:communication@haloarsitek.com" class="hover:text-white hover:underline transition-all">
              communication@haloarsitek.com
            </a>
          </div>
          <div class="md:col-span-3"></div>
        </div>

      </div>

      <!-- Bottom Row: Circular Badge (Left) and Logo (Right) -->
      <div class="w-full flex justify-between items-end pt-8 pb-4">
        <!-- Circular House Badge -->
        <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 select-none drop-shadow-md flex items-center justify-center">
          <img 
            src="/logo-halo-arsitek-white.png" 
            alt="Halo Arsitek Emblem" 
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Right Watermark / Logo -->
        <div class="opacity-90 select-none">
          <img src="/images/logo-white.png" alt="Halo Arsitek" class="h-6 md:h-7 w-auto object-contain drop-shadow-md" />
        </div>
      </div>

    </div>

    <!-- Contact Form Modal -->
    <Transition name="fade">
      <div 
        v-if="isFormModalOpen" 
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        @click.self="isFormModalOpen = false"
      >
        <div class="bg-[#464d42] border border-white/20 text-[#eae7e1] w-full max-w-lg p-6 sm:p-8 rounded-none shadow-2xl relative">
          <!-- Close Button -->
          <button 
            @click="isFormModalOpen = false" 
            class="absolute top-5 right-5 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 class="text-xl font-light text-white tracking-wide mb-2">Send an Inquiry</h2>
          <p class="text-xs text-white/70 font-light mb-6">Tell us about your project or inquiry, and we'll reach out to you.</p>

          <form @submit.prevent="submit" class="flex flex-col space-y-5">
            <div class="flex flex-col border-b border-white/30">
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="Your Name"
                required
                class="w-full bg-transparent py-2.5 px-0 text-sm font-light focus:outline-none placeholder-white/50 text-white"
              />
            </div>
            
            <div class="flex flex-col border-b border-white/30">
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="E-mail Address"
                required
                class="w-full bg-transparent py-2.5 px-0 text-sm font-light focus:outline-none placeholder-white/50 text-white"
              />
            </div>
            
            <div class="flex flex-col border-b border-white/30">
              <textarea 
                v-model="form.message" 
                placeholder="Your Message / Project Details"
                required
                rows="3"
                class="w-full bg-transparent py-2.5 px-0 text-sm font-light focus:outline-none placeholder-white/50 resize-none text-white"
              ></textarea>
            </div>

            <div class="pt-3 flex flex-col items-start">
              <button 
                type="submit" 
                :disabled="loading"
                class="text-xs uppercase tracking-[0.2em] border-b border-white pb-1 hover:opacity-60 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed text-white"
              >
                {{ loading ? 'Sending...' : 'Send Message' }}
              </button>
              <p v-if="successMsg" class="text-xs text-green-300 mt-3 font-light">{{ successMsg }}</p>
              <p v-if="errorMsg" class="text-xs text-red-300 mt-3 font-light">{{ errorMsg }}</p>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>
