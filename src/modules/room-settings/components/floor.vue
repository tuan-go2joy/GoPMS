<script setup lang="ts">
import { toFieldValidator } from '@vee-validate/zod';
import { useField } from 'vee-validate';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { z } from 'zod';
import { useDeleteFloorMutation } from '../apis/useDeleteFloorMutation';
import { useFloorsQuery } from '../apis/useFloorsQuery';
import { useUpdateFloorMutation } from '../apis/useUpdateFloorMutation';
import { useEditable } from '~/composables/useEditable';
import { useI18n } from '~/composables/useI18n';
import { useNotify } from '~/composables/useNotify';
import { router } from '~/plugins/router';

interface IFloorProps__room {
  id: number;
  room_type_code: string;
  name: string;
}

interface IFloorProps {
  floorName: string;
  floorId: number;
  rooms: IFloorProps__room[];
}

const props = defineProps<IFloorProps>();

const { data: floorsData } = useFloorsQuery();
const { notifySaveSuccess, notifySaveFailed, notifyWarning } = useNotify();
const route = useRoute();
const { t } = useI18n();

const sortedRooms = computed(() => {
  const { code } = route.query;
  if (!code || Array.isArray(code)) return props.rooms;
  return props.rooms.filter(({ room_type_code }) => room_type_code === code.replaceAll('_', ' '));
});

const { inputElementRef, isEditMode, startEdit, finishEdit } = useEditable({
  onFinishEdit: () => resetField({ value: props.floorName }),
});

const updateFloorMutation = useUpdateFloorMutation();
const deleteFloorMutation = useDeleteFloorMutation();

const { value, errorMessage, resetField, validate } = useField<string>(
  'name',
  toFieldValidator(
    z
      .string()
      .nonempty()
      .max(10)
      .refine((value) => {
        if (!floorsData.value) return false;
        return !floorsData.value.some(({ id, name }) => id !== props.floorId && name === value);
      }),
  ),
  { initialValue: props.floorName, validateOnValueUpdate: false },
);

const onSubmitFloorName = async (event: KeyboardEvent) => {
  const { valid } = await validate();
  if (!valid) return;
  const { value: name } = event.currentTarget as HTMLInputElement;
  updateFloorMutation.mutate(
    { floor_id: props.floorId, name },
    {
      onSuccess: () => {
        notifySaveSuccess();
        finishEdit();
      },
      onError: () => {
        notifySaveFailed();
      },
    },
  );
};

const onClickDeleteFloor = () => {
  if (props.rooms.length !== 0) {
    notifyWarning(t('please_remove_all_rooms_of_this_floor'));
    return;
  }
  deleteFloorMutation.mutate(
    { floor_id: props.floorId },
    {
      onSuccess: () => {
        notifySaveSuccess();
      },
      onError: () => {
        notifySaveFailed();
      },
    },
  );
};

const onClickRoom = (_: PointerEvent, room: IFloorProps__room) => {
  router.replace({
    path: `/settings/room-settings/rooms/${room.id}`,
    state: { roomName: room.name, floorId: props.floorId },
    query: route.query,
  });
};

const onClickAddRoom = () => {
  router.replace({
    path: `/settings/room-settings/rooms/new`,
    state: { roomName: null, floorId: props.floorId },
    query: route.query,
  });
};
</script>

<template>
  <q-table
    grid
    :title="props.floorName"
    :rows="sortedRooms"
    :columns="[
      { name: 'room_type_code', label: 'Room Type Code', field: (row) => row.room_type_code },
      { name: 'name', label: 'Room Name', field: (row) => row.name },
    ]"
    hide-pagination
    @row-click="onClickRoom"
  >
    <template #top-left>
      <q-input
        v-if="isEditMode"
        ref="inputElementRef"
        v-model="value"
        class="text-h5"
        :error-message="errorMessage"
        :error="!!errorMessage"
        :placeholder="t('input_floor_name')"
        filled
        dense
        @keydown.enter.prevent="onSubmitFloorName"
        @keydown.esc.prevent="finishEdit"
        @keydown.tab.prevent="finishEdit"
      />
      <q-btn
        v-else
        :label="props.floorName"
        class="text-h5"
        padding="xs 12px"
        no-caps
        dense
        flat
        @click="startEdit"
      />
    </template>
    <template #top-right>
      <q-btn flat round icon="more_vert">
        <q-menu anchor="bottom right" self="top right">
          <q-item v-close-popup clickable @click="onClickAddRoom">
            <q-item-section side><q-icon name="add" /></q-item-section>
            <q-item-section>{{ t('add_new_room') }}</q-item-section>
          </q-item>
          <q-separator />
          <q-item v-close-popup clickable @click="onClickDeleteFloor">
            <q-item-section side><q-icon name="delete" /></q-item-section>
            <q-item-section>{{ t('delete_floor') }}</q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
    </template>
  </q-table>
</template>
