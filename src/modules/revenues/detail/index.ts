import router from '@/router'
router.addRoute({
  name: 'RevenuesDetail',
  path: '/revenues-detail/:sn',
  component: () => import('./View.vue')
})