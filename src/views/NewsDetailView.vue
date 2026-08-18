<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getNewsBySlug } from '@/api/services'
import { useSEO } from '@/composables/useSEO'

const route = useRoute()
const newsItem = ref<any>(null)
const recentNews = ref<any[]>([])

useSEO(() => ({
  title: newsItem.value?.title || 'Loading...',
  description: newsItem.value?.content ? newsItem.value.content.substring(0, 150) + '...' : 'Berita dan artikel terbaru dari HALO ARSITEK.',
  image: newsItem.value?.cover_image
}))

const loading = ref(true)

const loadNews = async (slug: string) => {
  loading.value = true
  try {
    const res = await getNewsBySlug(slug)
    if (res.data?.success) {
      newsItem.value = res.data.data.article
      recentNews.value = res.data.data.recent || []
    }
  } catch (error) {
    console.error('Error fetching news detail', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNews(route.params.slug as string)
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug && route.name === 'news-detail') {
    loadNews(newSlug as string)
  }
})
</script>

<template>
  <div class="w-full min-h-full bg-white relative flex flex-col items-center">
    <div class="w-full max-w-[1280px] px-8 sm:px-12 md:px-16 pt-28 md:pt-36 pb-32 flex flex-col box-border">

      <div class="w-full max-w-3xl mx-auto flex flex-col">
        <div v-if="loading" class="flex-1 flex items-center justify-center h-64">
          <span class="text-sm tracking-widest text-gray-400 animate-pulse uppercase">Loading...</span>
        </div>
        <div v-else-if="!newsItem" class="flex-1 flex items-center justify-center h-64 flex-col gap-4">
          <span class="text-sm tracking-widest text-gray-400 uppercase">Article not found</span>
          <RouterLink to="/news" class="text-xs uppercase tracking-wider text-gray-900 underline">Back to News</RouterLink>
        </div>
        <div v-else class="flex flex-col">
          <RouterLink to="/news" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <span>&larr;</span> Back to News
          </RouterLink>

          <h1 class="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-4 leading-tight">{{ newsItem.title }}</h1>
          <div class="flex items-center space-x-4 text-xs text-gray-500 mb-8 uppercase tracking-widest">
            <span>{{ newsItem.category?.name }}</span>
            <span>&bull;</span>
            <span>{{ new Date(newsItem.created_at).toLocaleDateString() }}</span>
          </div>
          
          <!-- Cover Image -->
          <div v-if="newsItem.cover_image || newsItem.image_url" class="relative w-full aspect-[16/9] bg-gray-200 mb-12 rounded-2xl overflow-hidden group">
            <img 
              :src="newsItem.cover_image || newsItem.image_url" 
              :alt="newsItem.title"
              class="w-full h-full object-cover"
              onerror="this.src='https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop'"
            />
          </div>
    
          <div class="prose prose-sm md:prose-base max-w-none font-light text-gray-600 leading-relaxed mb-16" v-html="newsItem.content"></div>
          
          <!-- Recent News -->
          <div v-if="recentNews.length > 0" class="border-t border-gray-200 pt-12">
            <h2 class="text-xs tracking-[0.2em] uppercase text-gray-400 font-medium mb-8">Recent Articles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RouterLink 
                v-for="recent in recentNews" 
                :key="recent.id" 
                :to="'/news/' + recent.slug"
                class="group flex flex-col cursor-pointer"
              >
                <div class="w-full aspect-[4/3] bg-gray-200 overflow-hidden rounded-xl mb-4">
                  <img 
                    :src="recent.cover_image || recent.image_url" 
                    :alt="recent.title"
                    class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    onerror="this.src='https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600&auto=format&fit=crop'"
                  />
                </div>
                <h3 class="text-base font-light mb-2 group-hover:text-gray-500 transition-colors">{{ recent.title }}</h3>
                <div class="text-[10px] tracking-widest uppercase text-gray-400">
                  {{ recent.category?.name }} &bull; {{ new Date(recent.created_at).toLocaleDateString() }}
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
