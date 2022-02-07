export interface MyBookingFilter {
  keyword: string
  startDate: string
  endDate: string,
  type?: number,
  bookingStatus?:number,
  limit: number
}
export interface CancelBookingParams {
  sn: number,
  reason_cancel_sn: number
  reason_cancel: string
}