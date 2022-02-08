<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import { z, ZodObject, ZodString } from 'zod';
import { useUpdatePasswordMutation } from '../apis/useUpdatePasswordMutation';
import { useI18n } from '~/composables/useI18n';

type TSchema = {
  new_password: ZodString;
  current_password: ZodString;
  re_enter_password: ZodString;
};

type TMyAccountPasswordFormValues = z.infer<ZodObject<TSchema>>;

const { t } = useI18n();
const $q = useQuasar();

const mutation = useUpdatePasswordMutation();

const validationSchema = toFormValidator(
  z
    .object<TSchema>({
      current_password: z.string().nonempty(),
      new_password: z.string().min(6).nonempty(),
      re_enter_password: z.string().min(6).nonempty(),
    })
    .refine((data) => data.new_password === data.re_enter_password, {
      path: ['re_enter_password'],
    }),
);

const initialValues: TMyAccountPasswordFormValues = {
  current_password: '',
  new_password: '',
  re_enter_password: '',
};

const { handleSubmit } = useForm({ validationSchema, initialValues });

const { value: currentPasswordValue, errorMessage: currentPasswordErrMsg } =
  useField<string>('current_password');
const { value: newPasswordValue, errorMessage: newPasswordErrMsg } =
  useField<string>('new_password');
const { value: reEnterPasswordValue, errorMessage: reEnterPasswordErrMsg } =
  useField<string>('re_enter_password');

const revealCurrentPassword = ref(false);
const revealReEnterPassword = ref(false);
const revealNewPassword = ref(false);

const onSubmit = handleSubmit(({ current_password, new_password }) => {
  mutation.mutate(
    { current_password, new_password },
    {
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
    },
  );
});
</script>

<template>
  <q-form @submit="onSubmit">
    <div class="container">
      <q-input
        v-model="currentPasswordValue"
        :label="t('current_password')"
        :error-message="currentPasswordErrMsg"
        :error="!!currentPasswordErrMsg"
        :type="revealCurrentPassword ? 'text' : 'password'"
      >
        <template #append>
          <q-icon
            :name="revealCurrentPassword ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="revealCurrentPassword = !revealCurrentPassword"
          />
        </template>
      </q-input>
      <q-input
        v-model="newPasswordValue"
        :label="t('new_password')"
        :error-message="newPasswordErrMsg"
        :error="!!newPasswordErrMsg"
        :type="revealNewPassword ? 'text' : 'password'"
      >
        <template #append>
          <q-icon
            :name="revealNewPassword ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="revealNewPassword = !revealNewPassword"
          />
        </template>
      </q-input>
      <q-input
        v-model="reEnterPasswordValue"
        :label="t('re-enter_password')"
        :error-message="reEnterPasswordErrMsg"
        :error="!!reEnterPasswordErrMsg"
        :type="revealReEnterPassword ? 'text' : 'password'"
      >
        <template #append>
          <q-icon
            :name="revealReEnterPassword ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="revealReEnterPassword = !revealReEnterPassword"
          />
        </template>
      </q-input>
    </div>
    <div class="row q-mt-xl">
      <q-btn
        :label="t('save')"
        color="orange-9"
        type="submit"
        class="q-ml-auto"
        :loading="mutation.isLoading.value"
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
