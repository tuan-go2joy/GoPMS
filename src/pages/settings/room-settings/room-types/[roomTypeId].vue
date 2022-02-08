<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '~/composables/useI18n';
import RoomTypeForm from '~/components/forms/room-type-form.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const isOpen = ref(false);

const roomTypeId = computed<'new' | number | null>(() => {
  const { roomTypeId } = route.params;
  if (Array.isArray(roomTypeId)) return null;
  if (roomTypeId === 'new') return 'new';
  if (typeof +roomTypeId === 'number') return +roomTypeId;
  return null;
});

onMounted(() => (isOpen.value = true));

const onHide = () => {
  router.replace({ path: '/settings/room-settings', query: route.query });
};
</script>

<template>
  <q-dialog v-if="roomTypeId" v-model="isOpen" @hide="onHide">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">
          {{ roomTypeId === 'new' ? t('new_room_type') : t('edit_room_type') }}
          {{ router.options.history.state.code }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <RoomTypeForm :room-type-id="roomTypeId" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
