<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  <div class="w-full max-w-4xl mx-auto flex flex-col pt-32 px-8 pb-24">
    <h1 class="text-sm tracking-[0.2em] uppercase text-gray-400 mb-12">News & Insights</h1>
    
    <div v-if="loading" class="flex items-center justify-center h-32">
      <span class="text-sm tracking-widest text-gray-400 animate-pulse uppercase">Loading...</span>
    </div>
    <div v-else-if="!newsList.length" class="text-sm text-gray-400">
      No articles found.
    </div>
    
    <div v-else class="flex flex-col space-y-12">
      <article v-for="item in newsList" :key="item.id" class="group flex flex-col md:flex-row gap-8 cursor-pointer">
        <div class="w-full md:w-1/3 aspect-[4/3] bg-gray-200 overflow-hidden rounded-xl">
          <img 
            :src="item.cover_image" 
            :alt="item.title"
            class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            onerror="this.src='https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600&auto=format&fit=crop'"
          />
        </div>
        <div class="w-full md:w-2/3 flex flex-col justify-center">
          <div class="text-xs tracking-widest uppercase text-gray-400 mb-2">
            {{ item.category?.name }} &bull; {{ new Date(item.created_at).toLocaleDateString() }}
          </div>
          <h2 class="text-xl font-light mb-3 group-hover:text-gray-500 transition-colors">{{ item.title }}</h2>
          <p class="text-sm text-gray-500 leading-relaxed">{{ item.content }}</p>
        </div>
      </article>
    </div>
  </div>
</template>
