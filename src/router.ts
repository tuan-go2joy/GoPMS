import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import i18n from '@/plugins/i18n'
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    redirect: {
      name: "MyBooking"
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach((to, from, next) => {
  document.title = i18n.global.t(`breadcrumb.${to.name?.toString() || ''}`)
  const token = localStorage.getItem('access_token')
  if(token && (to.name === 'Login' || to.name === 'ForgotPassword' || to.name === 'ChangePassword' || to.name === 'VerificationCode')) {
    next({ name: 'MyBooking' })
  } 
  else {
    next()
  }
})

export default router
