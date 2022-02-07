<template>
  <el-dialog
    v-model="dialogVisible"
    width="600px"
    @close="closeDialog"
  >
    <div :class="$style['dialog']">
      <div :class="$style['dialog__header']">
        {{ t('page.myBooking.successSubmit') }}
      </div>
      <p>{{ t('page.myBooking.cancellationHasBeenSent') }}</p>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'SuccessfullyDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    const { t, locale } = useI18n()
    // computed
    const dialogVisible = computed({
      get () {
        return props.visible
      },
      set (newValue) {
        emit('update:modelValue', newValue)
      }
    })
    // methods
    const closeDialog = (e) => {
      emit('close', e)
    }
    return {
      t,
      locale,
      dialogVisible,
      closeDialog
    }
  }
})
</script>
<style lang="stylus" module>
.dialog
  text-align center
  &__header
    text-align center
    color $primary
    font-size 24px
    font-weight bold
    margin-bottom $space * 6
  p
    font-size 20px
    margin-bottom $space * 6
</style>