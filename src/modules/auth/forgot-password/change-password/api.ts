import apiClient from '@/api'
import { UpdatePasswordForm } from './types'

export async function updatePasswordByEmail (params: UpdatePasswordForm) {
  return await apiClient.post('/partner/updatePasswordByEmail', params)
}
