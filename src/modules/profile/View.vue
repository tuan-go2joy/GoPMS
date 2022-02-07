<template>
  <div class="profile-segment">
    <portal-section>
      <div class="profile-segment__content">
        <el-form
          ref="formRef"
          v-loading="ui.isLoading"
          :model="formData"
          :rules="rules"
          label-position="left"
          label-width="15%"
          hide-required-asterisk
        >
          <el-form-item
            :label="t('page.profile.userID')"
          >
            <el-input
              v-model="formData.userId"
              disabled
            >
              {{ formData.userId }}
            </el-input>
          </el-form-item> <!-- user ID -->
          <el-form-item
            :label="t('page.profile.full_name')"
            prop="name"
          >
            <el-input
              v-model="formData.name"
              :placeholder="t('page.profile.full_name')"
              type="text" 
            />
          </el-form-item> <!-- full name -->
          <el-form-item
            :label="t('page.profile.mobile')"
            prop="mobile"
          >
            <el-input
              v-model="formData.mobile"
              :placeholder="t('page.profile.mobile')"
              type="text"
            />
          </el-form-item> <!-- mobile -->
          <el-form-item
            :label="t('page.profile.email')"
            prop="email"
          >
            <el-input
              v-model="formData.email"
              :placeholder="t('page.profile.email')"
              type="text"
            />
          </el-form-item> <!-- email -->
          <el-form-item
            :label="t('page.profile.current_password')"
            prop="curPassword"
          >
            <el-input 
              v-model="formData.curPassword" 
              autocomplete="new-password"
              :placeholder="t('page.profile.current_password')"
              t 
              :type="ui.curPassType"
            >
              <template #suffix>
                <i
                  :class="ui.curPassIcon"
                  style="cursor: pointer;"
                  @click="showPwd(0)"
                />
              </template>
            </el-input>
          </el-form-item> <!-- password -->
          <el-form-item
            :label="t('page.profile.new_password')"
            prop="newPassword"
          >
            <el-input
              v-model="formData.newPassword"
              autocomplete="new-password" 
              :placeholder="t('page.profile.new_password')" 
              name="Confirm Password" 
              :type="ui.newPassType"
            >
              <template #suffix>
                <i
                  :class="ui.newPassIcon"
                  style="cursor: pointer;"
                  @click="showPwd(1)"
                />
              </template>
            </el-input>
          </el-form-item> <!-- new password -->
          <el-form-item
            :label="t('page.profile.confirm_new_password')"
            prop="confirmPassword"
          >
            <el-input
              v-model="formData.confirmPassword" 
              autocomplete="new-password" 
              :placeholder="t('page.profile.confirm_new_password')" 
              name="Confirm Password" 
              :type="ui.conPassType"
            >
              <template #suffix>
                <i
                  :class="ui.conPassIcon"
                  style="cursor: pointer;"
                  @click="showPwd(2)"
                />
              </template>
            </el-input>
          </el-form-item> <!-- confirm password -->
        </el-form>
      </div>
      <div class="profile-segment__button">
        <div class="profile-segment__button--content">
          <el-button
            type="info"
            icon="el-icon-refresh-left"
            size="large"
            @click="$router.go(-1)"
          >
            {{ t('button.back') }}
          </el-button>
          <el-button
            type="success"
            icon="el-icon-edit"
            size="large"
            :loading="isCallAPI"
            @click="onUpdateProfile()"
          >
            {{ t('button.edit') }}
          </el-button>
        </div>
      </div>
    </portal-section>
  </div>
</template>
<script lang="ts">
import { defineComponent, Ref, ref, onMounted, reactive, computed, inject } from 'vue';
import { ElButton, ElInput, ElMessage, ElForm, ElFormItem } from 'element-plus'
import { getProfile,updateProfile } from './api'
import { useI18n } from 'vue-i18n'
import { UserProfile } from './profile'
import { Nullable } from '@/utils/types'
import { Md5 } from "md5-typescript"
import { Emitter } from 'mitt'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },
  setup() {
    // ref dom
    const formRef: Ref<Nullable<any>> = ref(null)
     // inject
    const emitter = inject('emitter') as Emitter<any>
    // data
    const isCallAPI = ref(false)
    const { t, locale } = useI18n()
    const ui = reactive({
      isLoading: false,
      curPassIcon: 'el-icon-view el-icon-not-view',
      curPassType: 'password',
      newPassIcon: 'el-icon-view el-icon-not-view',
      newPassType: 'password',
      conPassIcon: 'el-icon-view el-icon-not-view',
      conPassType: 'password'
    })
    const formData = ref<UserProfile>({
      email: null,
      mobile: '',
      name: '',
      userId: '',
      curPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const rules =  computed(() => {
      return {
          'curPassword': [
            {
              trigger: 'blur',
              validator: (rule: any,  value: any, callback: (error?: string | Error) => void) => {
                if (formData.value.newPassword ) {
                  if (!value) {
                    callback(new Error(t('page.profileValidation.enterPass')))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              }
            }
          ],
          'newPassword': [
            {
              trigger: 'blur',
              validator: (rule: any,  value: any, callback: (error?: string | Error) => void) => {
                if (formData.value.curPassword ) {
                    const regex = /^([a-zA-Z0-9]+){6,7}$/
                    if (!value) {
                      callback(new Error(t('page.profileValidation.enterNewPass')))
                    } else if (value.length < 6 || value.length > 16 ) {
                      callback(new Error(t('page.profileValidation.formatPass')))
                    }
                    setTimeout(() => {
                      if (regex.test(value) === false) {
                        callback(new Error(t('page.profileValidation.formatPass')))
                      } else {
                        callback()
                      }
                    }, 1000)
                  } else {
                    callback()
                  }
              },
            },
          ],
          'confirmPassword': {
            trigger: 'blur',
            validator: (rule: any,  value: any, callback: (error?: string | Error) => void) => {
              if (formData.value.newPassword ) {
                if (!value) {
                    callback(new Error(t('page.profileValidation.enterConPass')))
                } else if (value && value !== formData.value.newPassword) {
                    callback(new Error(t('page.profileValidation.confirmMatch')))
              }  else {
                  callback()
                }
              } else {
                callback()
              }
            }
          },
          'name':  {
            required: true,
            message: 'Name required',
            trigger: 'blur'
          },
          'mobile':  {
            required: true,
            message: 'Mobile required',
            trigger: 'blur'
          },
          'email':  {
            required: true,
            message: 'Email required',
            trigger: 'blur'
          }
      }
    })
    //
    onMounted(
      async () => {
        ui.isLoading = true
        try {
          const { data } : any = await getProfile()
          formData.value = data.data as UserProfile
        } catch (error) {
          return false
        } finally {
          ui.isLoading = false
        }
      }
    )
    //method
    const onUpdateProfile = async () => {
      isCallAPI.value = true
      await formRef.value.validate( async (valid: boolean) => {
        if (!valid) {
          return false
        }
        try {
          const params = {
            email: formData.value.email,
            mobile: formData.value.mobile,
            name: formData.value.name,
            userId: formData.value.userId,
            curPassword: formData.value.curPassword ? Md5.init(formData.value.curPassword) : '',
            newPassword: formData.value.newPassword ? Md5.init(formData.value.newPassword) : '',
            confirmPassword: formData.value.confirmPassword ? Md5.init(formData.value.confirmPassword) : ''
          }
          const ttl = 60 * 60 * 24 * 1000;
          let profileData = {}
          const { data } : any = await updateProfile(params as UserProfile)
          if (data.code === 1) {
            profileData = {
              email: data.data.email,
              fullName: data.data.name,
              userId: data.userId
            }
            setLocalStorageWithExpiry('profile', profileData, ttl)
            formData.value.curPassword = formData.value.newPassword = formData.value.confirmPassword = ''
            emitter.emit('setFrofile')
            ElMessage({
              type: 'success',
              message: t('message.updateSuccess')
            })
          }
        } catch (error) {
          return false
        } 
      })
      isCallAPI.value = false
    }
    const setLocalStorageWithExpiry = (key: string, value: any, ttl: number): void => {
      const now = new Date()
      const item = {
        value: value,
        expiry: now.getTime() + ttl
      }
      localStorage.setItem(key, JSON.stringify(item))
    }
    const showPwd = (type: any) => {
      switch (type) {
        case 0:
          ui.curPassType = ui.curPassType === 'password' ? '' : 'password'
          ui.curPassIcon = ui.curPassType === 'password' ? 'el-icon-view el-icon-not-view' : 'el-icon-view'
          break;
        case 1:
          ui.newPassType = ui.newPassType === 'password' ? '' : 'password'
          ui.newPassIcon = ui.newPassType === 'password' ? 'el-icon-view el-icon-not-view' : 'el-icon-view'
          break;
        case 2:
          ui.conPassType = ui.conPassType === 'password' ? '' : 'password'
          ui.conPassIcon = ui.conPassType === 'password' ? 'el-icon-view el-icon-not-view' : 'el-icon-view'
          break;
        default:
          break;
      }
      
    }
    return {
      t,
      ui,
      locale,
      isCallAPI,
      formData,
      rules,
      formRef,
      onUpdateProfile,
      showPwd
    }
  }
})
</script>
<style lang="stylus" scoped>
.profile-segment
  background-color: #ffffff;
  &__content 
    border: none;
    border-radius: 3px;
  &__button
    padding: 15px;
    &--content
      display: flex;
      justify-content: flex-end;
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
</style>