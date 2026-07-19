<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProjects, getCategories } from '@/api/services'
import { RouterLink } from 'vue-router'
import { useSEO } from '@/composables/useSEO'
import { useIntersectionObserver } from '@vueuse/core'

useSEO(() => ({
  title: 'Projects',
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
  <div class="w-full max-w-5xl mx-auto h-full flex flex-col pt-16 px-8">
    <!-- Category Filter -->
    <div class="sticky top-0 z-40 bg-[#f3f3f3]/90 backdrop-blur-md py-6 mb-6 flex space-x-6 justify-center rounded-b-2xl">
      <button 
        @click="activeCategory = 'all'"
        :class="['text-xs tracking-widest uppercase transition-colors', activeCategory === 'all' ? 'text-gray-900 border-b border-gray-900 pb-1' : 'text-gray-400 hover:text-gray-900']"
      >
        All
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="activeCategory = cat.id"
        :class="['text-xs tracking-widest uppercase transition-colors', activeCategory === cat.id ? 'text-gray-900 border-b border-gray-900 pb-1' : 'text-gray-400 hover:text-gray-900']"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Loading State (Initial) -->
    <div v-if="loading" class="w-full pb-40">
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <div v-for="i in 6" :key="'skeleton-'+i" class="flex flex-col">
          <div class="w-full aspect-[4/3] bg-gray-200 animate-pulse rounded-xl mb-4"></div>
          <div class="w-3/4 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div class="w-1/2 h-3 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>

    <!-- Project Grid -->
    <div v-else-if="filteredProjects.length > 0" class="flex flex-col pb-40">
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <RouterLink 
          v-for="project in filteredProjects" 
          :key="project.id" 
          :to="`/projects/${project.slug}`"
          class="group flex flex-col"
        >
          <div class="relative overflow-hidden aspect-[4/3] bg-gray-200 mb-4 rounded-xl">
            <!-- Fallback image logic handled natively or via CSS. We just use the provided url -->
            <img 
              :src="project.cover_image" 
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop'"
            />
          </div>
          <h3 class="text-sm font-medium tracking-wide text-gray-900">{{ project.title }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ project.location }}</p>
        </RouterLink>

        <!-- Shimmer Skeleton for Infinite Scroll -->
        <template v-if="loadingMore">
          <div v-for="i in 3" :key="'skeleton-more-'+i" class="flex flex-col">
            <div class="w-full aspect-[4/3] bg-gray-200 animate-pulse rounded-xl mb-4"></div>
            <div class="w-3/4 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div class="w-1/2 h-3 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </template>
      </div>

      <!-- Infinite Scroll Sentinel -->
      <div ref="loadMoreRef" class="w-full h-8 mt-8"></div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center">
      <span class="text-sm tracking-widest text-gray-400 uppercase">No projects found</span>
    </div>
  </div>
</template>
