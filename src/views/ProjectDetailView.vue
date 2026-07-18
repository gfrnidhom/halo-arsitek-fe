<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectBySlug } from '@/api/services'

const route = useRoute()
const project = ref<any>(null)
const loading = ref(true)

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
      
      <div class="w-full aspect-[16/9] bg-gray-200 mb-12 rounded-2xl overflow-hidden">
        <img 
          :src="project.cover_image" 
          :alt="project.title"
          class="w-full h-full object-cover"
          onerror="this.src='https://placehold.co/1200x800/eeeeee/999999?text=Image+Not+Found'"
        />
      </div>

      <div class="prose prose-sm max-w-none mb-12 font-light text-gray-600 leading-relaxed" v-html="project.description"></div>

      <div v-if="project.gallery?.length" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="(img, idx) in project.gallery" :key="idx" class="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
          <img 
            :src="img" 
            :alt="`${project.title} gallery ${idx}`"
            class="w-full h-full object-cover"
            onerror="this.src='https://placehold.co/600x400/eeeeee/999999?text=Gallery'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
