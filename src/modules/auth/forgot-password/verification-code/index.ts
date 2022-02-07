import router from '@/router'

router.addRoute({
  name: 'VerificationCode',
  path: '/verification-code',
  component: () => import('./View.vue')
})