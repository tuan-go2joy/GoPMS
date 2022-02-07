<template>
  <portal-section style="flex: 1;">
    <div :class="$style['not-found']">
      <div :class="$style['not-found__container']">
        <div :class="$style['not-found__logo']">
          <img
            src="@/assets/images/logo.png"
            alt="logo.png"
          >
        </div>
        <div :class="$style['not-found__content']">
          <div :class="$style['not-found__image-404']">
            <img
              src="@/assets/images/svg/404.svg"
              alt="404.svg"
            >
          </div>
          <div :class="$style['not-found__title']">
            Oops! Page not found
          </div>
          <div :class="$style['not-found__desc']">
            We did not find the page you are looking for. Please return to previous page or visit home page.
          </div>
        </div>
        <div :class="$style['not-found__button']">
          <el-button
            type="warning"  
            icon="el-icon-refresh-left"
            @click="$router.go(-1)"
          >
            Go Back
          </el-button>
        </div>
        <div />
      </div>
    </div>
  </portal-section>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'NotFoundPage'
})
</script>
<style lang="stylus" module>
.not-found
  display: flex
  align-items: center
  justify-content: center
  height: 100%
  &__container
    width 40%
    text-align: center
  &__logo
    text-align: center
    margin-bottom $space * 6
    img
      max-width 150px
      height 100%
  &__image-404
    margin $space * 6 0
    img
      max-width: 500px
      object-fit: contain
  &__title
    margin $space * 10 0 $space * 3 0
    font-size 24px
    font-weight 600
  &__desc
    color $grey-dark
    margin-bottom $space * 6
</style>