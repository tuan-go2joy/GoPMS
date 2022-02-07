import apiClient from '@/api'

export async function forgotPassword (email: string) {
  return await apiClient.post('/partner/forgotPasswordByEmail', { email: email })
}