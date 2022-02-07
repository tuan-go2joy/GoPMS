<template>
  <div :class="$style['verification-code']">
    <div :class="$style['verification-code__container']">
      <div :class="$style['verification-code__img']">
        <img
          src="@/assets/images/logo-small.png"
          alt="logo-go2joy.png"
        >
      </div>
      <div :class="$style['verification-code__title']">
        Forgot Password
      </div>
      <div :class="$style['verification-code__desc']">
        Enter your verification code
      </div>
      <el-form
        @submit.prevent="submitForm"
      >
        <el-form-item>
          <el-input 
            v-model="formData.verifyCode"
            placeholder="Verification code"
          />
        </el-form-item>
        <el-form-item>
          <div :class="$style['verification-code__countdown']">
            {{ timeDown }}
          </div>
        </el-form-item>
        <el-form-item>
          <div style="text-align: center">
            <el-button
              :class="$style['verification-code__resend']"
              type="text"
              :disabled="duration > 0"
              @click="resendVerifyCode"
            >
              Resend Code
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            :class="$style['verification-code__submit']"
            :disabled="disabledButton || duration <= 0"
            type="warning"
            @click.prevent="submitForm"
          >
            Continue
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, ref, onMounted, watch } from 'vue'
import { useFormat } from '@/utils/useFormat'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'VerificationCode',
  components: {},
  setup() {
    // data
    const { formatTime } = useFormat()
    const duration = ref(3 * 60)
    const timeDown = ref('3:00')
    const router = useRouter()
    const formData = reactive({
      verifyCode: ''
    })
    const store = useStore()
    // computed
    const email = computed(() => store.getters['forgotPassword/email'])
    if (!email.value) {
      router.push({ name: 'Login' })
    }
    const disabledButton = computed(() => {
      return !formData.verifyCode
    })
    const countdown = () => {
      if (duration.value <= 0) {
       return false
      }
      setTimeout(() => {
        duration.value -= 1
        countdown()
      }, 1000)
    }
    watch(
      duration, val => {
        timeDown.value = formatTime(String(val))
      }
    )
    // life-cycle
    onMounted(() =>  {
        countdown()
      }
    )
    // methods
    const resetCountDown = () => {
      duration.value = 3 * 60
      countdown()
    }
    const resendVerifyCode = async () => {
      resetCountDown()
    }
    const submitForm = async () => {
      const params = {
        email: email.value,
        verifyCode: formData.verifyCode
      }
      try {
        const { data } = await store.dispatch('forgotPassword/verifyCodeEmail', params)
        if (data.data) {
          router.push({ name: 'ChangePassword' })
        }
      } catch (error) {
        return false
      }
    }
    return {
      // data
      formatTime,
      formData,
      timeDown,
      duration,
      // computed
      disabledButton,
      // methods
      submitForm,
      resendVerifyCode
    }
  }
})
</script>
<style lang="stylus" module>
.verification-code
  display flex
  align-items center
  justify-content center
  background-color $background
  min-height 100vh
  &__img
    text-align center
    margin-bottom $space * 4
    img
      height 95px
      width 95px
  &__title
    text-align center
    color $primary
    font-size 1.5rem
    margin-bottom $space * 5.5
    font-weight 600
  &__desc
    color $secondary
    margin-bottom $space * 3
  &__container
    padding $space * 6
    width 525px
    border-radius $space * 2
    background-color $white
  &__submit
    background-color $primary
    height 48px
    width 100%
    border none
    border-radius 4px
    display flex
    align-items center
    justify-content center
    color $white
    cursor pointer
    transition all .2s
    &:hover
      opacity 0.8
  &__submit.is-disabled
    color $white
    background-color $primary-disabled
    border-color $primary-disabled
  &__countdown
    text-align right
    color $secondary
  &__resend
    cursor pointer
    transition all .2s
    color $grey-light
    font-size 14px
    &:hover
      color $primary
  &__resend.is-disabled
    color $grey-light
</style>