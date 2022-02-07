import apiClient from '@/api'

export async function getMyBookingDetails (params: any) {
  return await apiClient.get('myBooking/getMyBookingDetail', { params: params })
}
