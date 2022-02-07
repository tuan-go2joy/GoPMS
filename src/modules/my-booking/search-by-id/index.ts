import router from '@/router'
router.addRoute({
  name: 'SearchBooking',
  path: '/search-booking',
  component: () => import('./View.vue')
})