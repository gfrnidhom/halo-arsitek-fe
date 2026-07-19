<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { useSEO } from '../composables/useSEO'

useSEO(() => ({
  title: 'Welcome',
  description: 'HALO ARSITEK - Studio Arsitektur dan Desain Interior'
}))

const router = useRouter()
const projects = ref<any[]>([])
const loading = ref(true)

const [emblaRef] = emblaCarouselVue(
  { loop: true, watchDrag: false },
  [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
    Fade()
  ]
)

onMounted(async () => {
  try {
    const res = await api.get('/api/projects/headliners')
    if (res.data && res.data.success && res.data.data.length > 0) {
      projects.value = res.data.data
    } else {
      const allProjects = await api.get('/api/projects')
      if (allProjects.data && allProjects.data.success && allProjects.data.data.length > 0) {
        projects.value = allProjects.data.data.slice(0, 5)
      }
    }
  } catch (error) {
    console.error('Failed to load projects', error)
  } finally {
    loading.value = false
  }
})

const navigateToHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="w-full h-[100dvh] bg-[#1a1a1a] cursor-pointer" @click="navigateToHome">
    <div v-if="loading" class="w-full h-full flex items-center justify-center">
      <span class="text-sm tracking-widest text-white animate-pulse uppercase">Loading...</span>
    </div>
    
    <div v-else class="w-full h-full relative overflow-hidden" ref="emblaRef">
      <div class="flex h-full">
        <div class="flex-[0_0_100%] min-w-0 h-full relative" v-for="project in projects" :key="project.id">
          <!-- Dark overlay to ensure logo is visible if needed, though mix-blend-difference handles it -->
          <div class="absolute inset-0 bg-black/10 z-10"></div>
          <img 
            :src="project.cover_image" 
            :alt="project.title"
            class="w-full h-full object-cover"
            onerror="this.src='https://placehold.co/1920x1080/222222/999999?text=Project'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
