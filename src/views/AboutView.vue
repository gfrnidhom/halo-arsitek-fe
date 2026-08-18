<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getTeam, getSettings } from '@/api/services'
import { useSEO } from '@/composables/useSEO'

useSEO(() => ({
  title: 'About Us',
  description: 'Mengenal lebih dekat visi, filosofi desain, dan tim arsitek HALO ARSITEK.'
}))

const settings = ref<any>(null)
const teamMembers = ref<any[]>([])
const loading = ref(true)

const defaultTeam = [
  {
    id: 'elang-mulya',
    name: 'Elang Mulya',
    role: 'Principal',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop&crop=face',
    bio: "As Principal Architect, Elang leads every project with a commitment to thoughtful design, ensuring each space reflects Halo Arsitek's design philosophy and quality standards."
  },
  {
    id: 'mentari-murti',
    name: 'Mentari Murti',
    role: 'Studio Manager',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&auto=format&fit=crop&crop=face',
    bio: "Since joining Halo Arsitek in 2020, Mentari has contributed to a wide range of residential and commercial projects. She holds a Master's degree in Architecture from Petra Christian University and is a licensed architect (IAI)."
  }
]

const getFallbackBio = (member: any, index: number) => {
  const firstName = member.name?.split(' ')[0] || 'Our team member'
  if (index === 0) {
    return `As Principal Architect, ${firstName} leads every project with a commitment to thoughtful design, ensuring each space reflects Halo Arsitek's design philosophy and quality standards.`
  }
  if (index === 1) {
    return `Since joining Halo Arsitek, ${firstName} has contributed to a wide range of residential and commercial projects. ${firstName} holds a Master's degree in Architecture and is dedicated to quality craftsmanship.`
  }
  return `${member.name} contributes to architectural excellence and thoughtful design at Halo Arsitek.`
}

onMounted(async () => {
  try {
    const [teamRes, settingsRes] = await Promise.all([
      getTeam(),
      getSettings()
    ])
    if (teamRes.data?.success && teamRes.data.data?.length > 0) {
      // Map API members with fallback bios and normalize field names
      teamMembers.value = teamRes.data.data.map((member: any, index: number) => ({
        id: member.id || `team-${index}`,
        name: member.name || defaultTeam[index]?.name || 'Architect',
        role: member.role || member.position || defaultTeam[index]?.role || 'Architect',
        image: member.image || member.photo_url || defaultTeam[index]?.image || defaultTeam[0].image,
        bio: member.bio || getFallbackBio(member, index)
      }))
    } else {
      teamMembers.value = defaultTeam
    }
    if (settingsRes.data?.success) {
      settings.value = settingsRes.data.data
    }
  } catch (error) {
    console.error('Error fetching about data', error)
    teamMembers.value = defaultTeam
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full min-h-full bg-white relative flex flex-col items-center">
    
    <!-- Top Container: White Section (Hero, Banner, Story) -->
    <div class="w-full max-w-[1280px] px-8 sm:px-12 md:px-16 box-border flex flex-col">
      
      <!-- Hero Statement (Centered) -->
      <div class="w-full max-w-4xl mx-auto text-center pt-28 md:pt-36 pb-12 md:pb-16 flex flex-col items-center">
        <h1 class="text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] font-normal text-gray-900 tracking-tight leading-snug mb-5 select-none">
          Great Design Creates Great Stories.
        </h1>
        <p class="text-sm sm:text-base md:text-lg lg:text-[19px] font-light text-gray-800 leading-relaxed max-w-3xl select-none">
          We believe architecture should do more than solve functional needs. It should shape experiences, foster connections, and create stories that last for generations.
        </p>
      </div>

      <!-- Panoramic Team Banner Image -->
      <div class="w-full aspect-[2.2/1] sm:aspect-[2.5/1] md:aspect-[2.8/1] overflow-hidden bg-gray-100 rounded-none mb-16 md:mb-24 shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop" 
          alt="Halo Arsitek Team" 
          class="w-full h-full object-cover object-center"
          onerror="this.src='https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1920&auto=format&fit=crop'"
        />
      </div>

      <!-- Two-Column Narrative Section -->
      <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start pb-20 md:pb-28">
        <!-- Left: Founding & Mission -->
        <div class="md:col-span-5 flex flex-col">
          <p class="text-sm sm:text-base font-light text-gray-800 leading-relaxed select-none">
            Founded in 2015, HALO ARSITEK is a Jakarta-based architecture studio dedicated to creating thoughtful and enduring spaces.
          </p>
        </div>
        
        <!-- Right: Belief & Philosophy -->
        <div class="md:col-span-7 flex flex-col">
          <p class="text-lg sm:text-xl md:text-2xl font-light text-gray-900 leading-relaxed select-none">
            Guided by the belief that great design creates great stories, we create architecture that responds to its context, supports everyday life, and grows together with the people who inhabit it.
          </p>
        </div>
      </div>

    </div>

    <!-- Bottom Container: Warm Beige Section for Team (Full Width with background #f4f2ec) -->
    <div class="w-full bg-[#f4f2ec] py-20 md:py-28 flex justify-center">
      <div class="w-full max-w-[1280px] px-8 sm:px-12 md:px-16 box-border flex flex-col">
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
            <p class="text-xs sm:text-sm font-light text-gray-800 leading-relaxed select-none pr-4">
              {{ member.bio }}
            </p>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
