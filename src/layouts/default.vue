<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToken } from '~/api/authentication/useToken';
import Logo3d from '~/components/gopms/logo-3d.vue';
import LogoLetter from '~/components/gopms/logo-letter.vue';
import { useI18n } from '~/composables/useI18n';
import FlagUK from '~/components/icons/flag-UK.vue';
import FlagVN from '~/components/icons/flag-VN.vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const { toggleLocale, locale, t } = useI18n();
const { data: userData } = useToken();
const router = useRouter();
const auth = useAuth();

const miniState = ref(true);
const drawer = ref(false);

const links = computed(() => [
  { to: '/', iconName: 'space_dashboard', text: t('home') },
  { to: '/room-view', iconName: 'calendar_view_month', text: t('room_view') },
  { to: '/bookings', iconName: 'auto_stories', text: t('booking', 99) },
  { to: '/guests', iconName: 'contacts', text: t('guest', 99) },
  { to: '/services', iconName: 'room_service', text: t('service', 99) },
]);

const reportLinks = computed(() => [
  { to: '/reports/bookings', iconName: 'auto_stories', text: t('booking') },
  { to: '/reports/transactions', iconName: 'paid', text: t('transaction') },
]);

const settingLinks = computed(() => [
  { to: '/settings/information', iconName: 'business', text: t('information') },
  { to: '/settings/policies', iconName: 'menu_book', text: t('policy') },
  { to: '/settings/room-settings', iconName: 'bed', text: t('room_setting') },
  { to: '/settings/booking-sources', iconName: 'source', text: t('booking_source') },
  { to: '/settings/staff', iconName: 'people', text: t('staff') },
  { to: '/settings/rate-structures', iconName: 'price_change', text: t('rate_structure') },
]);
</script>

<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-grey-3">
      <q-toolbar>
        <q-btn flat round dense icon="menu" color="black" @click="drawer = !drawer" />
        <q-toolbar-title>
          <q-btn flat dense to="/">
            <Logo3d class="logo-3d" />
            <LogoLetter class="text-orange-9 logo-letter" />
          </q-btn>
        </q-toolbar-title>
        <q-space />
        <q-btn :label="t('create_new_booking')" icon="add" color="orange-9" stretch flat />
        <q-separator vertical />
        <q-btn-dropdown label="Menu" stretch flat color="orange-9">
          <q-list>
            <q-item-label header>{{ userData?.extra.name }}</q-item-label>
            <q-item v-close-popup clickable to="/profile/my-account">
              <q-item-section>{{ t('my_account') }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item v-close-popup clickable @click="auth.signout(router)">
              <q-item-section>{{ t('sign_out') }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-separator vertical />
        <q-btn stretch flat @click="toggleLocale">
          <FlagUK v-if="locale === 'en-US'" class="flag" />
          <FlagVN v-if="locale === 'vi-VN'" class="flag" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      mini-to-overlay
      :width="240"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item v-for="{ iconName, text, to } in links" :key="to" v-ripple :to="to" clickable>
            <q-item-section avatar>
              <q-icon :name="iconName" />
            </q-item-section>
            <q-item-section>{{ text }}</q-item-section>
          </q-item>

          <q-separator />

          <q-expansion-item :label="t('report', 99)" icon="analytics" :content-inset-level="0.5">
            <q-item
              v-for="{ iconName, text, to } in reportLinks"
              :key="to"
              v-ripple
              to="to"
              clickable
            >
              <q-item-section avatar>
                <q-icon :name="iconName" />
              </q-item-section>
              <q-item-section>{{ text }}</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item :label="t('setting', 99)" icon="settings" :content-inset-level="0.5">
            <q-item
              v-for="{ iconName, text, to } in settingLinks"
              :key="to"
              v-ripple
              :to="to"
              clickable
            >
              <q-item-section avatar>
                <q-icon :name="iconName" />
              </q-item-section>
              <q-item-section>{{ text }}</q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.flag {
  width: 1.5rem;
}
.logo-3d {
  height: 2rem;
}
.logo-letter {
  height: 1rem;
  margin-left: 0.5rem;
}
</style>
