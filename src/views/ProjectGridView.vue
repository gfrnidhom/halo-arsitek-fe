<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProjects, getCategories } from '@/api/services'
import { RouterLink } from 'vue-router'
import { useSEO } from '@/composables/useSEO'
import { useIntersectionObserver } from '@vueuse/core'

useSEO(() => ({
  title: 'Project Portfolio',
  description: 'Portofolio karya arsitektur dan desain interior pilihan dari HALO ARSITEK.'
}))

const projects = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)
const activeCategory = ref('all')

const loadingMore = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const loadMoreRef = ref(null)

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
  <div class="w-full h-[100dvh] overflow-hidden bg-white relative flex justify-center">
    <div class="w-full h-full max-w-[1280px] relative px-8 sm:px-12 md:px-16 box-border">
      
      <!-- Top Row (Snaps to container edges, pushed down to clear global logo) -->
      <div class="absolute top-[88px] left-8 sm:left-12 md:left-16 right-8 sm:right-12 md:right-16 flex flex-row justify-between items-start gap-8 z-20">
        <!-- Left: Breadcrumbs -->
        <div class="flex items-center text-xs md:text-sm font-light tracking-wide select-none">
          <RouterLink to="/" class="text-gray-400 hover:text-gray-900 transition-colors">Home</RouterLink>
          <span class="text-gray-400">&nbsp;/</span>
          <RouterLink to="/works" class="text-gray-900 font-semibold hover:opacity-70 transition-opacity">Works</RouterLink>
        </div>
        
        <!-- Right: Studio Description -->
        <div class="max-w-[560px] md:max-w-[620px] text-left md:text-right text-xs md:text-sm lg:text-[14px] font-light leading-relaxed text-gray-700 select-none">
          HALO ARSITEK is a Jakarta-based architecture studio designing residential and commercial<br class="hidden md:inline" />
          spaces with one belief at the core: Great Design Creates Great Stories.
        </div>
      </div>

      <!-- Main Project Grid Screen (Perfectly centered, zero scroll) -->
      <div class="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-8 sm:px-12 md:px-16 box-border z-10 flex justify-center">
        <div class="w-full max-w-[1280px] flex flex-col">
          <!-- Loading State (Initial) -->
          <div v-if="loading" class="w-full">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <div v-for="i in 10" :key="'skeleton-'+i" class="w-full aspect-[3/4] max-h-[30vh] lg:max-h-[34vh] bg-gray-200 animate-pulse rounded-2xl"></div>
            </div>
          </div>

          <!-- Project Grid -->
          <div v-else-if="filteredProjects.length > 0" class="w-full flex flex-col">
            <div 
              class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4"
              @mouseleave="hoveredProjectId = null"
            >
              <RouterLink 
                v-for="project in filteredProjects.slice(0, 10)" 
                :key="project.id" 
                :to="`/project/${project.slug}`"
                @mouseenter="hoveredProjectId = project.id"
                :class="[
                  'group relative overflow-hidden aspect-[3/4] max-h-[30vh] lg:max-h-[34vh] rounded-none bg-gray-900 transition-all duration-500 ease-out cursor-pointer block',
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
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>

                <!-- Title Overlay inside card at bottom -->
                <div class="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex flex-col">
                  <h3 class="text-xs md:text-sm font-light tracking-wide text-white drop-shadow-md select-none leading-snug">
                    {{ project.title }}
                  </h3>
                  <p v-if="project.location" class="text-[10px] md:text-xs text-white/70 tracking-wider font-light mt-0.5 select-none">
                    {{ project.location }}
                  </p>
                </div>
              </RouterLink>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="w-full flex items-center justify-center py-10">
            <span class="text-sm tracking-widest text-gray-400 uppercase">No projects found</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
