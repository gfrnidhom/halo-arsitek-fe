<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectBySlug } from '@/api/services'
import { useSEO } from '@/composables/useSEO'

const route = useRoute()
const project = ref<any>(null)
const loading = ref(true)

// Lightbox state
const isLightboxOpen = ref(false)
const activeImageIndex = ref(0)

useSEO(() => ({
  title: project.value?.title || 'Detail Project',
  description: project.value?.description || 'Detail project arsitektur HALO ARSITEK.',
  image: project.value?.cover_image
}))

const defaultArchitecturalImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop'
]

const galleryImages = computed(() => {
  const imgs: string[] = []
  
  if (project.value?.cover_image) {
    imgs.push(project.value.cover_image)
  } else if (project.value?.image_url) {
    imgs.push(project.value.image_url)
  }
  
  if (project.value?.images) {
    try {
      const parsed = typeof project.value.images === 'string' 
        ? JSON.parse(project.value.images) 
        : project.value.images
      if (Array.isArray(parsed)) imgs.push(...parsed)
    } catch (e) {
      console.warn('Failed to parse project.images', e)
    }
  }
  
  if (project.value?.gallery && Array.isArray(project.value.gallery)) {
    imgs.push(...project.value.gallery)
  }

  const cleanImgs = imgs.filter(Boolean)

  // Fill up to 10 images to match the 5x2 grid layout
  let fillIndex = 0
  while (cleanImgs.length < 10) {
    cleanImgs.push(defaultArchitecturalImages[fillIndex % defaultArchitecturalImages.length])
    fillIndex++
  }

  return cleanImgs.slice(0, 10)
})

const fetchProjectData = async () => {
  const slug = route.params.slug as string
  try {
    loading.value = true
    const res = await getProjectBySlug(slug)
    if (res.data?.success && res.data?.data?.project) {
      project.value = res.data.data.project
    } else {
      createFallbackProject(slug)
    }
  } catch (error) {
    createFallbackProject(slug)
  } finally {
    loading.value = false
  }
}

const createFallbackProject = (slug: string) => {
  const titleFormatted = slug
    ? slug.split('-').join(' ')
    : 'rumah amerta'

  project.value = {
    title: titleFormatted,
    location: 'Jakarta Selatan',
    year: '2023',
    description: 'Hunian keluarga bergaya tropis kontemporer. Courtyard terbuka di tengah rumah menghadirkan sirkulasi udara alami dan cahaya matahari yang optimal.',
    cover_image: defaultArchitecturalImages[0],
    gallery: defaultArchitecturalImages
  }
}

const openLightbox = (index: number) => {
  activeImageIndex.value = index
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

const nextImage = () => {
  activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length
}

const prevImage = () => {
  activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
  fetchProjectData()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <!-- Fullscreen slider container -->
  <div class="w-full h-[100dvh] bg-black text-white font-sans relative box-border overflow-hidden select-none">
    
    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-20 bg-black">
      <span class="text-xs md:text-sm tracking-widest text-white/50 animate-pulse uppercase">Loading project...</span>
    </div>

    <template v-else>
      <!-- Main Background Image Slider -->
      <transition-group name="fade" tag="div" class="absolute inset-0 z-0">
        <div 
          v-for="(img, idx) in galleryImages" 
          :key="img"
          v-show="activeImageIndex === idx"
          class="absolute inset-0 w-full h-full"
        >
          <img 
            :src="img" 
            :alt="`${project?.title} slide ${idx + 1}`"
            class="w-full h-full object-cover"
          />
          <!-- Optional subtle gradient overlay for text readability -->
          <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
        </div>
      </transition-group>



      <!-- Top Right Info -->
      <div class="absolute top-8 md:top-12 right-8 md:right-16 text-right z-10 drop-shadow-md">
        <div class="text-base md:text-xl lg:text-2xl font-normal lowercase tracking-wide mb-1">
          {{ project?.title }}
        </div>
        <div class="text-xs md:text-sm font-light text-white/90 tracking-wide">
          <span>{{ project?.location || 'Jakarta Selatan' }}</span>
          <span class="mx-1">/</span>
          <span>{{ project?.year || '2025' }}</span>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button 
        @click="prevImage" 
        class="absolute left-4 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full border-[1.5px] border-white/60 text-white/80 hover:text-white hover:border-white flex items-center justify-center backdrop-blur-sm transition-all z-10 cursor-pointer group"
        aria-label="Previous image"
      >
        <svg class="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      <button 
        @click="nextImage" 
        class="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full border-[1.5px] border-white/60 text-white/80 hover:text-white hover:border-white flex items-center justify-center backdrop-blur-sm transition-all z-10 cursor-pointer group"
        aria-label="Next image"
      >
        <svg class="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>

      <!-- Bottom Thumbnails -->
      <div class="absolute bottom-6 md:bottom-10 left-0 right-0 w-full flex justify-center z-10 px-4 pointer-events-none">
        <div class="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] pointer-events-auto pb-2 px-2">
          <button 
            v-for="(img, idx) in galleryImages" 
            :key="idx" 
            @click="activeImageIndex = idx"
            :class="[
              'w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer',
              activeImageIndex === idx ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
            ]"
          >
            <img 
              :src="img" 
              class="w-full h-full object-cover" 
              alt="Thumbnail"
              onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'"
            />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar for thumbnails */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
