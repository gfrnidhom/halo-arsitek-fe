<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '../api'
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { useSEO } from '../composables/useSEO'

useSEO(() => ({
  title: 'Welcome',
  description: 'HALO ARSITEK - Studio Arsitektur dan Desain Interior'
}))

const projects = ref<any[]>([])
const loading = ref(true)
const selectedIndex = ref(0)

const [emblaRef, emblaApi] = emblaCarouselVue(
  { loop: true, watchDrag: false },
  [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
    Fade()
  ]
)

const onSelect = () => {
  if (!emblaApi.value) return
  selectedIndex.value = emblaApi.value.selectedScrollSnap()
}

watch(emblaApi, (newApi) => {
  if (newApi) {
    newApi.on('select', onSelect)
    onSelect()
  }
})

const openMenu = () => {
  window.dispatchEvent(new CustomEvent('open-main-menu'))
}

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

const get169Image = (url: string) => {
  if (!url) return ''
  if (url.includes('unsplash.com')) {
    return url
      .replace(/w=\d+/, 'w=1920')
      .replace(/h=\d+/, 'h=1080')
  }
  return url
}
</script>

<template>
  <div class="w-full h-[100dvh] bg-[#1a1a1a] cursor-pointer relative" @click="openMenu">
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 z-50 bg-[#1a1a1a] flex items-center justify-center">
      <span class="text-sm tracking-widest text-white animate-pulse uppercase">Loading...</span>
    </div>
    
    <!-- Carousel Slider (Always rendered to ensure Embla initializes correctly on mount) -->
    <div class="w-full h-full relative overflow-hidden" ref="emblaRef">
      <div class="flex h-full">
        <div class="flex-[0_0_100%] min-w-0 h-full relative" v-for="project in projects" :key="project.id">
          <!-- Dark overlay to ensure logo is visible if needed, though mix-blend-difference handles it -->
          <div class="absolute inset-0 bg-black/10 z-10"></div>
          <img 
            :src="get169Image(project.cover_image)" 
            :alt="project.title"
            class="w-full h-full object-cover"
            onerror="this.src='https://placehold.co/1920x1080/222222/999999?text=Project'"
          />
        </div>
      </div>
      
      <!-- Bottom Left Project Name (Clickable to project details) -->
      <div class="absolute inset-0 pointer-events-none z-30 flex justify-center">
        <div class="w-full h-full max-w-[1280px] relative pointer-events-none">
          <div v-if="projects.length > 0" class="absolute bottom-10 left-8 sm:left-12 md:left-16 pointer-events-auto">
            <RouterLink 
              :to="`/project/${projects[selectedIndex]?.slug || projects[selectedIndex]?.id}`"
              class="text-white hover:opacity-75 transition-opacity text-xs md:text-sm font-light tracking-[0.15em] lowercase flex items-center gap-1.5 drop-shadow-md"
              @click.stop
            >
              <span>{{ projects[selectedIndex]?.title }}</span>
              <span class="text-sm md:text-base font-light select-none">&rarr;</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
