import apiClient from '@/api'

export async function getHotelDetails (param: any) {
  return await apiClient.get('/hotelDetail/getHotelDetail', { params : param })
}