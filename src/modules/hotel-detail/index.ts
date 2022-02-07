import router from '@/router'
router.addRoute({
  name: 'HotelDetails',
  path: '/hotel-details/:sn',
  component: () => import('./View.vue')
})

