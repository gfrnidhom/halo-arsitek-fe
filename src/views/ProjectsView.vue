<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProjects, getCategories } from '@/api/services'
import { RouterLink } from 'vue-router'
import { useSEO } from '@/composables/useSEO'

useSEO(() => ({
  title: 'Projects',
  description: 'Eksplorasi portofolio karya arsitektur dan desain interior dari HALO ARSITEK.'
}))

const projects = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)
const activeCategory = ref('all')

onMounted(async () => {
  try {
    const [projectsRes, categoriesRes] = await Promise.all([
      getProjects(),
      getCategories()
    ])
    
    if (projectsRes.data?.success) {
      projects.value = projectsRes.data.data
    }
    if (categoriesRes.data?.success) {
      categories.value = categoriesRes.data.data.projects || []
    }
  } catch (error) {
    console.error('Failed to load projects', error)
  } finally {
    loading.value = false
  }
})

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

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span class="text-sm tracking-widest text-gray-400 animate-pulse uppercase">Loading...</span>
    </div>

    <!-- Project Grid -->
    <div v-else-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
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
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center">
      <span class="text-sm tracking-widest text-gray-400 uppercase">No projects found</span>
    </div>
  </div>
</template>
