import router from '@/router'
router.addRoute({
  name: 'MyBooking',
  path: '/my-booking',
  component: () => import('./View.vue')
})