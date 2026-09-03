<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getTeam, getSettings } from '@/api/services'
import { useSEO } from '@/composables/useSEO'
import { getImageUrl } from '@/config'

useSEO(() => ({
  title: 'About Us',
  description: 'Mengenal lebih dekat visi, filosofi desain, dan tim arsitek HALO ARSITEK.'
}))

const settings = ref<any>(null)
const teamMembers = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [teamRes, settingsRes] = await Promise.all([
      getTeam(),
      getSettings()
    ])
    
    if (teamRes.data?.success && teamRes.data.data?.length > 0) {
      teamMembers.value = teamRes.data.data.map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role || member.position,
        image: member.image ? getImageUrl(member.image) : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&h=400&auto=format&fit=crop&crop=face',
        bio: member.bio
      }))
    }
    
    if (settingsRes.data?.success) {
      settings.value = settingsRes.data.data
    }
  } catch (error) {
    console.error('Error fetching about data', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full min-h-full bg-white relative flex flex-col items-center">
    
    <!-- Top Container: White Section (Hero, Banner, Story) -->
    <div class="w-full px-8 sm:px-12 md:px-24 lg:px-32 box-border flex flex-col">
      
      <!-- Hero Statement (Centered) -->
      <div class="w-full max-w-4xl mx-auto text-center pt-28 md:pt-36 pb-12 md:pb-16 flex flex-col items-center animate-fade-up">
        <h1 class="text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] font-normal text-gray-900 tracking-tight leading-snug mb-5 select-none">
          {{ settings?.hero_subtitle || 'Great Design Creates Great Stories.' }}
        </h1>
        <p class="text-sm sm:text-base md:text-lg lg:text-[19px] font-light text-gray-800 leading-relaxed max-w-3xl select-none">
          {{ settings?.about_vision || 'We believe architecture should do more than solve functional needs. It should shape experiences, foster connections, and create stories that last for generations.' }}
        </p>
      </div>

      <!-- Panoramic Team Banner Image -->
      <div class="w-full aspect-[2.2/1] sm:aspect-[2.5/1] md:aspect-[2.8/1] overflow-hidden bg-gray-100 rounded-none mb-16 md:mb-24 shadow-sm animate-fade-up delay-150">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop" 
          alt="Halo Arsitek Team" 
          class="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000 ease-out"
          onerror="this.src='https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1920&auto=format&fit=crop'"
        />
      </div>

      <!-- Two-Column Narrative Section -->
      <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start pb-20 md:pb-28 animate-fade-up delay-300">
        <!-- Left: Founding & Mission -->
        <div class="md:col-span-5 flex flex-col">
          <p class="text-sm sm:text-base font-light text-gray-800 leading-relaxed select-none">
            {{ settings?.about_description || 'Founded in 2015, HALO ARSITEK is a Jakarta-based architecture studio dedicated to creating thoughtful and enduring spaces.' }}
          </p>
        </div>
        
        <!-- Right: Belief & Philosophy -->
        <div class="md:col-span-7 flex flex-col">
          <p class="text-lg sm:text-xl md:text-2xl font-light text-gray-900 leading-relaxed select-none">
            {{ settings?.about_philosophy || 'Guided by the belief that great design creates great stories, we create architecture that responds to its context, supports everyday life, and grows together with the people who inhabit it.' }}
          </p>
        </div>
      </div>

    </div>

    <!-- Bottom Container: Warm Beige Section for Team (Full Width with background #f4f2ec) -->
    <div class="w-full bg-[#f4f2ec] py-20 md:py-28 flex justify-center">
      <div class="w-full px-8 sm:px-12 md:px-24 lg:px-32 box-border flex flex-col">
        <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24">
          
          <div 
            v-for="member in teamMembers" 
            :key="member.id || member.name"
            class="flex flex-col space-y-6"
          >
            <!-- Member Avatar + Name / Role -->
            <div class="flex items-center gap-6">
              <div class="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-gray-200 overflow-hidden rounded-none shadow-sm">
                <img 
                  :src="member.image" 
                  :alt="member.name" 
                  class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&fit=crop&crop=face'"
                />
              </div>
              <div class="flex flex-col">
                <h3 class="text-base sm:text-lg font-normal text-gray-900 select-none">
                  {{ member.name }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-500 font-light mt-0.5 select-none">
                  {{ member.role }}
                </p>
              </div>
            </div>

            <!-- Bio Description -->
            <p class="text-xs sm:text-sm font-light text-gray-800 leading-relaxed select-none pr-4" v-html="member.bio">
            </p>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
