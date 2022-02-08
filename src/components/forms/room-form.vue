<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z, ZodNumber, ZodObject, ZodString } from 'zod';
import { useCreateRoomMutation } from '~/api/rooms/useCreateRoomMutation';
import { useFloorsQuery } from '~/api/rooms/useFloorsQuery';
import { useRoomQuery } from '~/api/rooms/useRoomQuery';
import { useRoomsQuery } from '~/api/rooms/useRoomsQuery';
import { useRoomTypesQuery } from '~/api/rooms/useRoomTypesQuery';
import { useUpdateRoomMutation } from '~/api/rooms/useUpdateRoomMutation';
import { useI18n } from '~/composables/useI18n';
import { useNotify } from '~/composables/useNotify';

type TSchema = {
  room_floor_id: ZodNumber;
  room_type_id: ZodNumber;
  name: ZodString;
};

type TRoomFormValues = z.infer<ZodObject<TSchema>>;

const props = defineProps<{ roomId: 'new' | number }>();

const { notifySaveSuccess, notifySaveFailed } = useNotify();
const router = useRouter();
const route = useRoute();

const {
  data: roomTypesData,
  isLoading: isRoomTypesLoading,
  findRoomTypeIdByCode,
} = useRoomTypesQuery();
const { data: floorsData, isLoading: isFloorsLoading } = useFloorsQuery();
const { findRoomByRoomId, isLoading: isRoomsLoading } = useRoomsQuery();
const { data: roomData, isLoading: isRoomLoading } = useRoomQuery(
  props.roomId === 'new' ? 0 : props.roomId,
);
const createMutation = useCreateRoomMutation();
const updateMutation = useUpdateRoomMutation();

const isLoading = computed(
  () =>
    isRoomTypesLoading.value ||
    isFloorsLoading.value ||
    isRoomsLoading.value ||
    isRoomLoading.value,
);

const roomTypeCodeUrlQuery = !Array.isArray(route.query.sortby)
  ? route.query.sortby?.replaceAll('_', ' ')
  : undefined;
const roomTypeIdFromUrl = findRoomTypeIdByCode(roomTypeCodeUrlQuery);

const validationSchema = toFormValidator(
  z.object<TSchema>({
    room_floor_id: z.number().int().positive(),
    room_type_id: z.number().int().positive(),
    name: z.string().max(50).nonempty(),
  }),
);

const { t } = useI18n();

const initialValues = computed<TRoomFormValues>(() => {
  return {
    room_floor_id: roomData.value?.room_floor ?? (router.options.history.state.floorId as number),
    room_type_id:
      roomData.value?.room_type ?? roomTypeIdFromUrl ?? roomTypesData.value?.[0].id ?? 0,
    name: props.roomId === 'new' ? '' : findRoomByRoomId(props.roomId)?.name ?? '',
  };
});

const { handleSubmit } = useForm<TRoomFormValues>({ validationSchema, initialValues });
const { value: roomFloorValue, errorMessage: roomFloorErrMsg } = useField<number>('room_floor_id');
const { value: roomTypeValue, errorMessage: roomTypeErrMsg } = useField<number>('room_type_id');
const { value: nameValue, errorMessage: nameErrMsg } = useField<string>('name');

const onSubmit = handleSubmit((values) => {
  if (props.roomId === 'new') {
    createMutation.mutate(values, {
      onSuccess: () => {
        notifySaveSuccess();
      },
      onError: () => {
        notifySaveFailed();
      },
    });
    return;
  }
  updateMutation.mutate(
    { ...values, room_id: props.roomId },
    {
      onSuccess: () => {
        notifySaveSuccess();
      },
      onError: () => {
        notifySaveFailed();
      },
    },
  );
});
</script>

<template>
  <q-form @submit="onSubmit">
    <div v-if="isLoading" class="wrapper">
      <q-skeleton v-for="num in 3" :key="num" type="QInput" />
    </div>
    <div v-else class="wrapper">
      <q-input
        v-model="nameValue"
        :label="t('room_name')"
        :error-message="nameErrMsg"
        :error="!!nameErrMsg"
      />
      <q-select
        v-model="roomTypeValue"
        :label="t('room_type')"
        :error-message="roomTypeErrMsg"
        :error="!!roomTypeErrMsg"
        :options="roomTypesData"
        map-options
        option-label="code"
        option-value="id"
        emit-value
      />
      <q-select
        v-model="roomFloorValue"
        :label="t('floor')"
        :error-message="roomFloorErrMsg"
        :error="!!roomFloorErrMsg"
        :options="floorsData"
        map-options
        option-label="name"
        option-value="id"
        emit-value
      />
    </div>
    <div class="q-mt-md row justify-end q-gutter-md">
      <q-btn v-close-popup :label="t('cancel')" flat type="button" />
      <q-btn :label="t('save')" color="orange-9" type="submit" :disable="isLoading" />
    </div>
  </q-form>
</template>

<style scoped lang="scss">
.wrapper {
  display: grid;
  gap: 1rem;
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
}
</style>
