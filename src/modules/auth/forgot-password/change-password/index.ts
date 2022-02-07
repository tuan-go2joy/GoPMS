import router from '@/router'
router.addRoute({
  name: 'ChangePassword',
  path: '/change-password',
  component: () => import('./View.vue')
})