import apiClient from '@/api'
import { UserProfile } from './profile'

export async function getProfile () {
  return await apiClient.get('/partner/getProfileInfo')
}

export async function updateProfile (params: UserProfile) {
  return await apiClient.post('/partner/updateProfile', params)
}