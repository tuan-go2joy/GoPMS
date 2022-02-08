import { useQuasar } from 'quasar';
import { useI18n } from './useI18n';

export const useNotify = () => {
  const { t } = useI18n();
  const $q = useQuasar();

  const notifySaveSuccess = () =>
    $q.notify({
      message: t('saved'),
      position: 'bottom-right',
      type: 'positive',
      actions: [{ label: 'Dismiss', color: 'white' }],
    });

  const notifySaveFailed = () =>
    $q.notify({
      message: t('failed_to_save'),
      position: 'bottom-right',
      type: 'negative',
      actions: [{ label: 'Dismiss', color: 'white' }],
    });

  const notifyWarning = (message: string) =>
    $q.notify({
      message,
      position: 'bottom-right',
      type: 'warning',
      actions: [{ label: 'Dismiss', color: 'white' }],
    });

  return { notifySaveSuccess, notifySaveFailed, notifyWarning };
};
