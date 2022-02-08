<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '~/composables/useI18n';
import RoomForm from '~/components/forms/room-form.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const isOpen = ref(false);

const roomId = computed<'new' | number | null>(() => {
  const { roomId } = route.params;
  if (Array.isArray(roomId)) return null;
  if (roomId === 'new') return 'new';
  if (typeof +roomId === 'number') return +roomId;
  return null;
});

onMounted(() => (isOpen.value = true));

const onHide = () => {
  router.replace({ path: '/settings/room-settings', query: route.query });
};
</script>

<template>
  <q-dialog v-if="roomId" v-model="isOpen" @hide="onHide">
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">
          {{ roomId === 'new' ? t('new_room') : t('edit_room') }}
          {{ router.options.history.state.roomName }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <RoomForm :room-id="roomId" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
