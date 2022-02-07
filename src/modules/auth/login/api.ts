import apiClient from '@/api'
import { UserLogin } from './login'

export async function login (userLogin: UserLogin) {
  return await apiClient.post('/partner/signIn', userLogin)
}