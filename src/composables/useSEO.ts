import { watchEffect } from 'vue'

export interface SEOOptions {
  title: string
  description?: string
  image?: string
}

export function useSEO(getOptions: () => SEOOptions) {
  const siteName = 'Halo Arsitek'

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
    const fullTitle = `${options.title} | ${siteName}`

    document.title = fullTitle

    updateMetaTag('description', options.description || '')
    updateMetaTag('og:description', options.description || '', true)
    updateMetaTag('twitter:description', options.description || '')

    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('twitter:title', fullTitle)

    updateMetaTag('og:image', options.image || '', true)
    updateMetaTag('twitter:image', options.image || '')

    // Default open graph types
    updateMetaTag('og:type', 'website', true)
    updateMetaTag('twitter:card', 'summary_large_image')
  })
}
