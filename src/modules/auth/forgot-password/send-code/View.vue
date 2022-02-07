<template>
  <div class="send-code">
    <div class="send-code__container">
      <div class="send-code__img">
        <img
          src="@/assets/images/logo-small.png"
          alt="logo-go2joy.png"
        >
      </div>
      <div class="send-code__title">
        Forgot Password
      </div>
      <el-form
        ref="sendCodeRef"
        :model="formData"
        :rules="rules"
        @submit.prevent="submitForm"
      >
        <el-form-item
          prop="email"
        >
          <el-input 
            v-model="formData.email"
            placeholder="Email"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="send-code__submit"
            :disabled="disabledButton"
            type="warning"
            @click.prevent="submitForm"
          >
            Send verification code
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, Ref } from "@vue/runtime-core"
import { Nullable, RuleType } from '@/utils/types'
import { useRouter } from 'vue-router'
import { useStore } from "vuex"
export default defineComponent({
  name: 'SendCode',
  components: {},
  setup() {
    // ref DOM
    const sendCodeRef: Ref<Nullable<any>> = ref(null)
    // data
    const store = useStore()
    const router = useRouter()
    const formData = reactive({
      email: ''
    })
    const rules = {
      'email': {
        type: 'email' as RuleType,
        message: 'Please input correct email address',
        trigger: 'blur'
      }
    }
    // computed
    const disabledButton = computed(() => {
      return !formData.email
    })
    // methods
    const submitForm = async () => {
      sendCodeRef.value!.validate(async (valid: boolean) => {
        if (!valid) {
          return false
        }
        try {
          const { data } = await store.dispatch('forgotPassword/forgotPassword', formData.email)
          if (data.data) {
            router.push({ name: 'VerificationCode' })
          }
        } catch (error) {
          return false
        }
        // todo
      })
    }
    return {
      // ref
      sendCodeRef,
      // data
      formData,
      rules,
      // computed
      disabledButton,
      // methods
      submitForm
    }
  }
})
</script>
<style lang="stylus" scoped>
.send-code
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