import apiClient from '@/api'
export async function getRevenue (filter: any) {
  return await apiClient.get('/revenue/getRevenueDetail', { params : filter })
}
export async function fetchSuggestionsHotels (filter: any) {
  return await apiClient.get(`/myBooking/getHotelSearchList`, { params : filter })
}
