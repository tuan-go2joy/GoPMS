import router from '@/router'

router.addRoute({
  name: 'ForgotPassword',
  path: '/forgot-password',
  component: () => import('./View.vue')
})
