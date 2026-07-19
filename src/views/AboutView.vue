<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTeam, getServices, getTestimonials, getSettings } from '@/api/services'
import { useSEO } from '@/composables/useSEO'

useSEO(() => ({
  title: 'About Us',
  description: 'Mengenal lebih dekat tim HALO ARSITEK, profil, dan layanan kami.'
}))

const team = ref<any[]>([])
const services = ref<any[]>([])
const testimonials = ref<any[]>([])
const settings = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [teamRes, servicesRes, testiRes, settingsRes] = await Promise.all([
      getTeam(), getServices(), getTestimonials(), getSettings()
    ])
    if (teamRes.data?.success) team.value = teamRes.data.data
    if (servicesRes.data?.success) services.value = servicesRes.data.data
    if (testiRes.data?.success) testimonials.value = testiRes.data.data
    if (settingsRes.data?.success) settings.value = settingsRes.data.data
  } catch (error) {
    console.error('Error fetching about data', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full h-full relative">
    
    <!-- FIXED Header (Never Scrolls) -->
    <div class="fixed top-0 left-0 w-full z-20 pointer-events-none">
      <div class="w-full max-w-4xl mx-auto px-8 md:px-12 pt-32 pb-8 bg-[#f3f3f3] border-b border-gray-200/50">
        <h1 class="text-xs tracking-[0.2em] uppercase text-gray-400 font-medium pointer-events-auto">About Us</h1>
      </div>
    </div>

    <!-- SCROLLABLE Content -->
    <div class="w-full h-full overflow-y-auto custom-scrollbar pt-[180px] pb-32">
      <div class="w-full max-w-4xl mx-auto flex flex-col px-8 md:px-12 relative">
        
        <div v-if="loading" class="flex items-center justify-center h-64">
          <span class="text-sm tracking-widest text-gray-400 animate-pulse uppercase">Loading...</span>
        </div>
        
        <div v-else class="flex flex-col space-y-24">
          <!-- About Description -->
          <section class="max-w-3xl">
            <p class="text-xl md:text-2xl font-light leading-relaxed text-gray-800">
            {{ settings?.about_description || 'We believe architecture is more than just space. It is the silent language of form, light, and context merging to create harmony in human experience.' }}
          </p>
        </section>

        <!-- Services -->
        <section v-if="services.length">
          <h2 class="text-xs tracking-[0.2em] uppercase text-gray-400 mb-8 font-medium">Services</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div v-for="svc in services" :key="svc.id" class="flex flex-col">
              <h3 class="text-base font-medium mb-3 text-gray-900">{{ svc.title }}</h3>
              <p class="text-sm text-gray-500 leading-loose">{{ svc.description }}</p>
            </div>
          </div>
        </section>

        <!-- Team -->
        <section v-if="team.length">
          <h2 class="text-xs tracking-[0.2em] uppercase text-gray-400 mb-8 font-medium">Team</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="member in team" :key="member.id" class="flex flex-col">
              <div class="aspect-[3/4] bg-gray-200 mb-4 overflow-hidden rounded-xl">
                <img 
                  :src="member.image" 
                  :alt="member.name"
                  class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'"
                />
              </div>
              <h3 class="text-sm font-medium text-gray-900">{{ member.name }}</h3>
              <p class="text-xs text-gray-400 mt-1">{{ member.role }}</p>
            </div>
          </div>
        </section>

        <!-- Testimonials -->
        <section v-if="testimonials.length">
          <h2 class="text-xs tracking-[0.2em] uppercase text-gray-400 mb-8 font-medium">Testimonials</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div v-for="testi in testimonials" :key="testi.id" class="flex flex-col space-y-4">
              <p class="italic text-sm text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-6">"{{ testi.quote }}"</p>
              <div class="pl-6">
                <p class="text-xs font-medium text-gray-900">{{ testi.name }}</p>
                <p class="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{{ testi.role }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</div>
</template>
