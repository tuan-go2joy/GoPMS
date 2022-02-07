<template>
  <el-menu
    fixed
    :class="$style['portal-sidebar']"
    :collapse="isCollapse"
    :default-active="$route.path"
  >
    <el-menu-item
      v-for="menu in menus"
      :key="menu.title"
      :index="menu.path"
      :class="[
        {[$style['is-active']] : setActive(menu.actives)},
        $style['portal-sidebar__item']
      ]"
      @click="$router.push({ name: menu.title })"
    >
      <i :class="menu.icon" />
      <template #title>
        <span>{{ t(`breadcrumb.${menu.title}`, {}, { locale: locale }) }}</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { ElMenu, ElMenuItem } from 'element-plus'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'PortalSidebar',
  components: {
    ElMenu,
    ElMenuItem
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    // data
    const { locale, t } = useI18n()
    const menus = ref([{
        title: 'MyBooking',
        path: '/my-booking',
        icon: 'el-icon-office-building',
        actives: ['SearchBooking', 'BookingDetails']
      }, {
        title: 'Revenues',
        path: '/revenues',
        icon: 'el-icon-s-data',
        actives: ['RevenuesDetail']
      }
      ]
    )
    const route = useRoute()
    // methods
    const setActive = (actives) => {
      if (actives && actives.length === 0) {
        return false
      }
      const result = actives.find(item => item === route.name)
      return !!result
    }
    return {
      setActive,
      t,
      locale,
      menus
    }
  },
})
</script>
<style lang="stylus" module>
.portal-sidebar
  border-right none
  &__item.is-active
    color $primary
  :global
    .el-menu-item.is-active
      color $primary
    .el-menu-item
      &:hover
        color $primary
.el-image
  height 100%
  width 170px
  padding-top 10px
  padding-left 10px
</style>