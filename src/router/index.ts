import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('../views/WorksView.vue')
    },
    {
      path: '/project',
      alias: ['/projects'],
      name: 'project-grid',
      component: () => import('../views/ProjectGridView.vue')
    },
    {
      path: '/works/:slug',
      alias: ['/project/:slug'],
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue')
    },
    {
      path: '/news/:slug',
      name: 'news-detail',
      component: () => import('../views/NewsDetailView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    }
  ]
})

export default router
