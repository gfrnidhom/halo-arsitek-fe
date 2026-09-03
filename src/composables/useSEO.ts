import { watchEffect, ref } from 'vue'
import { getSettings } from '@/api/services'
import { getImageUrl } from '@/config'

export interface SEOOptions {
  title?: string
  description?: string
  image?: string
}

const cachedSettings = ref<any>(null)
let isFetchingSettings = false

export function useSEO(getOptions: () => SEOOptions) {
  if (!cachedSettings.value && !isFetchingSettings) {
    isFetchingSettings = true
    getSettings().then(res => {
      if (res.data && res.data.success) {
        cachedSettings.value = res.data.data
      }
    }).catch(err => {
      console.error('Failed to load SEO settings', err)
    }).finally(() => {
      isFetchingSettings = false
    })
  }

  const updateMetaTag = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name'
    let meta = document.querySelector(`meta[${attr}="${name}"]`)

    if (!content) {
      if (meta) meta.remove()
      return
    }

    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attr, name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  watchEffect(() => {
    const options = getOptions()
    const settings = cachedSettings.value || {}
    const siteName = settings.site_name || 'Halo Arsitek Studio.'
    const fullTitle = options.title ? `${options.title} | ${siteName}` : siteName

    document.title = fullTitle

    const description = options.description || settings.seo_meta_description || settings.site_description || ''

    updateMetaTag('description', description)
    updateMetaTag('og:description', description, true)
    updateMetaTag('twitter:description', description)

    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('twitter:title', fullTitle)

    const defaultImage = settings.site_logo ? getImageUrl(settings.site_logo) : ''
    const image = options.image || defaultImage

    updateMetaTag('og:image', image, true)
    updateMetaTag('twitter:image', image)
    
    if (settings.seo_meta_keywords) {
      updateMetaTag('keywords', settings.seo_meta_keywords)
    }
    if (settings.seo_author) {
      updateMetaTag('author', settings.seo_author)
    }

    // Default open graph types
    updateMetaTag('og:type', 'website', true)
    updateMetaTag('twitter:card', 'summary_large_image')
  })
}
