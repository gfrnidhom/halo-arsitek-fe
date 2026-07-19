<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectBySlug } from '@/api/services'
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import { useSEO } from '@/composables/useSEO'

const route = useRoute()
const project = ref<any>(null)

useSEO(() => ({
  title: project.value?.title || 'Loading...',
  description: project.value?.description || 'Detail project arsitektur',
  image: project.value?.cover_image
}))

const loading = ref(true)

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true, duration: 40 }, [
  Autoplay({ delay: 5000, stopOnInteraction: false })
])
const scrollPrev = () => emblaApi.value?.scrollPrev()
const scrollNext = () => emblaApi.value?.scrollNext()

const allImages = computed(() => {
  if (!project.value) return []
  const imgs = []
  if (project.value.cover_image) imgs.push(project.value.cover_image)
  
  if (project.value.images) {
    try {
      const parsed = typeof project.value.images === 'string' ? JSON.parse(project.value.images) : project.value.images
      if (Array.isArray(parsed)) imgs.push(...parsed)
    } catch(e) {}
  }
  
  if (project.value.gallery && Array.isArray(project.value.gallery)) {
    imgs.push(...project.value.gallery)
  }
  
  return imgs.filter(Boolean)
})

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const res = await getProjectBySlug(slug)
    if (res.data?.success) {
      project.value = res.data.data.project
    }
  } catch (error) {
    console.error('Error fetching project', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full max-w-2xl mx-auto flex flex-col pt-32 px-8 pb-40">
    <div v-if="loading" class="flex-1 flex items-center justify-center h-64">
      <span class="text-sm tracking-widest text-gray-400 animate-pulse uppercase">Loading...</span>
    </div>
    <div v-else-if="!project" class="flex-1 flex items-center justify-center h-64">
      <span class="text-sm tracking-widest text-gray-400 uppercase">Project not found</span>
    </div>
    <div v-else class="flex flex-col">
      <h1 class="text-3xl font-light tracking-wide mb-2">{{ project.title }}</h1>
      <div class="flex items-center space-x-4 text-xs text-gray-500 mb-8 uppercase tracking-widest">
        <span>{{ project.location }}</span>
        <span>&bull;</span>
        <span>{{ project.year }}</span>
        <span>&bull;</span>
        <span>{{ project.category?.name }}</span>
      </div>
      
      <!-- Image Slider -->
      <div v-if="allImages.length > 0" class="relative w-full aspect-[16/9] bg-gray-200 mb-12 rounded-2xl overflow-hidden group">
        <div class="overflow-hidden w-full h-full" ref="emblaRef">
          <div class="flex h-full">
            <div class="flex-[0_0_100%] min-w-0 h-full" v-for="(img, idx) in allImages" :key="idx">
              <img 
                :src="img" 
                :alt="`${project.title} - Image ${idx + 1}`"
                class="w-full h-full object-cover"
                onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop'"
              />
            </div>
          </div>
        </div>
        
        <!-- Prev Zone -->
        <div v-if="allImages.length > 1" class="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start pl-4 z-10 cursor-pointer group/prev" @click="scrollPrev">
          <button class="text-white opacity-0 group-hover/prev:opacity-100 hover:scale-110 transition-all duration-300 drop-shadow-md" aria-label="Previous">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:w-12 md:h-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
        
        <!-- Next Zone -->
        <div v-if="allImages.length > 1" class="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-4 z-10 cursor-pointer group/next" @click="scrollNext">
          <button class="text-white opacity-0 group-hover/next:opacity-100 hover:scale-110 transition-all duration-300 drop-shadow-md" aria-label="Next">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:w-12 md:h-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div class="prose prose-sm max-w-none mb-12 font-light text-gray-600 leading-relaxed" v-html="project.description"></div>
    </div>
  </div>
</template>
