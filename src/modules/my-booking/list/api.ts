import apiClient from '@/api'
import { MyBookingFilter } from './types'

export async function fetchMyBookings (filter: MyBookingFilter) {
  return await apiClient.get(`/myBooking/getMyBookingList`, { params : filter })
}

export async function cancelMyBooking (params: any) {
  return await apiClient.post(`/myBooking/cancelBooking`, params)
}

export async function fetchReasonCancels (lan: string) {
  apiClient.defaults.headers.common['Localization'] = lan
  return await apiClient.get(`/myBooking/getReasonCancelList`)
}


export async function fetchSuggestionsHotels (filter: any) {
  return await apiClient.get(`/myBooking/getHotelSearchList`, { params : filter })
}

export async function getTypePopupCancel (params: any) {
  return await apiClient.get(`/myBooking/getTypePopupCancel`, { params : params })
}
