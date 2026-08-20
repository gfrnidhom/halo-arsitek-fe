<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProjects, getCategories } from '@/api/services'
import { RouterLink } from 'vue-router'
import { getImageUrl } from '@/config'
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
  <div class="w-full min-h-[100dvh] bg-white relative flex justify-center pb-24 lg:pb-32">
    <div class="w-full max-w-[1280px] relative px-8 sm:px-12 md:px-16 box-border flex flex-col pt-6 md:pt-8 lg:pt-10">
      
      <!-- Top Row (Snaps to container edges, aligning with header) -->
      <div class="w-full flex justify-end items-start gap-4 md:gap-8 z-20 pointer-events-none shrink-0 mb-4 lg:mb-8 mt-[22px] md:mt-[34px] lg:mt-[38px]">
        <!-- Right: Studio Description -->
        <div class="max-w-[560px] md:max-w-[620px] text-left md:text-right text-xs md:text-sm lg:text-[14px] font-light leading-relaxed text-gray-700 select-none pointer-events-auto">
          HALO ARSITEK is a Jakarta-based architecture studio designing residential and commercial<br class="hidden md:inline" />
          spaces with one belief at the core: Great Design Creates Great Stories.
        </div>
      </div>

      <!-- Main Project Grid Screen -->
      <div class="w-full flex flex-col z-10 pt-2">
        <div class="w-full max-w-[1280px] flex flex-col pb-0">
          <!-- Loading State (Initial) -->
          <div v-if="loading" class="w-full">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
              <div v-for="i in 10" :key="'skeleton-'+i" class="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl"></div>
            </div>
          </div>

          <!-- Project Grid -->
          <div v-else-if="filteredProjects.length > 0" class="w-full flex flex-col">
            <div 
              class="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 lg:gap-10"
              @mouseleave="hoveredProjectId = null"
            >
              <RouterLink 
                v-for="project in filteredProjects" 
                :key="project.id" 
                :to="`/project/${project.slug || project.id}`"
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
                  :src="getImageUrl(project.cover_image || project.image_url)" 
                  :alt="project.title"
                  class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                
                <!-- Dark Gradient Overlay for text readability -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>

                <!-- Title Overlay inside card at bottom -->
                <div class="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex flex-col">
                  <h3 class="text-xs md:text-sm font-light tracking-wide text-white drop-shadow-md select-none leading-snug lowercase">
                    {{ project.title }}
                  </h3>
                  <p v-if="project.location" class="text-[10px] md:text-xs text-white/70 tracking-wider font-light mt-0.5 select-none">
                    {{ project.location }}
                  </p>
                </div>
              </RouterLink>

              <!-- Shimmer Skeleton for Infinite Scroll -->
              <template v-if="loadingMore">
                <div v-for="i in 5" :key="'skeleton-more-'+i" class="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl"></div>
              </template>
            </div>
            
            <!-- Infinite Scroll Sentinel -->
            <div ref="loadMoreRef" class="w-full h-4 mt-2"></div>
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
