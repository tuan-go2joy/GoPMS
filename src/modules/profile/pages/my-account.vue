<script setup lang="ts">
import MeForm from '../components/me-form.vue';
import ChangePasswordForm from '../components/change-password-form.vue';
import { useI18n } from '~/composables/useI18n';

const { t } = useI18n();
</script>

<template>
  <div class="wrapper">
    <h4>{{ t('my_account') }}</h4>
    <h6>{{ t('basic_info') }}</h6>
    <MeForm />
    <h6>{{ t('change_password') }}</h6>
    <ChangePasswordForm />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  max-width: 1080px;
  margin: 0px auto 8rem auto;
}
</style>
