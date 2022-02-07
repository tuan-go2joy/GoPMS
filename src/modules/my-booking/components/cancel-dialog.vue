<template>
  <el-dialog
    v-model="dialogVisible"
    width="600px"
    @close="closeDialog"
  >
    <div :class="$style['dialog-header']">
      {{ t('page.myBooking.cancelRequest') }}
    </div>
    <el-form
      ref="formRef"
      :model="paramsCancel"
      label-position="top"
      :rules="rules"
      :class="$style['form']"
      hide-required-asterisk
    >
      <el-form-item
        :label="t('page.myBooking.reasonForCancel')"
        prop="reason_cancel_sn"
      >
        <el-select
          v-model="paramsCancel.reason_cancel_sn"
          :placeholder="t('page.myBooking.reasonForCancel')"
          :loading="ui.loading"
          style="width: 100%;"
          @change="changeReason"
        >
          <ElOption
            v-for="(reason, index) in reasons"
            :key="index"
            :value="reason.sn"
            :label="reason.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="ui.showReasonMessage"
        :prop="ui.showReasonMessage ? 'reason_cancel' : ''"
      >
        <el-input
          v-model="paramsCancel.reason_cancel"
          :placeholder="t('page.myBooking.enterYourReason')"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="warning"
          :class="$style['form__button']"
          :loading="ui.loadingCancelBooking"
          @click="onSendRequest"
        >
          {{ t('button.sendRequest') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { computed, defineComponent, onMounted, reactive, ref, inject } from 'vue'
import { fetchReasonCancels, cancelMyBooking } from '../list/api'
import { useI18n } from 'vue-i18n'
const REASON_ORTHER = 6
export default defineComponent({
  name: 'CancelDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'close', 'cancelSuccess'],
  setup(props, { emit }) {
    // ref DOM
    const formRef = ref(null)
    // data
    const emitter = inject('emitter')
    const { t, locale } = useI18n()
    const rules = {
      reason_cancel_sn: [
        {
          required: true,
          message: t('page.myBooking.requireReasonSelect'),
          trigger: 'change'
        }
      ],
      reason_cancel: [
        {
          required: true,
          message: t('page.myBooking.requireReasonInput'),
          trigger: 'change'
        }
      ]
    }
    const ui = reactive({
      loading: false,
      loadingCancelBooking: false,
      showReasonMessage: false
    })
    const paramsCancel = reactive({
      sn: '',
      reason_cancel_sn: null,
      reason_cancel: ''
    })
    const reasons = ref([])
    // computed
    const dialogVisible = computed({
      get () {
        return props.visible
      },
      set (newValue) {
        emit('update:modelValue', newValue)
      }
    })
    // lifecycle
    onMounted(
      () => {
        onFetchReasonCancels()
        emitter.on('changeLang', async () => {
          onFetchReasonCancels()
        })
      }
    ) 
    // methods
    const setupDialog = async (data) => {
      await onFetchReasonCancels()
      paramsCancel.sn = data.sn
    }
    const changeReason = () => {
       ui.showReasonMessage = paramsCancel.reason_cancel_sn === REASON_ORTHER
    }
    const onFetchReasonCancels = async () => {
      ui.loading = true
      try {
        const lang = localStorage.getItem('lang') || 'en'
        const { data } = await fetchReasonCancels(lang)
        reasons.value = data.data
      } catch (error) {
        return false
      } finally {
        ui.loading = false
      }
    }
    const closeDialog = (e) => {
      formRef.value.resetFields()
      emit('close', e)
    }
    const onSendRequest = () => {
      formRef.value.validate(async (valid) => {
        if (!valid) {
          return false
        }
      try {
        ui.loadingCancelBooking = true
        const { data } = await cancelMyBooking(paramsCancel)
        if (data.data) {
          emit('cancelSuccess')
          closeDialog()
        }
      } catch (error) {
        return false
      } finally {
        ui.loadingCancelBooking = false
      }
      })
    }
    return {
      formRef,
      // data
      t,
      locale,
      ui,
      rules,
      reasons,
      paramsCancel,
      // computed
      dialogVisible,
      // methods
      setupDialog,
      closeDialog,
      onSendRequest,
      changeReason
    }
  }
})
</script>
<style lang="stylus" module>
.dialog-header
  text-align center
  color $primary
  font-size 24px
  font-weight bold
  margin-bottom $space * 6
.form
  &__button
    width 100%
    background-color $primary
</style>