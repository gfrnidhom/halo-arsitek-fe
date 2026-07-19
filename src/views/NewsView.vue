<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getNews } from '@/api/services'
import { useSEO } from '@/composables/useSEO'
import { useIntersectionObserver } from '@vueuse/core'

useSEO(() => ({
  title: 'News & Updates',
  description: 'Berita, artikel, dan wawasan terbaru seputar dunia arsitektur dan desain dari HALO ARSITEK.'
}))

const newsList = ref<any[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const loadMoreRef = ref(null)

const fetchNews = async (page = 1) => {
  try {
    if (page === 1) loading.value = true
    else loadingMore.value = true

    const res = await getNews(page)
    if (res.data?.success) {
      if (page === 1) {
        newsList.value = res.data.data
      } else {
        newsList.value = [...newsList.value, ...res.data.data]
      }
      currentPage.value = res.data.meta?.current_page || 1
      lastPage.value = res.data.meta?.last_page || 1
    }
  } catch (error) {
    console.error('Error fetching news', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

onMounted(() => {
  fetchNews(1)
})

useIntersectionObserver(
  loadMoreRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && currentPage.value < lastPage.value && !loadingMore.value && !loading.value) {
      fetchNews(currentPage.value + 1)
    }
  },
  { threshold: 0.5 }
)
</script>

<template>
  <div class="w-full h-full overflow-y-auto custom-scrollbar">
    <div class="w-full max-w-4xl mx-auto flex flex-col pt-32 px-8 pb-40">
      <h1 class="text-sm tracking-[0.2em] uppercase text-gray-400 mb-12">News & Insights</h1>
      
      <!-- Loading State (Initial Shimmer) -->
      <div v-if="loading" class="w-full pb-40">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <div v-for="i in 6" :key="'skeleton-'+i" class="flex flex-col">
            <div class="w-full aspect-[4/3] bg-gray-200 animate-pulse rounded-xl mb-5"></div>
            <div class="w-1/3 h-3 bg-gray-200 animate-pulse rounded mb-3"></div>
            <div class="w-3/4 h-5 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div class="w-2/3 h-5 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="!newsList.length" class="text-sm text-gray-400">
        No articles found.
      </div>
      
      <div v-else class="flex flex-col pb-40">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
              <div class="flex items-center justify-between w-full mb-3">
                <span class="text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-800">{{ item.category?.name }}</span>
                <span class="text-[10px] tracking-widest text-gray-400 uppercase font-medium">{{ new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
              </div>
              <h2 class="text-lg md:text-xl font-light text-gray-900 group-hover:text-gray-500 transition-colors leading-relaxed">{{ item.title }}</h2>
            </div>
          </RouterLink>

          <!-- Shimmer Skeleton for Infinite Scroll -->
          <template v-if="loadingMore">
            <div v-for="i in 3" :key="'skeleton-more-'+i" class="flex flex-col">
              <div class="w-full aspect-[4/3] bg-gray-200 animate-pulse rounded-xl mb-5"></div>
              <div class="w-1/3 h-3 bg-gray-200 animate-pulse rounded mb-3"></div>
              <div class="w-3/4 h-5 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div class="w-2/3 h-5 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </template>
        </div>
        
        <!-- Infinite Scroll Sentinel -->
        <div ref="loadMoreRef" class="w-full h-8 mt-8"></div>
      </div>
    </div>
  </div>
</template>
