<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProjects, getCategories } from '@/api/services'
import { RouterLink } from 'vue-router'
import { useSEO } from '@/composables/useSEO'
import { useIntersectionObserver } from '@vueuse/core'

useSEO(() => ({
  title: 'Works',
  description: 'Eksplorasi portofolio karya arsitektur dan desain interior dari HALO ARSITEK.'
}))

const projects = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)
const activeCategory = ref('all')

const loadingMore = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const loadMoreRef = ref(null)
const showGrid = ref(false)

const hoveredProjectId = ref<number | string | null>(null)

const fetchProjects = async (page = 1) => {
  try {
    if (page === 1) loading.value = true
    else loadingMore.value = true

    const [projectsRes, categoriesRes] = await Promise.all([
      getProjects(page),
      page === 1 ? getCategories() : Promise.resolve(null)
    ])
    
    if (projectsRes.data?.success) {
      if (page === 1) {
        projects.value = projectsRes.data.data
      } else {
        projects.value = [...projects.value, ...projectsRes.data.data]
      }
      currentPage.value = projectsRes.data.meta?.current_page || 1
      lastPage.value = projectsRes.data.meta?.last_page || 1
    }
    if (categoriesRes && categoriesRes.data?.success) {
      categories.value = categoriesRes.data.data.projects || []
    }
  } catch (error) {
    console.error('Failed to load projects', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

onMounted(() => {
  fetchProjects(1)
})

useIntersectionObserver(
  loadMoreRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && currentPage.value < lastPage.value && !loadingMore.value && !loading.value) {
      fetchProjects(currentPage.value + 1)
    }
  },
  { threshold: 0.5 }
)

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return projects.value
  return projects.value.filter(p => p.category_id === activeCategory.value)
})
</script>

<template>
  <div class="w-full h-[100dvh] overflow-hidden bg-white relative">
    <!-- Sliding Wrapper -->
    <div 
      class="flex h-full transition-transform duration-700 ease-in-out"
      :style="{ width: '200vw', transform: `translateX(${showGrid ? '-100vw' : '0'})` }"
    >
      <!-- Slide 1: Hero Screen (Full Width for perfect edge alignment) -->
      <div class="w-[100vw] h-full relative px-6 md:px-8 box-border">
        <!-- Top Row (Snaps to screen edges aligning with logo/footer) -->
        <div class="absolute top-12 md:top-16 left-6 md:left-8 right-6 md:right-16 lg:right-24 flex flex-row justify-between items-start gap-8 z-10">
          <!-- Left: Breadcrumbs (Directly aligned with Logo & Hamburger left margin) -->
          <div class="flex items-center text-xs md:text-sm font-light tracking-wide mt-6 md:mt-8 select-none">
            <RouterLink to="/" class="text-gray-400 hover:text-gray-900 transition-colors">Home</RouterLink>
            <span class="text-gray-400">&nbsp;/</span>
            <span class="text-gray-900 font-semibold">Works</span>
          </div>
          
          <!-- Right: Studio Description (Directly aligned with copyright footer right margin) -->
          <div class="max-w-[560px] md:max-w-[620px] text-left md:text-right text-xs md:text-sm lg:text-[14px] font-light leading-relaxed text-gray-700 mt-6 md:mt-8 select-none">
            HALO ARSITEK is a Jakarta-based architecture studio designing residential and commercial<br class="hidden md:inline" />
            spaces with one belief at the core: Great Design Creates Great Stories.
          </div>
        </div>

        <!-- Center: Hero Title & Link (Perfectly Centered in Center Middle) -->
        <div class="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pl-6 md:pl-8 pr-6 md:pr-16 lg:pr-24 box-border">
          <h1 class="text-4xl md:text-6xl lg:text-[4.2vw] font-light tracking-tight text-gray-900 leading-[1.1] text-right select-none whitespace-nowrap">
            Creating Architecture That Tells Great Stories
          </h1>
          <div class="flex justify-end mt-4">
            <RouterLink 
              to="/project" 
              class="group flex items-center gap-3 md:gap-4 text-xs md:text-sm font-normal tracking-[0.15em] text-gray-900 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <span>Discover works</span>
              <svg class="-translate-y-[1px] w-10 md:w-14 h-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 56 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6H44" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <polygon points="42,2 52,6 42,10" fill="currentColor"/>
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Slide 2: Grid Screen (Scrollable, 4-column layout with hover focus effect) -->
      <div class="w-[100vw] h-full overflow-y-auto custom-scrollbar py-12 md:py-20 px-6 md:px-12 lg:px-16 box-border">
        <div class="w-full max-w-6xl lg:max-w-7xl mx-auto flex flex-col">
          <!-- Top Row for Slide 2 -->
          <div class="flex items-center space-x-2 text-xs md:text-sm font-light tracking-wide pb-6 border-b border-gray-200/55 select-none mb-6">
            <RouterLink to="/" class="text-gray-400 hover:text-gray-900 transition-colors">Home</RouterLink>
            <span class="text-gray-400">/</span>
            <button @click="showGrid = false" class="text-gray-900 font-medium hover:opacity-70 transition-opacity cursor-pointer">Works</button>
          </div>

        <!-- Loading State (Initial) -->
          <div v-if="loading" class="w-full pb-20">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div v-for="i in 8" :key="'skeleton-'+i" class="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl"></div>
            </div>
          </div>

          <!-- Project Grid -->
          <div v-else-if="filteredProjects.length > 0" class="flex flex-col pb-20">
            <div 
              class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              @mouseleave="hoveredProjectId = null"
            >
              <RouterLink 
                v-for="project in filteredProjects" 
                :key="project.id" 
                :to="`/project/${project.slug}`"
                @mouseenter="hoveredProjectId = project.id"
                :class="[
                  'group relative overflow-hidden aspect-[3/4] rounded-2xl bg-gray-900 transition-all duration-500 ease-out cursor-pointer block',
                  hoveredProjectId !== null && hoveredProjectId !== project.id 
                    ? 'opacity-35 scale-[0.98] blur-[0.5px] grayscale-[20%]' 
                    : 'opacity-100 scale-100 shadow-md hover:shadow-2xl z-10'
                ]"
              >
                <!-- Cover Image -->
                <img 
                  :src="project.cover_image" 
                  :alt="project.title"
                  class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop'"
                />
                
                <!-- Dark Gradient Overlay for text readability -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>

                <!-- Title Overlay inside card at bottom -->
                <div class="absolute bottom-5 left-5 right-5 z-10 flex flex-col">
                  <h3 class="text-base md:text-lg font-light tracking-wide text-white drop-shadow-md select-none leading-snug">
                    {{ project.title }}
                  </h3>
                  <p v-if="project.location" class="text-xs text-white/70 tracking-wider font-light mt-1 select-none">
                    {{ project.location }}
                  </p>
                </div>
              </RouterLink>

              <!-- Shimmer Skeleton for Infinite Scroll -->
              <template v-if="loadingMore">
                <div v-for="i in 4" :key="'skeleton-more-'+i" class="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl"></div>
              </template>
            </div>

            <!-- Infinite Scroll Sentinel -->
            <div ref="loadMoreRef" class="w-full h-8 mt-8"></div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex-1 flex items-center justify-center pb-20">
            <span class="text-sm tracking-widest text-gray-400 uppercase">No projects found</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
