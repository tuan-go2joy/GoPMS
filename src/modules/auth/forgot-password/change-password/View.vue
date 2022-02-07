<template>
  <div :class="$style['change-password']">
    <div :class="$style['change-password__container']">
      <div :class="$style['change-password__img']">
        <img
          src="@/assets/images/logo-small.png"
          alt="logo-go2joy.png"
        >
      </div>
      <div :class="$style['change-password__title']">
        Forgot Password
      </div>
      <div :class="$style['change-password__desc']">
        Set up your new password
      </div>
      <el-form
        ref="sendCodeRef"
        :model="formData"
        :rules="rules"
        @submit.prevent="submitForm"
      >
        <el-form-item
          prop="password"
        >
          <el-input 
            v-model="formData.password"
            placeholder="Password"
            type="password"
          />
        </el-form-item>
        <el-form-item
          prop="confirmPassword"
        >
          <el-input 
            v-model="formData.confirmPassword"
            placeholder="Confirm password"
            type="password"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :class="$style['change-password__submit']"
            type="warning"
            :loading="ui.loading"
            @click="submitForm"
          >
            Confirm
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed, Ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { updatePasswordByEmail } from './api'
import { Md5 } from "md5-typescript"
import { Nullable } from '@/utils/types'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'SendCode',
  components: {},
  setup() {
    // ref DOM
    const sendCodeRef: Ref<Nullable<any>> = ref(null)
    // data
    const router = useRouter()
    const store = useStore()
    const ui = reactive({
      loading: false
    })
    const email = computed(() => store.getters['forgotPassword/email'])
    const verifyCode = computed(() => store.getters['forgotPassword/verifyCode'])
    if (!email.value || !verifyCode.value) {
      router.push({ name: 'Login' })
    }
    const formData = reactive({
      password: '',
      confirmPassword: ''
    })
    const rules = {
      'password': [
        {
        required: true,
        message: 'Password must be 6~16 characters of English, numbers.',
        trigger: 'blur'
        },
        {
          min: 6,
          max: 16,
          message: 'Password must be 6~16 characters of English, numbers.',
          trigger: 'blur'
        },
        {
          trigger: 'blur',
          validator: (rule: any,  value: any, callback: (error?: string | Error) => void) => {
            const regex = /^([a-zA-Z0-9]+){6,7}$/
            setTimeout(() => {
              if (regex.test(value)) {
                callback()
              } else {
                callback(new  Error('Password must be 6~16 characters of English, numbers.'))
              }
            }, 100)
          }
        },
      ],
      'confirmPassword': {
        trigger: 'blur',
        validator: (rule: any,  value: any, callback: (error?: string | Error) => void) => {
          if (value === '') {
            callback(new Error('The password confirmation does not match'))
          } else if (value !== formData.password) {
            callback(new Error('The password confirmation does not match'))
          } else if (!value && formData.password) {
            callback(new Error('The password confirmation does not match'))
          } else {
            callback()
          }
        }
      }
    }
    // methods
    const submitForm = () => {
      sendCodeRef.value.validate(async (valid: boolean) => {
        if (!valid) {
          return false
        }
        ui.loading = true
        try {
          const params = {
            newPassword: Md5.init(formData.password),
            email: email.value,
            verifyCode: verifyCode.value
          }
          const { data }: any = await updatePasswordByEmail(params)
          if (data.data) {
            ElMessage({
              type: 'success',
              message: `You've changed your password successfully`
            })
            router.push({ name: 'Login' })
          }
        } catch (error) {
          return false
        } finally {
          ui.loading = false
        }
      })
    }
    return {
      // ref
      sendCodeRef,
      // data
      ui,
      formData,
      rules,
      // methods
      submitForm
    }
  }
})
</script>
<style lang="stylus" module>
.change-password
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
  &__desc
    color $secondary
    margin-bottom $space * 3
  &__title
    text-align center
    color $primary
    font-size 1.5rem
    margin-bottom $space * 5.5
    font-weight 600
  &__container
    padding $space * 6
    width 525px
    border-radius $space * 2
    background-color $white
  &__submit
    margin-top $space * 3.5
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
</style>