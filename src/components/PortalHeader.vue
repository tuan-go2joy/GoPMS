<template>
  <div :class="$style['portal-header']">
    <div 
      :class="[$style['portal-header__logo'], isCollapse ? $style['is-collapse'] : '' ]"
    >
      <img
        :class="$style['logo-big']"
        src="@/assets/images/logo.png"
      >
      <img
        :class="$style['logo-small']"
        src="@/assets/images/logo-small.png"
      >
    </div>
    <div :class="$style['portal-header__toggle']">
      <span :class="$style['portal-header__toggle--container']">
        <el-icon
          :size="20"
          @click="changeCollapse"
        >
          <i
            v-if="isCollapse"
            class="el-icon-s-unfold"
          />
          <i
            v-else
            class="el-icon-s-fold"
          />
        </el-icon>
      </span>
    </div>
    <div :class="$style['portal-header__right']">
      <el-dropdown
        :append-to-body="false"
        :class="$style['portal-header__language']"
        @command="changeLocale"
      >
        <span class="el-dropdown-link">
          <img
            v-if="flag == 'en'"
            src="@/assets/images/svg/en.svg"
          >
          <img
            v-if="flag == 'vi'"
            src="@/assets/images/svg/vi.svg"
          >
        </span>
        <template #dropdown>
          <el-dropdown-menu 
            :append-to-body="false"
          >
            <el-dropdown-item
              v-for="entry in languages"
              :key="entry.title"
              :command="entry.language"
              :class="$style['portal-header__language--flex']"
            >
              <img
                v-if="entry.language == 'en'"
                src="@/assets/images/svg/en.svg"
              >
              <img
                v-else-if="entry.language == 'vi'"
                src="@/assets/images/svg/vi.svg"
              >
              <span>
                {{ entry.title }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown
        :class="$style['portal-header__avatar']"
        @command="onDirect"
      >
        <img
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        >
        <template #dropdown>
          <el-dropdown-menu :append-to-body="false">
            <el-dropdown-item
              command="userName"
            >
              <span type="danger">{{ userName }}</span>
            </el-dropdown-item>
            <el-dropdown-item
              v-for="entry in accountInfo"
              :key="entry.title"
              class="dropdown-item"
              :command="entry.nameRouter"
            >
              <i :class="entry.icon" /> {{ t(entry.title) }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Emitter } from 'mitt'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: "PortalHeader",
  components: {
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElIcon,
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    // data
    const { t, locale } = useI18n()
    const flag = locale
    const router = useRouter()
    const emitter = inject('emitter') as Emitter<any>
    const userName = ref({})
    userName.value = JSON.parse(localStorage.getItem('profile') || '{}').value?.fullName
    const languages = [
      { flag: 'us', language: 'en', title: 'English' },
      { flag: 'vn', language: 'vi', title: 'Vietnamese' }
    ]
    const accountInfo =  [
      { nameRouter: 'profile', title: 'breadcrumb.myProfile', icon: 'el-icon-user' },
      { nameRouter: 'Login', title: 'breadcrumb.logout', icon: 'el-icon-switch-button' }
    ]
    // life cycle
    onMounted(
      () => {
        emitter.on('setFrofile', async () => {
          userName.value = JSON.parse(localStorage.getItem('profile') || '{}').value?.fullName
        })
      }
    )
    // methos
    const changeLocale = (lang: string|null) => {
      locale.value = lang || 'vi'
      flag.value = lang || ''
      localStorage.setItem('lang', lang || '{}')
      emitter.emit('changeLang')
    }
    const changeCollapse = () => {
      context.emit('changeCollapse')
    }
    const onDirect = async (nameRouter: string) => {
      if (nameRouter === 'userName') {
        return false
      }
      if (nameRouter === 'Login') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('profile')
        await router.push({ name: 'Login' })
        emitter.emit('logout')
      } else {
        router.push({ name: nameRouter })
      }
      
    }
    return {
      t,
      locale,
      languages,
      flag,
      accountInfo,
      userName,
      changeLocale,
      changeCollapse,
      onDirect
    }
  },
})
</script>
<style lang="stylus" module>
.portal-header
  display flex
  justify-content space-between
  align-items center
  height 100%
  .dropdown-item
    i
      margin-right 10px
  &__logo
    width 200px
    @media (min-width 766px)
      .logo-big
        display unset
        .el-image__inner
          width value 170px
          padding-top 4px
      .logo-small
        display none
  .header-image.is-collapse
    width 46px
    @media (min-width 766px)
      .logo-big
        display none
        img
          width 170px
          padding-top 4px
      .logo-small
        display unset
  .logo-big,
  .logo-small
    height 36px
    padding-top 4px
    object-fit scale-down
  &__toggle
    flex 1
    text-align left
    &--container
      border-radius 4px
      display flex
      width 32px
      height 32px
      align-items center
      justify-content center
      transition all .1s ease-in
      &:hover
        background-color rgba(129, 167, 205, 0.1)
      i
        cursor pointer
        font-size 20px
        color $primary
  &__right
    display flex
    justify-content space-between
    align-items center
  &__language-image
    font-size initial
    border none
    cursor pointer
    width 20px
    height 20px
  &__avatar
    cursor pointer
    width 22px
    height 22px
    border-radius 50%
    border 1px solid $grey-light
    overflow hidden
    img
      width 20px
      height 20px
      object-fit contain
  &__language
    margin-right 16px
    width 22px
    height 22px
    display flex
    align-items center
    justify-content center
    &--flex
      display flex
      align-items center
      span
        margin-left $space * 3
    :global
      .el-dropdown-menu__item
        display flex
        align-items center
        img
          margin-right $space * 2
    img
      cursor pointer
</style>