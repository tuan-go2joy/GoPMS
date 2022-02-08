import vueI18n from '@intlify/vite-plugin-vue-i18n';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    Pages({
      dirs: [
        { dir: 'src/pages', baseRoute: '' },
        { dir: 'src/modules/auth/pages', baseRoute: 'auth' },
        { dir: 'src/modules/profile/pages', baseRoute: 'profile' },
        { dir: 'src/modules/room-settings/pages', baseRoute: 'settings/room-settings' },
      ],
    }),
    Layouts(),
    quasar({
      sassVariables: 'src/styles/quasar-variables.sass',
    }),
    vueI18n({ include: 'locales/**' }),
  ],
  // eslint-disable-next-line
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
