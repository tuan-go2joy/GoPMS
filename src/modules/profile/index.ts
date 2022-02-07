import router from '@/router'
router.addRoute({
  name: 'profile',
  path: '/profile',
  component: () => import('./View.vue'),
  meta: { layout: 'guest-layout' }
})