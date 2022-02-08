<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { z, ZodEffects, ZodNumber, ZodObject, ZodString } from 'zod';
import { useCreateRoomTypeMutation } from '../apis/useCreateRoomTypeMutation';
import { useRoomTypeQuery } from '../apis/useRoomTypeQuery';
import { useRoomTypesQuery } from '../apis/useRoomTypesQuery';
import { useUpdateRoomTypeMutation } from '../apis/useUpdateRoomTypeMutation';
import { useI18n } from '~/composables/useI18n';
import { useNotify } from '~/composables/useNotify';

type TSchema = {
  capacity_adult: ZodNumber;
  capacity_child: ZodNumber;
  num_of_bed: ZodNumber;
  name: ZodEffects<ZodString>;
  code: ZodEffects<ZodString>;
};

type TRoomTypeFormValues = z.infer<ZodObject<TSchema>>;

const props = defineProps<{ roomTypeId: 'new' | number }>();

const { notifySaveSuccess, notifySaveFailed } = useNotify();

const { data: roomTypesData, isLoading: isRoomTypesLoading } = useRoomTypesQuery();
const { data: roomTypeData, isLoading: isRoomTypeLoading } = useRoomTypeQuery(
  props.roomTypeId === 'new' ? 0 : +props.roomTypeId,
);
const createMutation = useCreateRoomTypeMutation();
const updateMutation = useUpdateRoomTypeMutation();

const isLoading = computed(() => isRoomTypesLoading.value || isRoomTypeLoading.value);

const validationSchema = toFormValidator(
  z.object<TSchema>({
    capacity_adult: z.number().int().min(1).max(10),
    capacity_child: z.number().int().min(0).max(10),
    num_of_bed: z.number().int().min(1).max(10),
    name: z
      .string()
      .max(50)
      .nonempty()
      .refine(
        (val) =>
          !roomTypesData.value
            ?.filter((roomType) => roomType.id !== roomTypeData.value?.id)
            .some((roomType) => roomType.name === val),
      ),
    code: z
      .string()
      .max(10)
      .nonempty()
      .refine(
        (val) =>
          !roomTypesData.value
            ?.filter((roomType) => roomType.id !== roomTypeData.value?.id)
            .some((roomType) => roomType.code === val),
      ),
  }),
);

const { t } = useI18n();

const initialValues = computed<TRoomTypeFormValues>(() => {
  return {
    capacity_adult: roomTypeData.value?.capacity_adult ?? 2,
    capacity_child: roomTypeData.value?.capacity_child ?? 0,
    num_of_bed: roomTypeData.value?.num_of_bed ?? 1,
    name: roomTypeData.value?.name ?? '',
    code: roomTypeData.value?.code ?? '',
  };
});

const { handleSubmit } = useForm({ validationSchema, initialValues });
const { value: capacityAdultValue, errorMessage: capacityAdultErrMsg } =
  useField<number>('capacity_adult');
const { value: capacityChildValue, errorMessage: capacityChildErrMsg } =
  useField<number>('capacity_child');
const { value: numOfBedValue, errorMessage: numOfBedErrMsg } = useField<number>('num_of_bed');
const { value: nameValue, errorMessage: nameErrMsg } = useField<string>('name');
const { value: codeValue, errorMessage: codeErrMsg } = useField<string>('code');

const onSubmit = handleSubmit((values) => {
  if (props.roomTypeId === 'new') {
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
  if (!roomTypeData.value) return;
  updateMutation.mutate(
    {
      ...values,
      id: props.roomTypeId,
      is_active: roomTypeData.value.is_active,
    },
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
      <q-skeleton v-for="num in 2" :key="num" type="QInput" />
      <div class="container">
        <q-skeleton v-for="num in 3" :key="num" class="col" type="QInput" />
      </div>
    </div>
    <div v-else class="wrapper">
      <q-input
        v-model="codeValue"
        :label="t('room_type_code')"
        :error-message="codeErrMsg"
        :error="!!codeErrMsg"
      />
      <q-input
        v-model="nameValue"
        :label="t('room_type_name')"
        :error-message="nameErrMsg"
        :error="!!nameErrMsg"
      />
      <div class="container">
        <q-input
          v-model.number="numOfBedValue"
          :label="t('number_of_beds')"
          :error-message="numOfBedErrMsg"
          :error="!!numOfBedErrMsg"
          class="col"
          type="number"
        />
        <q-input
          v-model.number="capacityAdultValue"
          :label="t('number_of_adults')"
          :error-message="capacityAdultErrMsg"
          :error="!!capacityAdultErrMsg"
          class="col"
          type="number"
        />
        <q-input
          v-model.number="capacityChildValue"
          :label="t('number_of_children')"
          :error-message="capacityChildErrMsg"
          :error="!!capacityChildErrMsg"
          class="col"
          type="number"
        />
      </div>
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
