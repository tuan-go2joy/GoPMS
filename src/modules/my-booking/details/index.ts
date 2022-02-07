import router from '@/router'
router.addRoute({
  name: 'BookingDetails',
  path: '/booking-details/:sn',
  component: () => import('./View.vue')
})