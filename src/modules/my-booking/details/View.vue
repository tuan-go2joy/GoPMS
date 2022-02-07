<template>
  <portal-section
    v-loading="ui.loading"
    :class="$style['booking']"
  >
    <template #header-right>
      <div class="text-align: right; width: 100%;">
        <el-button
          type="info"
          icon="el-icon-refresh-left"
          size="large"
          @click="$router.go(-1)"
        >
          {{ t('button.back') }}
        </el-button>
      </div>
    </template>
    <div
      v-for="(label, index) in ui.displayBookingDetails"
      :key="index"
      :class="$style['booking__item']"
    >
      <span :class="$style['booking__item--left']">
        {{ t(`page.myBooking.${label}`) }}
      </span>
      <div :class="$style['booking__item--right']">
        <div
          v-if="label === 'bookingNo'"
        >
          {{ myBookingDetails[label] }}
        </div>
        <div v-else-if="label==='partnerUserBookingId'">
          {{ myBookingDetails.partnerUserBookingId }}
        </div>
        <div v-else-if="label==='userInfo'">
          {{ myBookingDetails.mobile }}
        </div>
        <div v-else-if="label==='hotelName'">
          <router-link
            v-if="myBookingDetails.hotelSn"
            :to="{ name: 'HotelDetails', params: { sn: myBookingDetails.hotelSn } }"
          >
            {{ myBookingDetails.hotelName }}
          </router-link>
        </div>
        <div v-else-if="label==='roomType'">
          {{ myBookingDetails.roomTypeName }}
        </div>
        <div
          v-else-if="label==='stayAtHotelTime'"
          style="display: flex; align-item: center;"
        >
          <p style="margin-right: 6px;">
            {{ myBookingDetails.checkInDatePlan }}
          </p>
          <p v-if="myBookingDetails.type === 1">
            {{ formatTime(myBookingDetails.startTime) }} <span v-if="myBookingDetails.endTime">~ {{ formatTime(myBookingDetails.endTime) }} </span>
          </p>
          <p v-else-if="myBookingDetails.type === 3">
            {{ myBookingDetails.endDate }}
          </p>
        </div>
        <div v-else-if="label==='bookingStatus'">
          <div v-if="myBookingDetails.bookingStatus === 1 || myBookingDetails.bookingStatus === 2">
            {{ t('page.myBooking.confirmed') }}
          </div>
          <div
            v-else-if="myBookingDetails.bookingStatus === 3"
            style="display: flex; align-item: center;"
          >
            {{ t("page.myBooking.cancel") }}:
            <p style="margin-left: 4px;">
              {{ formatDate(myBookingDetails.checkInTime) }}
            </p>
          </div>
        </div>
        <div
          v-else-if="label==='roomAmount'"
          :class="$style['flex']"
        >
          <span>
            {{ t('page.myBooking.extraFee') }}: {{ formatMoney(myBookingDetails.extraFee) }}
          </span>
          <span :class="$style['text-blue']">
            {{ formatMoney(myBookingDetails.roomAmount) }}
          </span>
        </div>
        <div
          v-else-if="label==='totalAmount'"
          :class="$style['align-right']"
        >
          <span :class="$style['text-blue']">
            {{ formatMoney(myBookingDetails.totalAmount) }}
          </span>
        </div>
        <div
          v-else-if="label==='discount'"
          :class="$style['align-right']"
        >
          <div :class="$style['text-blue']">
            {{ formatMoney(myBookingDetails.totalHotelDiscount) }}
          </div>
        </div>
        <div
          v-else-if="label==='userPay'"
          :class="$style['align-right']"
        >
          <div :class="$style['text-danger']">
            {{ formatMoney(myBookingDetails.amountFromUser) }}
          </div>
        </div>
        <div
          v-else-if="label==='paidInAdvance'"
          :class="$style['align-right']"
        >
          {{ formatMoney(myBookingDetails.prepayAmount) }}
        </div>
      </div>
    </div>
  </portal-section>
</template>
<script>
import { onMounted, reactive, ref } from 'vue'
import { getMyBookingDetails } from './api'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFormat } from '@/utils/useFormat'
export default {
  name: 'BookingDetails',
  setup() {
    // data
    const route = useRoute()
    const { t, locale } = useI18n()
    const ui = reactive({
      loading: false,
      displayBookingDetails: [
        'bookingNo',
        'partnerUserBookingId',
        'hotelName',
        'roomType',
        'stayAtHotelTime',
        'bookingStatus',
        'roomAmount',
        'totalAmount',
        'discount',
        'userPay',
        'paidInAdvance'
      ]
    })
    const myBookingDetails = ref({
      hotelSn: ''
    })
    onMounted(
      () => {
        onGetMyBookingDetails(route.params.sn)
      }
    )
    // methods
    const { formatDate, formatMoney, formatTime } = useFormat()
    const onGetMyBookingDetails = async (sn) => {
      try {
        ui.loading = true
        const { data } = await getMyBookingDetails({ sn: sn })
        myBookingDetails.value = data.data
      } catch (error) {
        return false
      } finally {
        ui.loading = false
      }
    }
    return {
      // data
      t,
      locale,
      ui,
      myBookingDetails,
      // methods
      onGetMyBookingDetails,
      formatDate,
      formatMoney,
      formatTime
    }
  }
}
</script>
<style lang="stylus" module>
.booking
  color $text-table
  &__item
    display flex
    align-items center
    border-bottom 1px solid #ebeef5
    padding $space * 4 0
    &--left
      width 25%
    &--right
      width 75%
      .text-blue
        color $blue
      .text-danger
        color $primary
      .align-right
        display flex
        justify-content end
      .flex
        display flex
        align-items center
        justify-content space-between
</style>