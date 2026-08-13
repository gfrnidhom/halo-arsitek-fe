<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="w-full h-[100dvh] overflow-hidden bg-white relative flex justify-center">
    <div class="w-full h-full max-w-[1280px] relative px-8 sm:px-12 md:px-16 box-border">
      
      <!-- Top Row (Snaps to container edges, pushed down to clear global logo) -->
      <div class="absolute top-[88px] left-8 sm:left-12 md:left-16 right-8 sm:right-12 md:right-16 flex flex-row justify-between items-start gap-8 z-20">
        <!-- Left: Breadcrumbs -->
        <div class="flex items-center text-xs md:text-sm font-light tracking-wide select-none">
          <RouterLink to="/" class="text-gray-400 hover:text-gray-900 transition-colors">Home</RouterLink>
          <span class="text-gray-800 font-normal ml-1">/Works</span>
        </div>
        
        <!-- Right: Studio Description -->
        <div class="max-w-[560px] md:max-w-[620px] text-left md:text-right text-xs md:text-sm lg:text-[14px] font-light leading-relaxed text-gray-700 select-none">
          HALO ARSITEK is a Jakarta-based architecture studio designing residential and commercial<br class="hidden md:inline" />
          spaces with one belief at the core: Great Design Creates Great Stories.
        </div>
      </div>

      <!-- Center: Hero Title & Link (Perfectly Centered in Center Middle) -->
      <div class="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-8 sm:px-12 md:px-16 box-border flex flex-col items-center">
        <!-- Main Big Text -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-[4.8vw] font-extralight tracking-tight text-[#111] leading-[1.1] text-center select-none whitespace-nowrap">
          Creating Architecture That Tells Great Stories
        </h1>
        
        <!-- Discover Works Link -->
        <div class="w-full max-w-[90vw] lg:max-w-[1000px] mx-auto flex justify-end mt-6 sm:mt-8 md:mt-12 pr-4 lg:pr-6">
          <RouterLink 
            to="/projects" 
            class="group flex items-center gap-3 md:gap-4 text-sm md:text-base font-normal tracking-wide text-gray-900 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <span>Discover works</span>
            <svg class="-translate-y-[1px] w-6 md:w-8 h-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 56 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6H44" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <polygon points="42,2 52,6 42,10" fill="currentColor"/>
            </svg>
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>
