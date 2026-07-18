<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api'
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'

const projects = ref<any[]>([])
const loading = ref(true)

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true, duration: 40 }, [
  Autoplay({ delay: 5000, stopOnInteraction: false }),
  Fade()
])

const scrollPrev = () => emblaApi.value?.scrollPrev()
const scrollNext = () => emblaApi.value?.scrollNext()

onMounted(async () => {
  try {
    const response = await api.get('/api/projects/headliners')
    if (response.data && response.data.success && response.data.data.length > 0) {
      projects.value = response.data.data
    } else {
      // Fallback data when API returns empty (no projects in DB yet)
      projects.value = [
        {
          id: 1,
          title: "Modern Minimalist House",
          location: "Jakarta",
          year: "2023",
          cover_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
        },
        {
          id: 2,
          title: "Kantor Kreatif Sudirman",
          cover_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 3,
          title: "Rumah Tropis Kemang",
          cover_image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
        }
      ]
    }
  } catch (error) {
    console.error('Failed to fetch headliner projects:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full h-[100dvh] bg-[#f3f3f3] relative">
    <!-- Embla Carousel -->
    <div class="w-full h-full" ref="emblaRef">
      <div class="flex h-full">
        <div class="flex-[0_0_100%] min-w-0 h-full" v-for="project in projects" :key="project.id">
          <RouterLink to="/projects" class="relative w-full h-full block cursor-pointer">
            <img 
              :src="project.cover_image" 
              :alt="project.title"
              class="w-full h-full object-cover"
              onerror="this.src='https://placehold.co/1920x1080/eeeeee/999999?text=Project+Image'"
            />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
