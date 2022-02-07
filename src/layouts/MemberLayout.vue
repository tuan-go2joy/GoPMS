<template>
  <el-container :class="$style['member-layout'] ">
    <el-header :class="[$style['header-section'], isActive]">
      <PortalHeader             
        :is-collapse="isCollapse"
        @change-collapse="changeCollapse"
      />
    </el-header>
    <el-container>
      <el-aside
        :is-collapse="isCollapse"
        :class="[$style['left-section'], isActive]"
      >
        <PortalSidebar :is-collapse="isCollapse" />
      </el-aside>
      <el-main :class="[$style['main-section'], isActive]">
        <div :class="$style['main-section__topbar']">
          <PortalTopbar />
        </div>
        <div :class="$style['main-section__content']">
          <router-view />
        </div>
      </el-main>
    </el-container>
    <PortalFooter />
  </el-container>
</template>
<script lang="ts">
import { defineComponent, ref, computed, useCssModule, onMounted } from 'vue'
import PortalHeader from '@/components/PortalHeader.vue'
import PortalFooter from '@/components/PortalFooter.vue'
import PortalSidebar from '@/components/PortalSidebar.vue'
import PortalTopbar from '@/components/PortalTopbar.vue'
import { ElHeader, ElContainer, ElAside, ElMain } from 'element-plus'

export default defineComponent({
  name: 'MemberLayout',
  components: {
    PortalHeader,
    PortalSidebar,
    PortalTopbar,
    PortalFooter,
    ElHeader,
    ElContainer,
    ElAside,
    ElMain
  },
  setup() {
    const isCollapse = ref(false);
    const style = useCssModule()
    const isActive = computed (() => {
      return isCollapse.value ? '' : style.active
    });
    onMounted(() => {
      if (window.screen.width < 766) {
        isCollapse.value = true
      }
    })
    const changeCollapse = () => {
      isCollapse.value = !isCollapse.value
    }
    return {
      isCollapse,
      isActive,
      changeCollapse
    }
  }
})
</script>
<style lang="stylus" module>
.member-layout
  .header-section
    width calc(100% - 193px)
    right 0
    top 0
    position fixed
    background $white
    width 100%
    z-index 100
    padding 0 $space * 10 0 $space * 5
  .left-section
    z-index 99
    position fixed
    text-align left
    min-height 100vh
    width 0 !important
    transition width 0.5s
    padding-top $space * 15
    top 0
    bottom 0
    overflow-y scroll
    overflow-x hidden
    &::-webkit-scrollbar
      width 1px
  .left-section.active 
    width 220px !important
  .main-section
    margin-top $space * 15
    min-height calc(100vh - 108px)
    display flex
    flex-direction column
    background-color #f2f5fa
    &__content
      flex 1
      display flex
      flex-direction column
    &__topbar
      background-color $white
    &__topbar
      margin-bottom $space * 7.5
  @media (min-width: 766px)
    .left-section 
      width 6% !important
    .main-section
      margin-left $space * 16
      transition all 0.5s ease
      height 100%
    .main-section.active
      margin-left 220px
</style>