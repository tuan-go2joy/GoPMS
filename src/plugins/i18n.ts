import { createI18n } from 'vue-i18n';
import enUSMessages from '../../locales/en-US.json';
import viVNMessages from '../../locales/vi-VN.json';

export type TMessageSchema = typeof enUSMessages;

export type TLocale = 'en-US' | 'vi-VN';

export const i18n = createI18n<[TMessageSchema], TLocale>({
  legacy: false,
  locale: localStorage.getItem('locale') ?? 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUSMessages,
    'vi-VN': viVNMessages,
  },
});
