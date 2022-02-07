import './send-code'
import './verification-code'
import './change-password'
import store from '@/store'
import forgotPassword from './store'
store.registerModule('forgotPassword', forgotPassword)