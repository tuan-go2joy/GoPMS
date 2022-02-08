<script setup lang="ts">
import SignInForm from '../components/sign-in-form.vue';
import FlagUK from '~/components/icons/flag-UK.vue';
import FlagVN from '~/components/icons/flag-VN.vue';
import { useI18n } from '~/composables/useI18n';

const { toggleLocale, locale, t } = useI18n();
</script>

<template>
  <div class="wrapper">
    <q-btn class="i18n-btn" flat round>
      <FlagUK v-if="locale === 'en-US'" class="flag" @click="toggleLocale" />
      <FlagVN v-else class="flag" @click="toggleLocale" />
    </q-btn>
    <div class="container">
      <div class="text-white q-px-xl">
        <h1 class="text-h2">{{ t('welcome_to_gopms') }}</h1>
        <p class="text-h6">
          {{ t('you_can_manage_all_properties_easily with_the_most_convenient_system') }}
        </p>
        <p class="text-h6">
          {{ t('if_you_want_to_register_gopms_please_fill_out_the_registration_form_on_here') }}
        </p>
        <p class="text-h6">
          {{ t('support') }} :
          <a href="https://zalo.me/280180579574148514" target="_blank" rel="noopener">
            Contact via Zalo
          </a>
        </p>
        <p class="text-h6">
          {{ t('email') }} :
          <a href="mailto:info@gopms.io" target="_blank" rel="noopener">info@gopms.io</a>
        </p>
      </div>
      <q-separator color="white" vertical />
      <div class="q-px-xl">
        <SignInForm />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: center url(~/assets/images/login-background.png);
  background-size: cover;
  .i18n-btn {
    position: fixed;
    top: 6rem;
    right: 8rem;
    .flag {
      width: 2rem;
    }
  }
  .container {
    display: grid;
    @media screen and (min-width: $breakpoint-md-min) {
      grid-template-columns: 1.3fr auto 1fr;
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: plain
</route>
