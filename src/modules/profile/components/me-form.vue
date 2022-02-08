<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { z, ZodNativeEnum, ZodObject, ZodString } from 'zod';
import { useMeQuery } from '../apis/useMeQuery';
import { useProfilesSelectionQuery } from '../apis/useProfilesSelectionQuery';
import { useUpdateMeMutation } from '../apis/useUpdateMeMutation';
import { GENDER, useConstantsQuery } from '~/api/common/useConstantsQuery';
import { useI18n } from '~/composables/useI18n';
import { VN_TEL_REGEX } from '~/constants';

type TSchema = {
  name: ZodString;
  mobile: ZodString;
  sex: ZodNativeEnum<typeof GENDER>;
};

type TMeFormValues = z.infer<ZodObject<TSchema>>;

const { data: profilesData, isLoading: isProfilesLoading } = useProfilesSelectionQuery();
const { data: optionsData, isLoading: isOptionsLoading } = useConstantsQuery();
const { data: meData, isLoading: isMeLoading } = useMeQuery();
const isLoading = computed(
  () => isProfilesLoading.value || isOptionsLoading.value || isMeLoading.value,
);
const mutation = useUpdateMeMutation();

const { t } = useI18n();
const $q = useQuasar();

const validationSchema = toFormValidator(
  z.object<TSchema>({
    name: z.string().nonempty().max(100),
    mobile: z.string().regex(VN_TEL_REGEX).nonempty(),
    sex: z.nativeEnum(GENDER),
  }),
);

const initialValues = computed(() => ({
  name: meData.value?.name ?? '',
  mobile: meData.value?.mobile ?? '',
  sex: meData.value?.sex ?? GENDER.Others,
}));

const { handleSubmit } = useForm<TMeFormValues>({ validationSchema, initialValues });

const { value: nameValue, errorMessage: nameErrMsg } = useField<string>('name');
const { value: mobileValue, errorMessage: mobileErrMsg } = useField<string>('mobile');
const { value: sexValue, errorMessage: sexErrMsg } = useField<GENDER>('sex');

const onSubmit = handleSubmit((values) => {
  mutation.mutate(values, {
    onSuccess: () => {
      $q.notify({
        message: t('saved'),
        position: 'bottom-right',
        type: 'positive',
        actions: [{ label: 'Dismiss', color: 'white' }],
      });
    },
    onError: () => {
      $q.notify({
        message: t('failed_to_save'),
        position: 'bottom-right',
        type: 'negative',
        actions: [{ label: 'Dismiss', color: 'white' }],
      });
    },
  });
});
</script>

<template>
  <q-form @submit="onSubmit">
    <div v-if="isLoading" class="container">
      <q-skeleton v-for="num in 5" :key="num" type="QInput" />
    </div>
    <div v-else class="container">
      <q-input
        v-model="nameValue"
        :label="t('name')"
        :error-message="nameErrMsg"
        :error="!!nameErrMsg"
      />
      <q-input :model-value="meData?.email" :label="t('email')" disable />
      <q-input
        v-model="mobileValue"
        :label="t('mobile')"
        :error-message="mobileErrMsg"
        :error="!!mobileErrMsg"
        mask="### - ### - ####"
        unmasked-value
      />
      <q-select
        v-model="sexValue"
        :label="t('gender')"
        :error-message="sexErrMsg"
        :error="!!sexErrMsg"
        :options="optionsData?.genderOptions"
        map-options
        option-label="name"
        emit-value
      />
      <q-select
        :model-value="meData?.profile.id"
        :label="t('role')"
        :options="profilesData"
        map-options
        option-label="name"
        option-value="id"
        emit-value
        disable
      />
    </div>
    <div class="row q-mt-xl">
      <q-btn
        :label="t('save')"
        color="orange-9"
        type="submit"
        class="q-ml-auto"
        :loading="mutation.isLoading.value"
        :disable="isLoading"
      />
    </div>
  </q-form>
</template>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
