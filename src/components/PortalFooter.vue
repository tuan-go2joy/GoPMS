<template>
  <div :class="$style['portal-footer']">
    © 2021 Go2Joy - All Rights Reserved.
  </div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PortalFooter'
})
</script>
<style lang="stylus" module>
.portal-footer
  background-color $white
  display flex
  align-items center
  justify-content center
  height 48px
</style>