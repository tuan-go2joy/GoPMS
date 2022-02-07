import router from '@/router'
router.addRoute({
  name: 'Revenues',
  path: '/revenues',
  component: () => import('./View.vue')
})