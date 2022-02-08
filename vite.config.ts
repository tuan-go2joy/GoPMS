import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const pathSrc = resolve(__dirname, "src")
export default defineConfig({
  base: '/test/',
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": pathSrc
    }
  },
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [resolve(__dirname, 'src/assets/styles/variables.styl')]
      }
    }
  }
})