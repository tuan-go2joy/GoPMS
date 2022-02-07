import router from '@/router'
router.addRoute({
  name: 'Login',
  path: '/login',
  component: () => import('./View.vue')
})