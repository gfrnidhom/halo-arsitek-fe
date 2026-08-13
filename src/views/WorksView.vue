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
        <div class="text-right text-[11px] md:text-[13px] font-normal leading-[1.6] text-[#111] tracking-wide select-none">
          HALO ARSITEK is a Jakarta-based architecture<br />
          studio designing residential and commercial<br />
          spaces with one belief at the core: Great Design<br />
          Creates Great Stories.
        </div>
      </div>

      <!-- Center: Hero Title & Link (Spans full width with padding to match edges perfectly) -->
      <div class="absolute top-[48%] left-0 right-0 -translate-y-1/2 w-full px-8 sm:px-12 md:px-16 box-border flex flex-col">
        <!-- Main Big Text -->
        <h1 class="w-full text-[28px] sm:text-[36px] md:text-[4vw] lg:text-[4.2vw] font-light tracking-tight text-[#111] leading-[1.1] select-none whitespace-nowrap" style="text-align: justify; text-align-last: justify; text-justify: inter-word;">
          Creating Architecture That Tells Great Stories
        </h1>
        
        <!-- Discover Works Link -->
        <div class="w-full flex justify-end">
          <RouterLink 
            to="/projects" 
            class="group flex items-center gap-3 mt-4 md:mt-6 text-sm md:text-base font-normal tracking-wide text-gray-900 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <span>Discover works</span>
            <!-- A slightly longer arrow matching mockup -->
            <svg class="-translate-y-[1px] w-8 md:w-10 h-[10px] transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 64 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6H54" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <polygon points="52,1 62,6 52,11" fill="currentColor"/>
            </svg>
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>
