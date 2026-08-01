<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
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

const [emblaRef, emblaApi] = emblaCarouselVue(
  { loop: true, watchDrag: false },
  [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
    Fade()
  ]
)

watch(projects, async () => {
  await nextTick()
  if (emblaApi.value) {
    emblaApi.value.reInit()
  }
})

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

const navigateToProject = (idOrSlug: string) => {
  router.push(`/projects/${idOrSlug}`)
}
</script>

<template>
  <div class="w-full h-[100dvh] bg-[#1a1a1a]">
    <!-- Loader -->
    <div v-show="loading" class="absolute inset-0 flex items-center justify-center z-50">
      <span class="text-sm tracking-widest text-white animate-pulse uppercase">Loading...</span>
    </div>
    
    <!-- Slideshow container - Always in DOM for emblaRef binding -->
    <div class="w-full h-full relative overflow-hidden transition-opacity duration-700" :class="{ 'opacity-0': loading, 'opacity-100': !loading }" ref="emblaRef">
      <div class="flex h-full">
        <div class="flex-[0_0_100%] min-w-0 h-full relative cursor-pointer" v-for="project in projects" :key="project.id" @click="navigateToProject(project.slug || project.id)">
          <!-- Dark overlay to ensure logo is visible if needed -->
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
