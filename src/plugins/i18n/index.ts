import { createI18n } from 'vue-i18n'
import vnMessage from './vn-file'
import enMessage from './en-file'
type MessageSchema = typeof enMessage
const messages = {
  vi: vnMessage,
  en: enMessage
}

const i18n = createI18n<[MessageSchema], 'vi' | 'en'>({
  legacy: false,
  locale: localStorage.getItem('lang') ? localStorage.getItem('lang') as string : 'vi',
  fallbackLocale: 'vi',
  messages: messages
});

export default i18n
