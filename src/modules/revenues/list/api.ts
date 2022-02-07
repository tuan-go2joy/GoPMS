import apiClient from '@/api'
export async function listRevenue (filter: any) {
  return await apiClient.get('/revenue/getRevenueList', { params : filter })
}
export async function fetchSuggestionsHotels (filter: any) {
  return await apiClient.get(`/myBooking/getHotelSearchList`, { params : filter })
}
