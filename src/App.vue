<template>
  <div :class="$style['app']">
    <component :is="layout" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from 'vue'
import { Emitter } from 'mitt'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const layout = ref('guest-layout')
    const emitter = inject('emitter') as Emitter<any>
    onMounted(
      () => {
        setlayout()
        emitter.on('login', async () => {
          layout.value = 'member-layout'
        })
        emitter.on('logout', async () => {
          layout.value = 'guest-layout'
        })
      }
    )
    const setlayout = async () => {
      const token = await localStorage.getItem('access_token')
      if (token) {
        layout.value = 'member-layout'
      } else {
        layout.value = 'guest-layout'
        router.push({ name: 'Login' })
      }
    }
    return {
      layout,
    }
  }
})
</script>
<style lang="stylus" module>
.app
  min-height 100vh
  font-size 16px
</style>