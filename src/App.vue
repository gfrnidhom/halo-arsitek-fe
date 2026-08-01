<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getSettings } from './api/services'
import { Menu, X } from 'lucide-vue-next'

const route = useRoute()
const settings = ref<any>(null)
const isMobileMenuOpen = ref(false)

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

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#f3f3f3] relative overflow-hidden font-sans text-gray-800 flex flex-col">
    <!-- Top Left Logo / Head Title -->
    <header class="fixed top-6 left-6 md:top-8 md:left-8 z-50 transition-colors duration-500">
      <RouterLink to="/home" class="hover:opacity-70 transition-opacity block" @click="closeMobileMenu">
        <img 
          :src="route.path === '/' && !isMobileMenuOpen ? '/images/logo-white.png' : '/images/logo-black.png'" 
          :alt="settings?.site_name || 'HALO ARSITEK'"
          :class="['h-6 md:h-8 w-auto object-contain transition-all duration-500', route.path === '/' && !isMobileMenuOpen ? 'drop-shadow-md' : '']"
        />
      </RouterLink>
    </header>

    <!-- Mobile Menu Toggle Button -->
    <button 
      class="md:hidden fixed top-5 right-6 z-50 p-1"
      :class="[route.path === '/' && !isMobileMenuOpen ? 'text-white drop-shadow-md' : 'text-gray-900']"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    >
      <X v-if="isMobileMenuOpen" class="w-6 h-6" />
      <Menu v-else class="w-6 h-6" />
    </button>

    <!-- Mobile Fullscreen Menu -->
    <Transition name="fade">
      <div v-if="isMobileMenuOpen" class="md:hidden fixed inset-0 z-40 bg-[#f3f3f3] flex flex-col justify-between pt-32 pb-12 px-8">
        <!-- Main Links -->
        <div class="flex flex-col space-y-8 mt-8">
          <RouterLink to="/projects" class="text-lg font-light tracking-widest uppercase text-gray-900 hover:opacity-70 transition-opacity" @click="closeMobileMenu">Projects</RouterLink>
          <RouterLink to="/about" class="text-lg font-light tracking-widest uppercase text-gray-900 hover:opacity-70 transition-opacity" @click="closeMobileMenu">About</RouterLink>
          <RouterLink to="/news" class="text-lg font-light tracking-widest uppercase text-gray-900 hover:opacity-70 transition-opacity" @click="closeMobileMenu">News</RouterLink>
          <RouterLink to="/contact" class="text-lg font-light tracking-widest uppercase text-gray-900 hover:opacity-70 transition-opacity" @click="closeMobileMenu">Contact</RouterLink>
        </div>
        
        <!-- Corporate Contact Info -->
        <div class="flex flex-col space-y-6 pt-10 border-t border-gray-300">
          <div class="flex flex-col space-y-2">
            <span class="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1">Inquiries</span>
            <a :href="`mailto:${settings?.contact_email || 'hello@haloarsitek.com'}`" class="text-sm font-medium tracking-wider text-gray-900">{{ settings?.contact_email || 'hello@haloarsitek.com' }}</a>
            <a :href="`tel:${settings?.contact_phone || '+628111222333'}`" class="text-sm font-medium tracking-wider text-gray-900">{{ settings?.contact_phone || '+62 811 1222 333' }}</a>
          </div>
          
          <div v-if="settings?.social_media" class="flex space-x-6">
            <a v-if="settings.social_media.instagram" :href="settings.social_media.instagram" target="_blank" class="text-xs font-semibold uppercase tracking-[0.1em] text-gray-900 hover:opacity-70">Instagram</a>
            <a v-if="settings.social_media.facebook" :href="settings.social_media.facebook" target="_blank" class="text-xs font-semibold uppercase tracking-[0.1em] text-gray-900 hover:opacity-70">Facebook</a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bottom Left Navigation (Hidden on Home/Landing & Mobile) -->
    <div v-if="route.path !== '/'" class="hidden md:block fixed bottom-0 left-0 z-50 pointer-events-none">
      <div class="pb-8 pl-8 pt-16 pr-16 bg-gradient-to-t from-[#f3f3f3] via-[#f3f3f3]/80 to-transparent pointer-events-auto">
        <nav class="flex flex-row space-x-8 items-center text-gray-900">
          <RouterLink to="/projects" class="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-widest">Projects</RouterLink>
          <RouterLink to="/about" class="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-widest">About</RouterLink>
          <RouterLink to="/news" class="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-widest">News</RouterLink>
          <RouterLink to="/contact" class="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-widest">Contact</RouterLink>
        </nav>
      </div>
    </div>

    <!-- Main Content Area -->
    <main :class="['w-full flex-1 h-[100dvh] custom-scrollbar', route.path === '/' || route.path === '/home' || route.path === '/about' ? 'overflow-hidden' : 'overflow-y-scroll']">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </main>

    <!-- Bottom Right Copyright & Socials (Footer) (Hidden on Mobile) -->
    <footer :class="['hidden md:flex fixed bottom-8 right-8 z-50 flex-row items-center space-x-8 text-xs transition-colors duration-500', route.path === '/' ? 'text-white drop-shadow-md opacity-90' : 'text-gray-900 opacity-70']">
      <div v-if="settings?.social_media" class="flex space-x-4">
        <a v-if="settings.social_media.instagram" :href="settings.social_media.instagram" target="_blank" class="hover:opacity-100 transition-opacity uppercase tracking-widest">Instagram</a>
        <a v-if="settings.social_media.facebook" :href="settings.social_media.facebook" target="_blank" class="hover:opacity-100 transition-opacity uppercase tracking-widest">Facebook</a>
      </div>
      <p class="uppercase tracking-widest">&copy; {{ new Date().getFullYear() }}. {{ settings?.site_name || 'Halo Arsitek' }}</p>
    </footer>

    <!-- Mobile Minimal Copyright -->
    <div :class="['md:hidden fixed bottom-0 w-full z-30 pointer-events-none flex justify-end items-end pb-6 pr-6 pt-24', 
      route.path === '/' && !isMobileMenuOpen ? '' : 'bg-gradient-to-t from-[#f3f3f3] via-[#f3f3f3]/80 to-transparent']">
      <p :class="['text-[10px] transition-colors duration-500', 
        route.path === '/' && !isMobileMenuOpen 
          ? 'text-white drop-shadow-md opacity-70' 
          : 'text-gray-900 opacity-70']">
        &copy; {{ new Date().getFullYear() }}. {{ settings?.site_name || 'Halo Arsitek' }}
      </p>
    </div>
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

/* Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
