<script setup lang="ts">
import { toFieldValidator } from '@vee-validate/zod';
import { useField } from 'vee-validate';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { z } from 'zod';
import { useCreateFloorMutation } from '../apis/useCreateFloorMutation';
import { useFloorsQuery } from '../apis/useFloorsQuery';
import { useRoomsQuery } from '../apis/useRoomsQuery';
import { useRoomTypesQuery } from '../apis/useRoomTypesQuery';
import Floor from '../components/floor.vue';
import { useEditable } from '~/composables/useEditable';
import { useI18n } from '~/composables/useI18n';
import { useNotify } from '~/composables/useNotify';
import { router } from '~/plugins/router';

const { data: roomTypesData } = useRoomTypesQuery();
const { data: floorsData } = useFloorsQuery();
const { data: roomsData } = useRoomsQuery();
const createFloorMutation = useCreateFloorMutation();

const route = useRoute();
const { t } = useI18n();

const { notifySaveSuccess, notifySaveFailed } = useNotify();

const {
  value: newFloorNameValue,
  errorMessage: newFloorNameErrMsg,
  validate: validateNewFloorName,
  resetField,
} = useField<string>(
  'name',
  toFieldValidator(
    z
      .string()
      .nonempty()
      .max(10)
      .refine((value) => {
        if (!floorsData.value) return false;
        return !floorsData.value.some(({ name }) => name === value);
      }),
  ),
  {
    validateOnValueUpdate: false,
    initialValue: '',
  },
);

const { inputElementRef, isEditMode, finishEdit, startEdit } = useEditable({
  onFinishEdit: () => resetField({ value: '' }),
});

const totalRoomsCount = computed(() => {
  let count = 0;
  roomTypesData.value?.forEach(({ num_of_room }) => (count += num_of_room));
  return count;
});

const onSubmitNewFloor = async () => {
  if (!(await validateNewFloorName()).valid) return;
  createFloorMutation.mutate(
    { name: newFloorNameValue.value },
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

const onClickNewRoomType = () => {
  console.log('Create new room type');
  router.replace({
    path: `/settings/room-settings/room-types/new`,
    query: route.query,
    state: { code: null },
  });
};

const onClickEditRoomType = (roomTypeId: number, code: string) => {
  console.log('Edit room type', roomTypeId);
  router.replace({
    path: `/settings/room-settings/room-types/${roomTypeId}`,
    query: route.query,
    state: { code },
  });
};
</script>

<template>
  <div>
    <q-splitter
      :model-value="15"
      before-class="q-px-sm"
      separator-style="background-color: transparent;"
    >
      <template #before>
        <q-list separator bordered>
          <q-item v-ripple to="/settings/room-settings" replace>
            <q-item-section :class="[route.query.code ? 'text-black' : 'text-primary']">
              {{ t('all') }}
            </q-item-section>
            <q-item-section side>
              <q-badge :label="totalRoomsCount" rounded />
            </q-item-section>
          </q-item>
          <q-item
            v-for="{ num_of_room, code, name, id } in roomTypesData"
            :key="id"
            v-ripple
            :to="`/settings/room-settings?code=${code.replaceAll(' ', '_')}`"
            replace
          >
            <q-item-section>
              <q-item-label
                :class="[
                  route.query.code === code.replaceAll(' ', '_') ? 'text-primary' : 'text-black',
                ]"
              >
                {{ code }}
                <q-badge :label="num_of_room" rounded />
              </q-item-label>
              <q-item-label caption>{{ name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn icon="edit" flat round @click.prevent="onClickEditRoomType(id, code)" />
            </q-item-section>
          </q-item>
        </q-list>
        <div class="row">
          <q-btn
            :label="t('new_room_type')"
            class="col q-my-md"
            icon="add_circle"
            stretch
            @click="onClickNewRoomType"
          />
        </div>
      </template>
      <template #after>
        <Floor
          v-for="{ room_floor_name, room_floor_id, list_rooms } in roomsData"
          :key="room_floor_id"
          :floor-name="room_floor_name"
          :floor-id="room_floor_id"
          :rooms="list_rooms"
        />
        <div class="q-my-xl row justify-center">
          <q-input
            v-if="isEditMode"
            ref="inputElementRef"
            v-model="newFloorNameValue"
            :error-message="newFloorNameErrMsg"
            :error="!!newFloorNameErrMsg"
            class="h-sm"
            :placeholder="t('input_floor_name')"
            filled
            @keydown.enter.prevent="onSubmitNewFloor"
            @keydown.esc.prevent="finishEdit"
            @keydown.tab.prevent="finishEdit"
          />
          <q-btn v-else :label="t('new_floor')" icon="add_circle" @click="startEdit" />
        </div>
      </template>
    </q-splitter>
    <router-view />
  </div>
</template>
