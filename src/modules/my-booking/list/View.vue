<template>
  <portal-section
    v-loading="ui.loading"
    :class="$style['booking']"
  >
    <template #header>
      <div :class="$style['booking__header']">
        <el-select
          v-model="filter.hotelSn"
          :loading="ui.loadingHotels"
          :placeholder="t('page.myBooking.hotelName')"
          remote
          filterable
          :remote-method="searchSuggestionsHotels"
          prefix-icon="el-icon-search"
          clearable
          :class="$style['booking__header--item']"
          @change="onFetchMyBookings"
        >
          <el-option
            v-for="(item, index) in listSuggestionsHotels"
            :key="index"
            :label="item.name"
            :value="item.sn"
            style="font-size: 13px; color: #4a5d6e;"
            :class="$style['booking__option']"
          >
            {{ item.name }} <br> {{ item.address }}
          </el-option>
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          :start-placeholder="t('page.myBooking.startDate')"
          :end-placeholder="t('page.myBooking.endDate')"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
          :class="$style['booking__header--item']"
        />
        <el-select
          v-model="filter.type"
          :class="$style['booking__header--item']"
          @change="changeFilter"
        >
          <ElOption
            v-for="(item, index) in ui.types"
            :key="index"
            :value="item.value"
            :label="t(`page.myBooking.${item.label}`)"
          />
        </el-select>
        <el-select
          v-model="filter.bookingStatus"
          :class="$style['booking__header--item']"
          @change="changeFilter"
        >
          <ElOption
            v-for="(item, index) in ui.bookingStatus"
            :key="index"
            :value="item.value"
            :label="t(`page.myBooking.${item.label}`)"
          />
        </el-select>
        <el-button
          plain
          icon="el-icon-search"
          :class="$style['booking__header--item']"
          @click="$router.push({ name: 'SearchBooking' })"
        >
          {{ t('page.myBooking.searchByID') }}
        </el-button>
      </div>
    </template>
    <template #footer>
      <el-pagination
        v-model:currentPage="currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pagination.perPage ? pagination.perPage : 10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total ? pagination.total : 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <TableBookings
      :data="myBookings"
      @show-cancel-dialog="showCancelDialog"
      @show-successfully-dialog="showSuccessfullyDialog"
    />
    <CancelDialog
      ref="cancelDialogRef"
      :visible="ui.cancelDialogVisible"
      @close="ui.cancelDialogVisible = false"
      @cancel-success="handleCancelSuccess"
    />
    <SuccessfullyDialog
      ref="successfullyDialogRef"
      :visible="ui.successfullyDialogVisible"
      @close="ui.successfullyDialogVisible = false"
    />
  </portal-section>
</template>
<script>
import CancelDialog from '../components/cancel-dialog.vue'
import TableBookings from '../components/table-bookings.vue'
import SuccessfullyDialog from '../components/successfully-dialog.vue'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchMyBookings, fetchSuggestionsHotels, cancelMyBooking } from './api'
import debounce from '@/utils/debounce'
import { useFormat } from '@/utils/useFormat'
import { ElMessageBox, ElMessage } from 'element-plus'
const today = new Date()
export default {
  name: 'MyBooking',
  components: {
    CancelDialog,
    SuccessfullyDialog,
    TableBookings
  },
  setup() {
    // ref DOM
    const { formatDate } = useFormat()
    const successfullyDialogRef = ref(null)
    const cancelDialogRef = ref(null)
    // data
    const { t, locale } = useI18n()
    const ui = reactive({
      loading: false,
      loadingHotels: false,
      cancelDialogVisible: false,
      successfullyDialogVisible: false,
      bookingStatus: [
        {
          label: 'allStatus',
          value: 0
        },
        {
          label: 'confirmed',
          value: 1
        },
        {
          label: 'cancel',
          value: 3
        }
      ],
      types: [
        {
          label: 'bookingTime',
          value: 2
        },
        {
          label: 'checkInDate',
          value: 1
        }
      ]
    })
    const listSuggestionsHotels = ref([])
    const pagination = ref({})
    const currentPage = ref(1)
    const myBookings = ref([])
    const filterGetter = JSON.parse(sessionStorage.getItem('filterMybooking'))
    if (filterGetter) {
      filterGetter.hotelSn = ''
    }
    const filter = filterGetter ? reactive(filterGetter) : reactive({
      startDate: formatDate(today, false),
      endDate: formatDate(today, false),
      hotelSn: '',
      type: 1,
      bookingStatus: 0,
      limit: 10,
      page: 1
    })
    // computed
    const dateRange = computed({
      get: () => [filter.startDate, filter.endDate],
      set: val => {
        filter.startDate = val[0]
        filter.endDate = val[1]
      }
    })
    // watch
    watch(
      () => dateRange.value, value => {
        sessionStorage.setItem('filterMybooking', JSON.stringify(filter))
        onFetchMyBookings()
      }
    )
    // life cycle
   onMounted(() => {
      onFetchMyBookings()
    })
    // methods
    const changeFilter = () => {
      sessionStorage.setItem('filterMybooking', JSON.stringify(filter))
      onFetchMyBookings()
    }
    const searchSuggestionsHotels = debounce(function (keyword) {
      onFetchSuggestionsHotels({
        limit: 10,
        keyword: keyword
      })
    }, 500)
    const handleCancelSuccess = () => {
      ui.successfullyDialogVisible = true
      onFetchMyBookings()
    }
    const onFetchSuggestionsHotels = async (params) => {
      ui.loadingHotels = true
      try {
        const { data } = await fetchSuggestionsHotels(params)
        listSuggestionsHotels.value = data.data
      } catch (error) {
        return false
      } finally {
        ui.loadingHotels = false
      }
    }
    const openCancelConfirm = (sn) => {
      const message = t('page.myBooking.cancelMessage')
      ElMessageBox.confirm(
        `${message}?`,
        '',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'info',
        }
      )
      .then(async () => {
        try {
          const { data } = await cancelMyBooking({ sn: sn })
          if (data.data) {
            ElMessage({
              type: 'success',
              message: t('message.updateSuccess')
            })
          }
          onFetchMyBookings()
        } catch (error) {
          return false
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
    }
    const onFetchMyBookings = async () => {
      ui.loading = true
      try {
        const { data } = await fetchMyBookings(filter)
        myBookings.value = data.data.myBookingList
        pagination.value = data.data.meta
      } catch (error) {
        return false
      } finally {
        ui.loading = false
      }
    }
    const showSuccessfullyDialog = () => {
      ui.successfullyDialogVisible = true
    }
    const showCancelDialog = (data) => {
      if (data.typePopup === 2) {
        cancelDialogRef.value.setupDialog(data)
        ui.cancelDialogVisible = true
      } else if (data.typePopup === 1) {
        openCancelConfirm(data.sn)
      }
    }
    const handleSizeChange = (value) => {
      filter.limit = Number(value)
      onFetchMyBookings()
    }
    const handleCurrentChange = (value) => {
      filter.page = Number(value)
      onFetchMyBookings()
    }
    return {
      // ref
      currentPage,
      pagination,
      cancelDialogRef,
      successfullyDialogRef,
      // data
      myBookings,
      listSuggestionsHotels,
      ui,
      filter,
      t,
      locale,
      // computed
      dateRange,
      // methods
      handleSizeChange,
      handleCurrentChange,
      searchSuggestionsHotels,
      onFetchMyBookings,
      showSuccessfullyDialog,
      showCancelDialog,
      handleCancelSuccess,
      openCancelConfirm,
      changeFilter
    }
  }
}
</script>
<style lang="stylus" module>
.booking
  &__header
    margin-bottom $space * 4
    display flex
    align-items center
    :global
      .el-select,
      .el-range-editor,
      .el-input
        margin-right $space * 4
  &__option
    height auto !important
  @media (max-width 1440px)
    &__header
      margin-bottom $space * 4
      display flex
      align-items center
      flex-wrap wrap
      margin-top: -($space * 4);
      &--item
        margin-top $space * 4
</style>