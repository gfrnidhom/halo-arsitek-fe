<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectBySlug } from '@/api/services'
import emblaCarouselVue from 'embla-carousel-vue'

const route = useRoute()
const project = ref<any>(null)
const loading = ref(true)

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true })
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
  <div class="w-full max-w-4xl mx-auto flex flex-col pt-32 px-8 pb-24">
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
        
        <!-- Navigation Buttons -->
        <button 
          @click="scrollPrev"
          v-if="allImages.length > 1"
          class="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          @click="scrollNext"
          v-if="allImages.length > 1"
          class="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div class="prose prose-sm max-w-none mb-12 font-light text-gray-600 leading-relaxed" v-html="project.description"></div>
    </div>
  </div>
</template>
