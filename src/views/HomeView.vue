<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '../api'
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import { useSEO } from '../composables/useSEO'

useSEO(() => ({
  title: 'Beranda',
  description: 'Karya arsitektur dan desain interior terbaik dari HALO ARSITEK.'
}))

const projects = ref<any[]>([])
const loading = ref(true)
const selectedIndex = ref(0)

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true, duration: 40 }, [
  Autoplay({ delay: 5000, stopOnInteraction: false })
])

const scrollPrev = () => emblaApi.value?.scrollPrev()
const scrollNext = () => emblaApi.value?.scrollNext()

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

onMounted(async () => {
  try {
    const response = await api.get('/api/projects/headliners')
    if (response.data && response.data.success && response.data.data.length > 0) {
      projects.value = response.data.data
    } else {
      // Fallback data when API returns empty (no headliners in DB yet)
      const allProjects = await api.get('/api/projects')
      if (allProjects.data && allProjects.data.success && allProjects.data.data.length > 0) {
        projects.value = allProjects.data.data.slice(0, 5) // Use up to 5 latest projects
      }
    }
  } catch (error) {
    console.error('Failed to fetch headliner projects:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full h-[100dvh] bg-[#f3f3f3] relative flex items-center justify-center pt-4">
    <!-- Center Container -->
    <div class="relative w-[90%] max-w-[480px] h-[75vh] flex flex-col justify-center">
      
      <!-- Image slider container -->
      <div class="w-full h-full relative overflow-hidden" ref="emblaRef">
        <div class="flex h-full">
          <div class="flex-[0_0_100%] min-w-0 h-full relative" v-for="project in projects" :key="project.id">
            <RouterLink :to="`/projects/${project.slug || project.id}`" class="relative w-full h-full block cursor-pointer">
              <img 
                :src="project.cover_image" 
                :alt="project.title"
                class="w-full h-full object-cover"
                onerror="this.src='https://placehold.co/1920x1080/eeeeee/999999?text=Project+Image'"
              />
            </RouterLink>
          </div>
        </div>

        <!-- Prev Zone -->
        <div class="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start pl-2 z-10 cursor-pointer group/prev" @click="scrollPrev">
          <button class="text-white opacity-0 group-hover/prev:opacity-100 hover:scale-110 transition-all duration-300 drop-shadow-md" aria-label="Previous">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
        
        <!-- Next Zone -->
        <div class="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-2 z-10 cursor-pointer group/next" @click="scrollNext">
          <button class="text-white opacity-0 group-hover/next:opacity-100 hover:scale-110 transition-all duration-300 drop-shadow-md" aria-label="Next">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Caption below the slider -->
      <div class="mt-3 w-full h-8" v-if="projects.length > 0">
        <Transition name="fade-slide" mode="out-in">
          <div class="flex justify-between items-start w-full" :key="selectedIndex">
            <div class="flex-1 pr-4">
              <p class="text-gray-700 text-sm font-medium tracking-wide">{{ projects[selectedIndex]?.title }}</p>
            </div>
            <div class="flex-1 text-right text-gray-400 text-xs tracking-wide pl-4 mt-0.5">
              <p>
                <span v-if="projects[selectedIndex]?.location">{{ projects[selectedIndex]?.location }}</span>
                <span v-if="projects[selectedIndex]?.location && projects[selectedIndex]?.year">, </span>
                <span v-if="projects[selectedIndex]?.year">{{ projects[selectedIndex]?.year }}</span>
              </p>
            </div>
          </div>
        </Transition>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
