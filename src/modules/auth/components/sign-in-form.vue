<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { z, ZodObject, ZodString } from 'zod';
import { useSigninMutation } from '../apis/useSigninMutation';
import { useAuth } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';

type TSchema = {
  email: ZodString;
  password: ZodString;
};

type TLoginFormValues = z.infer<ZodObject<TSchema>>;

const { t } = useI18n();
const router = useRouter();
const auth = useAuth();
const $q = useQuasar();

const validationSchema = toFormValidator(
  z.object<TSchema>({
    email: z.string().nonempty().max(64).email(),
    password: z.string().nonempty().min(6),
  }),
);

const { handleSubmit } = useForm<TLoginFormValues>({ validationSchema });
const { errorMessage: emailErrMsg, value: emailValue } = useField<string>('email');
const { errorMessage: passwordErrMsg, value: passwordValue } = useField<string>('password');
const mutation = useSigninMutation();
const onSubmit = handleSubmit((values) => {
  mutation.mutate(values, {
    onSuccess: ({ refresh, access, extra }) => {
      if (extra.is_admin) return; // This should be handled properly in near future.
      // Also, extra.is_verified, extra.is_active should be handled. This is undecided yet.
      auth.signin({ refresh, access, userId: extra.id, accommodationId: extra.accomm_id });
      router.go(0);
    },
    onError: ({ response }) => {
      let message = '';
      if (response?.status === 401 || response?.status === 404) {
        message = t('wrong_credentials');
      } else {
        message = t('something_went_wrong');
      }
      $q.notify({
        message,
        position: 'bottom-right',
        type: 'negative',
        actions: [{ label: 'Dismiss', color: 'white' }],
      });
    },
  });
});
</script>

<template>
  <q-form class="form" @submit="onSubmit">
    <q-input
      v-model="emailValue"
      :label="t('email')"
      :error-message="emailErrMsg"
      :error="!!emailErrMsg"
    />
    <q-input
      v-model="passwordValue"
      :label="t('password')"
      :error-message="passwordErrMsg"
      :error="!!passwordErrMsg"
      type="password"
    />
    <q-btn
      class="q-mt-lg"
      type="submit"
      :loading="mutation.isLoading.value"
      data-testid="sign-in-btn"
      data-cy="sign-in-btn"
    >
      {{ t('sign_in') }}
    </q-btn>
  </q-form>
</template>

<style lang="scss" scoped>
.form {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
