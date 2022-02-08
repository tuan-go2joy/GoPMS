import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const routes = setupLayouts(generatedRoutes);

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuth();

  switch (isLoggedIn.value) {
    case true:
      if (to.path === '/auth/sign-in') {
        router.replace('/');
        return;
      }
      return next();
    case false:
      if (to.path !== '/auth/sign-in') {
        router.replace('/auth/sign-in');
        return;
      }
      return next();
  }
});
