import api from './index'

export const getProjects = (page = 1) => api.get(`/api/projects?page=${page}`)
export const getHeadlinerProjects = () => api.get('/api/projects/headliners')
export const getProjectBySlug = (slug: string) => api.get(`/api/projects/${slug}`)

export const getNews = (page = 1) => api.get(`/api/news?page=${page}`)
export const getNewsBySlug = (slug: string) => api.get(`/api/news/${slug}`)

export const getTestimonials = () => api.get('/api/content/testimonials')
export const getServices = () => api.get('/api/content/services')
export const getTeam = () => api.get('/api/content/team')
export const getCategories = () => api.get('/api/content/categories')

export const getSettings = () => api.get('/api/settings')

export const submitContactForm = (data: any) => api.post('/api/contact', data)
