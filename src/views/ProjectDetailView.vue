<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectBySlug } from '@/api/services'
import { getImageUrl } from '@/config'
import { useSEO } from '@/composables/useSEO'

const route = useRoute()
const project = ref<any>(null)
const loading = ref(true)

// Lightbox / Slide view state
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
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
]



const galleryImages = computed(() => {
  if (!project.value) return []
  
  const imgs: string[] = []
  
  if (project.value?.cover_image) {
    imgs.push(getImageUrl(project.value.cover_image))
  } else if (project.value?.image_url) {
    imgs.push(getImageUrl(project.value.image_url))
  }
  
  if (project.value?.images) {
    try {
      const parsed = typeof project.value.images === 'string' 
        ? JSON.parse(project.value.images) 
        : project.value.images
      if (Array.isArray(parsed)) imgs.push(...parsed.map((img: string) => getImageUrl(img)))
    } catch (e) {
      console.warn('Failed to parse project.images', e)
    }
  }
  
  if (project.value?.gallery && Array.isArray(project.value.gallery)) {
    imgs.push(...project.value.gallery.map((img: string) => getImageUrl(img)))
  }
  
  const cleanImgs = imgs.filter(Boolean)

  return cleanImgs
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
    : 'apartemen minimalis bsd'

  project.value = {
    title: titleFormatted,
    location: 'BSD City, Tangerang',
    year: '2023',
    description: 'Redesain total apartemen 2BR menjadi hunian minimalis bergaya Japandi. Furnitur built-in dan palette kayu-putih menciptakan kesan luas dan tenang.',
    cover_image: defaultArchitecturalImages[0],
    gallery: defaultArchitecturalImages
  }
}

const openLightbox = (index: number) => {
  activeImageIndex.value = index
  isLightboxOpen.value = true
  window.dispatchEvent(new CustomEvent('project-lightbox-toggle', { detail: { isOpen: true } }))
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  window.dispatchEvent(new CustomEvent('project-lightbox-toggle', { detail: { isOpen: false } }))
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
  // Ensure lightbox state is cleared when leaving page
  window.dispatchEvent(new CustomEvent('project-lightbox-toggle', { detail: { isOpen: false } }))
})
</script>

<template>
  <div class="w-full min-h-[100dvh] bg-white text-gray-900 font-sans relative flex justify-center pb-24 lg:pb-32">
    
    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-20 bg-white">
      <span class="text-xs md:text-sm tracking-widest text-gray-400 animate-pulse uppercase">Loading project...</span>
    </div>

    <!-- ================= PAGE 1: GRID OVERVIEW (detail-page-one.png) ================= -->
    <div v-else class="w-full max-w-[1280px] relative px-8 sm:px-12 md:px-16 box-border flex flex-col pt-28 md:pt-32 lg:pt-36">
      
      <!-- Top Row: Project Title (Left) & Italic Description (Right) -->
      <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start z-10 mb-8 md:mb-12">
        <!-- Left: Project Name & Year -->
        <div class="md:col-span-5 flex flex-col">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-gray-900 leading-tight lowercase select-none">
            {{ project?.title || 'apartemen minimalis bsd' }}
          </h1>
          <p class="text-xs sm:text-sm text-gray-600 font-light tracking-wide mt-1 select-none">
            {{ project?.location || 'BSD City, Tangerang' }} / {{ project?.year || '2023' }}
          </p>
        </div>

        <!-- Right: Project Description (Italic, Right-aligned) -->
        <div class="md:col-span-7 flex justify-end">
          <p class="max-w-xs sm:max-w-sm md:max-w-md text-left md:text-right text-xs sm:text-[13px] md:text-sm italic font-light text-gray-700 leading-relaxed select-none">
            {{ project?.description || 'Redesain total apartemen 2BR menjadi hunian minimalis bergaya Japandi. Furnitur built-in dan palette kayu-putih menciptakan kesan luas dan tenang.' }}
          </p>
        </div>
      </div>

      <!-- Center: Image Grid -->
      <div class="w-full z-10 flex justify-center">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 lg:gap-10 w-full">
          <div 
            v-for="(img, idx) in galleryImages" 
            :key="idx"
            @click="openLightbox(idx)"
            class="aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden bg-gray-100 relative group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
          >
            <img 
              :src="img" 
              :alt="`${project?.title} - Image ${idx + 1}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <!-- Subtle Hover Overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-900 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 md:w-4 md:h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= PAGE 2: FULLSCREEN SLIDE PREVIEW (detail-page-slide.png) ================= -->
    <Transition name="lightbox-fade">
      <div 
        v-if="isLightboxOpen" 
        class="fixed inset-0 z-40 bg-black text-white font-sans overflow-hidden select-none"
      >
        <!-- Top Right Info & Close Button -->
        <div class="absolute top-6 md:top-8 lg:top-10 right-8 sm:right-12 md:right-16 text-right z-50 flex items-start gap-5 md:gap-6 drop-shadow-md pointer-events-auto">
          <div class="flex flex-col items-end">
            <div class="text-sm md:text-base lg:text-lg font-normal lowercase tracking-wide mb-0.5">
              {{ project?.title }}
            </div>
            <div class="text-xs md:text-sm font-light text-white/80 tracking-wide">
              <span>{{ project?.location || 'Jakarta Selatan' }}</span>
              <span class="mx-1">/</span>
              <span>{{ project?.year || '2025' }}</span>
            </div>
          </div>
          
          <!-- Close Button -->
          <button 
            @click.stop="closeLightbox"
            class="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/40 text-white/80 hover:text-white hover:border-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer hover:scale-105 mt-0.5 pointer-events-auto select-none"
            aria-label="Close slider"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 pointer-events-none">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
            <div class="absolute inset-0 bg-black/15 pointer-events-none"></div>
          </div>
        </transition-group>

        <!-- Navigation Arrows (Pill Shaped Capsule) -->
        <button 
          @click="prevImage" 
          class="absolute left-4 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 w-12 sm:w-14 md:w-16 h-7 sm:h-8 md:h-9 rounded-full border-[1.5px] border-white/60 text-white/90 hover:text-white hover:border-white flex items-center justify-center backdrop-blur-sm transition-all z-20 cursor-pointer group shadow-md"
          aria-label="Previous image"
        >
          <svg class="w-5 sm:w-6 md:w-7 h-4 sm:h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        <button 
          @click="nextImage" 
          class="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 w-12 sm:w-14 md:w-16 h-7 sm:h-8 md:h-9 rounded-full border-[1.5px] border-white/60 text-white/90 hover:text-white hover:border-white flex items-center justify-center backdrop-blur-sm transition-all z-20 cursor-pointer group shadow-md"
          aria-label="Next image"
        >
          <svg class="w-5 sm:w-6 md:w-7 h-4 sm:h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        <!-- Bottom Thumbnails -->
        <div class="absolute bottom-6 md:bottom-8 left-0 right-0 w-full flex justify-center z-20 px-4 pointer-events-none">
          <div class="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] pointer-events-auto py-3 px-3">
            <button 
              v-for="(img, idx) in galleryImages" 
              :key="idx" 
              @click="activeImageIndex = idx"
              :class="[
                'w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer',
                activeImageIndex === idx ? 'border-white scale-110 shadow-xl opacity-100 z-10 ring-2 ring-white/30' : 'border-white/20 opacity-60 hover:opacity-100 hover:scale-105 hover:border-white/60'
              ]"
              :aria-label="`View image ${idx + 1}`"
            >
              <img 
                :src="img" 
                class="w-full h-full object-cover pointer-events-none" 
                alt="Thumbnail"
              />
            </button>
          </div>
        </div>
      </div>
    </Transition>

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

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
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
