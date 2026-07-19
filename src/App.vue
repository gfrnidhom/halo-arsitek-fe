<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getSettings } from './api/services'

const route = useRoute()
const settings = ref<any>(null)

onMounted(async () => {
  try {
    const res = await getSettings()
    if (res.data && res.data.success) {
      settings.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to load settings', error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#f3f3f3] relative overflow-hidden font-sans text-gray-800 flex flex-col">
    <!-- Top Left Logo / Head Title -->
    <header :class="['absolute top-8 left-8 z-50 transition-colors duration-500', route.path === '/' ? 'text-white drop-shadow-md' : 'text-gray-900']">
      <RouterLink to="/home" class="text-sm font-normal tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
        {{ settings?.site_name || 'HALO ARSITEK' }}
      </RouterLink>
    </header>

    <!-- Bottom Left Navigation (Hidden on Home/Landing) -->
    <nav v-if="route.path !== '/'" class="absolute bottom-8 left-8 z-50 flex flex-col space-y-3 text-gray-900">
      <RouterLink to="/projects" class="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-wider">Projects</RouterLink>
      <RouterLink to="/about" class="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-wider">About</RouterLink>
      <RouterLink to="/news" class="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-wider">News</RouterLink>
      <RouterLink to="/contact" class="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-wider">Contact</RouterLink>
    </nav>

    <!-- Main Content Area -->
    <main :class="['w-full flex-1 h-[100dvh] custom-scrollbar', route.path === '/' || route.path === '/home' ? 'overflow-hidden' : 'overflow-y-scroll']">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </main>

    <!-- Bottom Right Copyright & Socials (Footer) -->
    <footer :class="['absolute bottom-8 right-8 z-50 flex flex-col items-end space-y-2 text-xs transition-colors duration-500', route.path === '/' ? 'text-white drop-shadow-md opacity-90' : 'text-gray-900 opacity-70']">
      <div v-if="settings?.social_media" class="flex space-x-4">
        <a v-if="settings.social_media.instagram" :href="settings.social_media.instagram" target="_blank" class="hover:opacity-100 transition-opacity uppercase tracking-wider">Instagram</a>
        <a v-if="settings.social_media.facebook" :href="settings.social_media.facebook" target="_blank" class="hover:opacity-100 transition-opacity uppercase tracking-wider">Facebook</a>
      </div>
      <p>&copy; {{ new Date().getFullYear() }}. {{ settings?.site_name || 'Halo Arsitek' }}</p>
    </footer>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Page Transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
