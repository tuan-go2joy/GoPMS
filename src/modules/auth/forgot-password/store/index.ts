import { forgotPassword } from '../send-code/api'
import { verifyCodeEmail } from '../verification-code/api'
import { ForgotPasswordState } from './types'
import { VerificationCodeForm } from '../verification-code/types'
const state = {
  email: '',
  verifyCode: ''
} as ForgotPasswordState

const getters = {
  'email': (state: ForgotPasswordState) => state.email,
  'verifyCode': (state: ForgotPasswordState) => state.verifyCode
}

const mutations = {
  SET_EMAIL: (state: ForgotPasswordState, email: string) => (state.email = email),
  SET_VERIFY_CODE: (state: ForgotPasswordState, verifyCode: string) => (state.verifyCode = verifyCode)
}
const actions = {
  async forgotPassword({ commit } : any, params: string) {
    await commit("SET_EMAIL", params)
    try {
      return await forgotPassword(params)
    } catch (error) {
      return false
    }
  },
  async verifyCodeEmail({ commit } : any, params: VerificationCodeForm) {
    await commit("SET_VERIFY_CODE", params.verifyCode)
    return await verifyCodeEmail(params)
  }
}

export default {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
}