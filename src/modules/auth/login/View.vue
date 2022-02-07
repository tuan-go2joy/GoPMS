<template>
  <div class="login">
    <div class="login__container">
      <div class="login__img">
        <img
          src="@/assets/images/logo-small.png"
          alt="logo-go2joy.png"
        >
      </div>
      <el-form
        @submit.prevent="submitForm"
      >
        <el-form-item>
          <el-input 
            v-model="formData.userID"
            placeholder="User ID"
          />
        </el-form-item>
        <el-form-item>
          <el-input 
            v-model="formData.password"
            placeholder="Password"
            :type="typePasswordInput"
            @keyup.enter="submitForm"
          >
            <template #suffix>
              <i
                :class="iconPasswordInput"
                style="cursor: pointer;"
                @click="showPwd"
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="login__remember">
            <el-checkbox 
              v-model="formData.remember"
            />
            <span>Remember this account</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login__submit"
            :loading="loading"
            @click.prevent="submitForm"
          >
            Sign In
          </el-button>
        </el-form-item>
        <el-form-item>
          <div
            class="login__forgot-password"
            @click="toForgotPassword"
          >
            Forgot Password?
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, inject } from 'vue';
import { ElForm, ElFormItem, ElCheckbox, ElButton, ElInput } from 'element-plus'
import { login } from './api'
import { useRouter } from 'vue-router'
import { Md5 } from "md5-typescript"
import { Emitter } from 'mitt'
export default defineComponent({
  name: 'SignInPage',
  components: {
    ElForm,
    ElFormItem,
    ElCheckbox,
    ElButton,
    ElInput
  },
  setup() {
    const router = useRouter();
    // data
    const loading = ref(false)
    const typePasswordInput = ref('password')
    const iconPasswordInput = ref('el-icon-view el-icon-not-view')
    const formData = reactive({
      userID: '',
      password: '',
      remember: false
    })
    // inject
    const emitter = inject('emitter') as Emitter<any>
    // methods
    const showPwd = () => {
      typePasswordInput.value = typePasswordInput.value === 'password' ? '' : 'password'
      iconPasswordInput.value = typePasswordInput.value === 'password' ? 'el-icon-view el-icon-not-view' : 'el-icon-view'
    }
    const toForgotPassword = () => {
      router.push({ name: 'ForgotPassword' })
    }
    const setLocalStorageWithExpiry = (key: string, value: any, ttl: number): void => {
      const now = new Date()
      const item = {
        value: value,
        expiry: now.getTime() + ttl
      }
      localStorage.setItem(key, JSON.stringify(item))
    }
    const submitForm = async () => {
      loading.value = true
      const params = {
        userId: formData.userID,
        password: Md5.init(formData.password),
        remember: Number(formData.remember)
      }
      try {
        const { data } : any = await login(params)
        const ttl = formData.remember ? 60 * 60 * 24 * 90 * 1000 : 60 * 60 * 24 * 1000
        setLocalStorageWithExpiry('access_token', data.data.accessToken, ttl)
        setLocalStorageWithExpiry('profile', data.data.profile, ttl)
        await router.push({ name: 'MyBooking' })
        emitter.emit('login')
      } catch (error) {
        return false
      } finally {
        loading.value = false
      }
    }
    return {
      // data
      typePasswordInput,
      iconPasswordInput,
      loading,
      formData,
      // methods
      toForgotPassword,
      submitForm,
      showPwd
    }
  }
})
</script>
<style lang="stylus" scoped>
.el-icon-not-view
  position relative
  &:after
    content ''
    height 14px
    width 1px
    background-color #c0c4cc
    position absolute
    top 0
    right 0
    transform rotate(-30deg)
    margin-left auto
    margin-right auto
    left 0
    right 0
.login
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
  &__remember
    display flex
    align-items center
    span
      margin-left $space * 1.5
      color $grey-dark
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
  &__forgot-password
    text-align center
    cursor pointer
    transition all .2s
    &:hover
      color $primary
</style>