<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getNews } from '@/api/services'
import { useSEO } from '@/composables/useSEO'

useSEO(() => ({
  title: 'News & Updates',
  description: 'Berita, artikel, dan wawasan terbaru seputar dunia arsitektur dan desain dari HALO ARSITEK.'
}))

const newsList = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getNews()
    if (res.data?.success) {
      newsList.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching news', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full h-full overflow-y-auto custom-scrollbar">
    <div class="w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col pt-32 px-8 pb-32">
      <h1 class="text-sm tracking-[0.2em] uppercase text-gray-400 mb-12">News & Insights</h1>
      
      <div v-if="loading" class="flex items-center justify-center h-32">
        <span class="text-sm tracking-widest text-gray-400 animate-pulse uppercase">Loading...</span>
      </div>
      <div v-else-if="!newsList.length" class="text-sm text-gray-400">
        No articles found.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        <RouterLink 
          v-for="item in newsList" 
          :key="item.id" 
          :to="'/news/' + item.slug"
          class="group flex flex-col cursor-pointer"
        >
          <div class="w-full aspect-[4/3] bg-gray-200 overflow-hidden rounded-xl mb-5">
            <img 
              :src="item.cover_image" 
              :alt="item.title"
              class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-105"
              onerror="this.src='https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600&auto=format&fit=crop'"
            />
          </div>
          <div class="w-full flex flex-col pr-4">
            <div class="flex items-center space-x-4 mb-3">
              <span class="text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-800 bg-white border border-gray-200 shadow-sm px-2.5 py-1 rounded">{{ item.category?.name }}</span>
              <span class="text-[10px] tracking-widest text-gray-400 uppercase font-medium">{{ new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
            </div>
            <h2 class="text-lg md:text-xl font-light text-gray-900 group-hover:text-gray-500 transition-colors leading-relaxed">{{ item.title }}</h2>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
