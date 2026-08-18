<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getSettings } from './api/services'

const route = useRoute()
const settings = ref<any>(null)
const isMainMenuOpen = ref(false)
const mainScrollRef = ref<HTMLElement | null>(null)

// Compute whether the current view has a dark background
const isDarkPage = computed(() => {
  if (isMainMenuOpen.value) return true
  const path = route.path
  const name = String(route.name || '')
  if (path === '/' || name === 'landing') return true
  if (name === 'project-detail' || path.startsWith('/project/') || path.startsWith('/works/')) return true
  if (path === '/contact' || name === 'contact') return true
  return false
})

// Check if a navigation link is active
const isLinkActive = (path: string) => {
  if (path === '/') return route.path === '/'
  if (path === '/works') {
    return route.path === '/works' || route.path === '/project' || route.path === '/projects' || route.path.startsWith('/project/') || route.path.startsWith('/works/')
  }
  return route.path.startsWith(path)
}

// Fixed breadcrumb configuration per route (anchored with logo so it never shifts during scroll)
const currentBreadcrumb = computed(() => {
  const path = route.path
  const name = String(route.name || '')
  
  if (path === '/' || name === 'landing' || name === 'home') {
    return null
  }
  
  if (path === '/works') {
    return {
      parent: 'Home',
      parentPath: '/',
      current: 'Works',
      isDark: false
    }
  }
  
  if (path === '/project' || path === '/projects' || name === 'project-grid') {
    return {
      parent: 'Home',
      parentPath: '/',
      current: 'Works',
      isDark: false
    }
  }
  
  if (name === 'project-detail' || path.startsWith('/project/') || path.startsWith('/works/')) {
    const slug = (route.params.slug as string) || ''
    const title = slug ? slug.split('-').join(' ') : 'Detail'
    return {
      parent: 'Home',
      parentPath: '/',
      middle: 'Works',
      middlePath: '/project',
      current: title,
      isDark: true
    }
  }
  
  if (path === '/about' || name === 'about') {
    return {
      parent: 'Home',
      parentPath: '/',
      current: 'About',
      isDark: false
    }
  }
  
  if (path === '/news' || name === 'news') {
    return {
      parent: 'Home',
      parentPath: '/',
      current: 'News',
      isDark: false
    }
  }
  
  if (name === 'news-detail' || path.startsWith('/news/')) {
    const slug = (route.params.slug as string) || ''
    const title = slug ? slug.split('-').join(' ') : 'Article'
    return {
      parent: 'Home',
      parentPath: '/',
      middle: 'News',
      middlePath: '/news',
      current: title,
      isDark: false
    }
  }
  
  if (path === '/contact' || name === 'contact') {
    return {
      parent: 'Home',
      parentPath: '/',
      current: 'Contact',
      isDark: true
    }
  }
  
  return null
})

onMounted(async () => {
  try {
    const res = await getSettings()
    if (res.data && res.data.success) {
      settings.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to load settings', error)
  }
  
  // Listen for open-main-menu events from views (e.g. LandingView)
  window.addEventListener('open-main-menu', openMainMenu)
})

onUnmounted(() => {
  window.removeEventListener('open-main-menu', openMainMenu)
  document.body.classList.remove('landing-menu-open')
})

// Reset scroll on route change
watch(() => route.path, () => {
  if (mainScrollRef.value) {
    mainScrollRef.value.scrollTop = 0
  }
  closeMainMenu()
})

const openMainMenu = () => {
  isMainMenuOpen.value = true
  document.body.classList.add('landing-menu-open')
}

const closeMainMenu = () => {
  isMainMenuOpen.value = false
  document.body.classList.remove('landing-menu-open')
}

const toggleMainMenu = () => {
  if (isMainMenuOpen.value) {
    closeMainMenu()
  } else {
    openMainMenu()
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f3f3f3] relative overflow-hidden font-sans text-gray-800 flex flex-col">
    <!-- Global UI Overlay Container (Constrained to 1280px) -->
    <div class="fixed inset-0 pointer-events-none z-50 flex justify-center">
      <div class="w-full h-full max-w-[1280px] relative px-8 sm:px-12 md:px-16 pointer-events-none">
        
        <!-- Top Left Logo & Fixed Breadcrumb -->
        <header class="absolute top-6 md:top-8 lg:top-10 left-8 sm:left-12 md:left-16 pointer-events-auto transition-colors duration-500 flex flex-col items-start">
          <RouterLink to="/" class="hover:opacity-70 transition-opacity block header-logo-link" @click="closeMainMenu">
            <img 
              :src="isDarkPage ? '/images/logo-white.png' : '/images/logo-black.png'" 
              :alt="settings?.site_name || 'HALO ARSITEK'"
              :class="['h-6 md:h-8 w-auto object-contain transition-all duration-500', isDarkPage ? 'drop-shadow-md' : '']"
            />
          </RouterLink>

          <!-- Fixed Breadcrumb (never moves when scrolling) -->
          <div 
            v-if="currentBreadcrumb && !isMainMenuOpen" 
            class="mt-1 md:mt-1.5 flex items-center text-xs md:text-sm font-light tracking-wide select-none transition-colors duration-500"
          >
            <RouterLink 
              :to="currentBreadcrumb.parentPath" 
              :class="[currentBreadcrumb.isDark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-900', 'transition-colors']"
            >
              {{ currentBreadcrumb.parent }}
            </RouterLink>
            
            <template v-if="currentBreadcrumb.middle">
              <span :class="currentBreadcrumb.isDark ? 'text-white/60' : 'text-gray-400'">&nbsp;/</span>
              <RouterLink 
                :to="currentBreadcrumb.middlePath" 
                :class="[currentBreadcrumb.isDark ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900', 'transition-colors']"
              >
                &nbsp;{{ currentBreadcrumb.middle }}
              </RouterLink>
            </template>

            <span :class="currentBreadcrumb.isDark ? 'text-white/60' : 'text-gray-400'">&nbsp;/</span>
            <span :class="[currentBreadcrumb.isDark ? 'text-white font-medium drop-shadow-md' : 'text-gray-900 font-semibold', 'capitalize truncate max-w-[220px] sm:max-w-xs md:max-w-md']">
              {{ currentBreadcrumb.current }}
            </span>
          </div>
        </header>

        <!-- Bottom Right Copyright & Socials (Footer) (Hidden on Mobile) -->
        <footer v-if="route.path !== '/contact'" :class="['hidden md:flex absolute bottom-10 right-8 sm:right-12 md:right-16 pointer-events-auto flex-row items-center space-x-8 text-xs font-normal transition-colors duration-500', isDarkPage ? 'text-white drop-shadow-md opacity-90' : 'text-gray-900 opacity-90']">
          <div v-if="settings?.social_media || settings?.social_instagram || settings?.social_facebook" class="flex space-x-4">
            <a v-if="settings?.social_instagram || settings?.social_media?.instagram" :href="settings?.social_instagram || settings?.social_media?.instagram" target="_blank" class="hover:opacity-100 transition-opacity uppercase tracking-widest">Instagram</a>
            <a v-if="settings?.social_facebook || settings?.social_media?.facebook" :href="settings?.social_facebook || settings?.social_media?.facebook" target="_blank" class="hover:opacity-100 transition-opacity uppercase tracking-widest">Facebook</a>
          </div>
          <p class="tracking-wide">&copy; Halo Arsitek Studio.</p>
        </footer>
      </div>
    </div>

    <!-- Middle Left Hamburger Menu Toggle (Nav) -->
    <div class="fixed top-1/2 -translate-y-1/2 left-6 md:left-8 z-50">
      <button 
        @click="toggleMainMenu"
        class="hover:scale-105 active:scale-95 transition-all duration-300 p-1 cursor-pointer"
        :class="[isDarkPage && !isMainMenuOpen ? 'text-white drop-shadow-md hover:text-white/80' : !isMainMenuOpen ? 'text-gray-900 hover:text-gray-600' : 'text-[#eae7e1]/70 hover:text-[#eae7e1]']"
        aria-label="Toggle menu"
      >
        <svg 
          v-if="!isMainMenuOpen" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.0" 
          stroke="currentColor" 
          class="w-8 h-8 md:w-10 md:h-10"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <svg 
          v-else 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="0.8" 
          stroke="currentColor" 
          class="w-10 h-10 md:w-12 md:h-12"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Main Content Area -->
    <main 
      ref="mainScrollRef"
      class="w-full flex-1 h-[100dvh] overflow-y-auto overflow-x-hidden custom-scrollbar relative"
    >
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </main>

    <!-- Mobile Minimal Copyright -->
    <div v-if="route.path !== '/contact'" :class="['md:hidden fixed bottom-0 w-full z-30 pointer-events-none flex justify-end items-end pb-6 pr-6 pt-24', 
      isDarkPage && !isMainMenuOpen ? '' : 'bg-gradient-to-t from-[#f3f3f3] via-[#f3f3f3]/80 to-transparent']">
      <p :class="['text-[10px] font-light transition-colors duration-500', 
        isDarkPage && !isMainMenuOpen 
          ? 'text-white drop-shadow-md opacity-70' 
          : 'text-gray-900 opacity-70']">
        &copy; Halo Arsitek Studio.
      </p>
    </div>

    <!-- Global Menu Overlay -->
    <Transition name="menu-fade">
      <div 
        v-if="isMainMenuOpen" 
        class="fixed inset-0 z-40 bg-[#555d50] select-none cursor-default"
        style="background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0.12) 100%), url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.055\'/%3E%3C/svg%3E');"
      >
        <!-- Center: Navigation Links -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-10 md:space-y-16 items-start text-left">
          <RouterLink 
            to="/" 
            :class="['text-base md:text-lg font-light tracking-[0.2em] transition-all duration-300 flex items-center gap-3',
              isLinkActive('/') ? 'text-white font-normal' : 'text-[#eae7e1]/80 hover:text-white hover:pl-1']"
            @click="closeMainMenu"
          >
            <span>Home</span>
            <span v-if="isLinkActive('/')" class="w-1.5 h-1.5 rounded-full bg-white"></span>
          </RouterLink>
          <RouterLink 
            to="/works" 
            :class="['text-base md:text-lg font-light tracking-[0.2em] transition-all duration-300 flex items-center gap-3',
              isLinkActive('/works') ? 'text-white font-normal' : 'text-[#eae7e1]/80 hover:text-white hover:pl-1']"
            @click="closeMainMenu"
          >
            <span>Works</span>
            <span v-if="isLinkActive('/works')" class="w-1.5 h-1.5 rounded-full bg-white"></span>
          </RouterLink>
          <RouterLink 
            to="/about" 
            :class="['text-base md:text-lg font-light tracking-[0.2em] transition-all duration-300 flex items-center gap-3',
              isLinkActive('/about') ? 'text-white font-normal' : 'text-[#eae7e1]/80 hover:text-white hover:pl-1']"
            @click="closeMainMenu"
          >
            <span>About</span>
            <span v-if="isLinkActive('/about')" class="w-1.5 h-1.5 rounded-full bg-white"></span>
          </RouterLink>
          <RouterLink 
            to="/news" 
            :class="['text-base md:text-lg font-light tracking-[0.2em] transition-all duration-300 flex items-center gap-3',
              isLinkActive('/news') ? 'text-white font-normal' : 'text-[#eae7e1]/80 hover:text-white hover:pl-1']"
            @click="closeMainMenu"
          >
            <span>News</span>
            <span v-if="isLinkActive('/news')" class="w-1.5 h-1.5 rounded-full bg-white"></span>
          </RouterLink>
          <RouterLink 
            to="/contact" 
            :class="['text-base md:text-lg font-light tracking-[0.2em] transition-all duration-300 flex items-center gap-3',
              isLinkActive('/contact') ? 'text-white font-normal' : 'text-[#eae7e1]/80 hover:text-white hover:pl-1']"
            @click="closeMainMenu"
          >
            <span>Contact</span>
            <span v-if="isLinkActive('/contact')" class="w-1.5 h-1.5 rounded-full bg-white"></span>
          </RouterLink>
        </div>
      </div>
    </Transition>
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

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* Hide global elements when landing menu is open */
body.landing-menu-open footer {
  display: none !important;
}
body.landing-menu-open .md\:hidden.fixed.bottom-0 {
  display: none !important;
}
</style>
