import apiClient from '@/api'
import { MyBookingSearch } from './type'

export async function searchMyBookings (filter: MyBookingSearch) {
  return await apiClient.get('/myBooking/searchMyBooking', { params : filter })
}