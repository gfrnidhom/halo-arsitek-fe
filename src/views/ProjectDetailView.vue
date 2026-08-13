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
  <!-- Full width white background, forced to 100vh and no scroll -->
  <div class="w-full h-[100dvh] bg-white text-gray-900 font-sans relative box-border project-detail-page overflow-hidden">
    
    <div class="w-full h-full max-w-[1280px] mx-auto flex flex-col pt-[88px] pb-[88px] px-8 sm:px-12 md:px-16">

      <!-- Loading State -->
      <div v-if="loading" class="w-full flex-1 flex items-center justify-center">
        <span class="text-xs md:text-sm tracking-widest text-gray-400 animate-pulse uppercase">Loading project...</span>
      </div>

      <!-- Main Content -->
      <div v-else class="w-full h-full flex flex-col flex-1 min-h-0">
        <!-- Header Info Section -->
        <div class="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6 md:mb-8 shrink-0 select-none">
          <!-- Left Column: Title and Subtitle -->
          <div class="flex flex-col flex-1">
            <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#111] leading-none mb-3 lowercase">
              {{ project?.title }}
            </h1>
            <p class="text-sm md:text-base lg:text-lg font-normal text-gray-500">
              <span>{{ project?.location || 'Jakarta Selatan' }}</span>
              <span class="mx-1.5">/</span>
              <span>{{ project?.year || '2023' }}</span>
            </p>
          </div>

          <!-- Right Column: Description (Italic, Right-aligned) -->
          <div class="flex-1 flex justify-start md:justify-end pb-1">
            <div class="text-left md:text-right italic font-light text-xs sm:text-sm md:text-base lg:text-[15px] text-gray-500 max-w-sm md:max-w-lg lg:max-w-[500px] leading-relaxed whitespace-pre-line">
              {{ project?.description }}
            </div>
          </div>
        </div>

        <!-- Main Gallery Grid (Forces rows, flex-1 to fill remaining height) -->
        <div class="w-full flex-1 min-h-0 grid grid-cols-2 grid-rows-5 md:grid-cols-5 md:grid-rows-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <div 
            v-for="(img, idx) in galleryImages" 
            :key="idx"
            @click="openLightbox(idx)"
            class="group relative w-full h-full rounded-none overflow-hidden bg-gray-100 cursor-pointer transition-transform duration-500 ease-out transform hover:scale-[1.02] hover:z-10 hover:shadow-xl"
          >
            <img 
              :src="img" 
              :alt="`${project?.title} photo ${idx + 1}`"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'"
            />
            <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

      </div>

      <!-- Lightbox Modal Gallery -->
      <Transition name="fade">
        <div 
          v-if="isLightboxOpen" 
          class="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          @click.self="closeLightbox"
        >
          <!-- Close Button -->
          <button 
            @click="closeLightbox"
            class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2 cursor-pointer z-[110]"
            aria-label="Close image lightbox"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 md:w-10 md:h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Main Lightbox Image -->
          <div class="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <img 
              :src="galleryImages[activeImageIndex]" 
              :alt="`${project?.title} - photo ${activeImageIndex + 1}`"
              class="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl transition-all duration-300"
            />
            
            <!-- Image Counter -->
            <div class="mt-4 text-xs md:text-sm text-white/70 tracking-widest font-light">
              {{ activeImageIndex + 1 }} / {{ galleryImages.length }}
            </div>
          </div>

          <!-- Previous Button -->
          <button 
            @click.stop="prevImage" 
            class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 hover:scale-110 transition-all cursor-pointer z-[110]"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:w-12 md:h-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <!-- Next Button -->
          <button 
            @click.stop="nextImage" 
            class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 hover:scale-110 transition-all cursor-pointer z-[110]"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:w-12 md:h-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

