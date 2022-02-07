import apiClient from '@/api'
import { VerificationCodeForm } from './types'

export async function verifyCodeEmail (params: VerificationCodeForm) {
  return await apiClient.post('/partner/verifyCodeEmail', params)
}