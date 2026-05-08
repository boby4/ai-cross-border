import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/batch',
      name: 'batch',
      component: () => import('@/views/BatchGenerate.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/History.vue')
    }
  ]
})

export default router
