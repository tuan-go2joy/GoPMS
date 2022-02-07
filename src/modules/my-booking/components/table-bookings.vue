<template>
  <el-table
    :data="data"
    :class="$style['table-booking']"
  >
    <el-table-column
      type="index"
      label="#"
      min-width="2"
    />
    <el-table-column
      :label="t('page.myBooking.hotelName')"
      min-width="10"
    >
      <template #default="scope">
        <router-link :to="{ name: 'HotelDetails', params: { sn: scope.row.hotelSn } }">
          {{ scope.row.hotelName }}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column
      :label="t('page.myBooking.bookingNo')"
      min-width="8"
    >
      <template #default="scope">
        <el-tooltip
          :content="`Partner ID: ${scope.row.partnerUserBookingId}`"
          placement="right"
          effect="light"
        >
          <router-link
            :to="{ name: 'BookingDetails', params: { sn: scope.row.sn } }"
          >
            {{ scope.row.bookingNo }}
          </router-link>
        </el-tooltip>
        <p>{{ formatDate(scope.row.createTime) }}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="mobile"
      :label="t('page.myBooking.userInfo')"
      :class-name="'break-all'"
      min-width="6"
    />
    <el-table-column
      prop="roomTypeName"
      :label="t('page.myBooking.roomType')"
      min-width="8"
    />
    <el-table-column
      prop="bookingType"
      :label="t('page.myBooking.bookingType')"
      min-width="6"
    >
      <template #default="scope">
        <p>{{ setBookingType(scope.row.type) }}</p>
      </template>
    </el-table-column>
    <el-table-column
      :label="t('page.myBooking.stayAtHotelTime')"
      min-width="6"
    >
      <template #default="scope">
        <p>{{ scope.row.checkInDatePlan }}</p>
        <p v-if="scope.row.type === 1">
          {{ formatTime(scope.row.startTime) }} <span v-if="scope.row.endTime">~ {{ formatTime(scope.row.endTime) }} </span>
        </p>
        <p v-else-if="scope.row.type === 3">
          {{ scope.row.endDate }}
        </p>
      </template>
    </el-table-column>
    <el-table-column
      :label="t('page.myBooking.bookingStatus')"
      min-width="6"
    >
      <template #default="scope">
        <div v-if="scope.row.bookingStatus === 1 || scope.row.bookingStatus === 2">
          {{ t('page.myBooking.confirmed') }}
        </div>
        <div v-else-if="scope.row.bookingStatus === 3">
          {{ t("page.myBooking.cancel") }}:
          <p>
            {{ formatDate(scope.row.checkInTime) }}
          </p>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      :label="t('page.myBooking.roomAmount')"
      :class-name="'break-all'"
      min-width="6"
    >
      <template #default="scope">
        {{ formatMoney(scope.row.roomTypeAmount) }}
      </template>
    </el-table-column>
    <el-table-column
      :label="t('page.myBooking.totalAmount')"
      :class-name="'break-all'"
      min-width="6"
    >
      <template #default="scope">
        {{ formatMoney(scope.row.totalAmount) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="discount"
      :label="t('page.myBooking.discount')"
      :class-name="'break-all'"
      min-width="6"
    >
      <template #default="scope">
        {{ formatMoney(scope.row.totalHotelDiscount) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="userPay"
      :label="t('page.myBooking.userPay')"
      :class-name="'break-all'"
      min-width="6"
    >
      <template #default="scope">
        {{ formatMoney(scope.row.amountFromUser) }}
      </template>
    </el-table-column>
    <el-table-column
      :label="t('page.myBooking.paidInAdvance')"
      :class-name="'break-all'"
      min-width="6"
    >
      <template #default="scope">
        <p class="text-danger">
          {{ formatMoney(scope.row.prepayAmount) }}
        </p>
        <!-- <div v-if="scope.row.refunded > 0">
          
        </div>
        <div v-else-if="scope.row.refunded === 0">
          <p v-if="scope.row.prepayAmount > 0">
            {{ formatMoney(scope.row.prepayAmount) }}
          </p>
        </div> -->
      </template>
    </el-table-column>
    <el-table-column
      :label="t('page.myBooking.operations')"
      :class-name="'operations'"
      align="center"
      min-width="12"
    >
      <template #default="scope">
        <el-button
          v-if="(scope.row.bookingStatus === 1 || scope.row.bookingStatus === 2) && scope.row.portalReasonCancellationSn"
          type="warning"
          plain
          size="small"
          @click="showSuccessfullyDialog"
        >
          {{ t('button.waitingResponse') }}
        </el-button>
        <el-button
          v-if="(scope.row.bookingStatus === 1 || scope.row.bookingStatus === 2) && !scope.row.portalReasonCancellationSn"
          type="danger"
          plain
          size="small"
          @click="showCancelDialog(scope.row.sn)"
        >
          {{ t('button.cancel') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormat } from '@/utils/useFormat'
import { getTypePopupCancel } from '../list/api'
export default {
  name: 'TableBookings',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  setup (porps, { emit }) {
    // data
    const ui = reactive({
      loadingTypePopup: false
    })
    const { t, locale } = useI18n()
    const { formatDate, formatMoney, formatTime } = useFormat()
    const setBookingType = (type) => {
      switch (type) {
        case 1:
          return t('page.myBooking.hourly')
        case 2:
          return t('page.myBooking.overnight')
        case 3:
          return t('page.myBooking.daily')
        default:
          return ''
      }
    }
    const setBookingStatus = (status) => {
      switch (status) {
        case 0:
          return t('page.myBooking.all')
        case 1:
          return t('page.myBooking.confirmed')
        case 2:
          return t('page.myBooking.checkIn')
        case 3:
          return t('page.myBooking.cancel')
        case 4:
          return t('page.myBooking.noShow')
        case 5:
          return t('page.myBooking.paymentFail')
        default:
          return ''
      }
    }
    const showSuccessfullyDialog = () => {
      emit('showSuccessfullyDialog')
    }
    const showCancelDialog = async (sn) => {
      try {
        ui.loadingTypePopup = true
        const { data } = await getTypePopupCancel({ sn: sn })
        emit('showCancelDialog', { sn: sn, typePopup: data.data.typePopupCancel })
      } catch (error) {
        return false
      } finally {
        ui.loadingTypePopup = false
      }
    }
    return {
      // data
      ui,
      t,
      locale,
      // methods
      formatDate,
      formatMoney,
      formatTime,
      setBookingStatus,
      setBookingType,
      showCancelDialog,
      showSuccessfullyDialog
    }
  }
}
</script>
<style lang="stylus" module>
.table-booking
  :global
    .cell
      word-break normal
  :global
    .el-table__body
      .break-all
        .cell
          word-break break-all
      .operations
        .cell
          word-break break-all
          text-overflow clip
</style>