import { onClickOutside } from '@vueuse/core';
import { ref, nextTick } from 'vue';

export const useEditable = (args?: { onFinishEdit: () => void }) => {
  const isEditMode = ref(false);
  const inputElementRef = ref<HTMLInputElement | null>(null);

  const startEdit = async () => {
    isEditMode.value = true;
    await nextTick();
    inputElementRef.value?.focus();
  };

  const finishEdit = () => {
    isEditMode.value = false;
    args?.onFinishEdit();
  };

  onClickOutside(inputElementRef, () => finishEdit());

  return { inputElementRef, isEditMode, startEdit, finishEdit };
};
