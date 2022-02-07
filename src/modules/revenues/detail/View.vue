<template>
  <portal-section :class="$style['revenue']">
    <template v-slot:header>
      <el-form :inline="true" :model="filter" class="demo-form-inline">
        <el-form-item>
           <el-select
            v-model="filter.hotelSn"
            :loading="ui.isLoadingHotel"
            :placeholder="t('page.myBooking.hotelName')"
            remote
            filterable
            :remote-method="searchSuggestionsHotels"
            prefix-icon="el-icon-search"
            clearable
            @change="getRevenueData"
          >
            <el-option
              v-for="(item, index) in listSuggestionsHotels"
              :key="index"
              :label="item.name"
              :value="item.sn"
              :class="$style['hotel-list']"
            >
              <p>
                {{ item.name }}
              </p>
              <p>
                {{ item.address }}
              </p>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filter.type"
            @change="getRevenueData"
          >
            <el-option
              v-for="(item, index) in ui.type"
              :key="index"
              :value="item.value"
              :label="t(item.label)"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <el-table
      :data="dataRevenue"
      v-loading="ui.isLoadingRevenue"
    >
      <el-table-column
        :class-name="'break-all'"
        label="#"
        type="index"
        min-width="2"
        :index="indexMethod"
      />
      <el-table-column
        :class-name="'break-all'"
        :label="t('page.revenue.hotel_name')"
        :min-width="90"
      >
        <template #default="scope">
          <router-link 
            :to="{ name: 'HotelDetails', params: { sn: scope.row.hotelSn ? scope.row.hotelSn : ' ' } }">
            {{ scope.row.hotelName }}
          </router-link>
          <p>
            {{ scope.row.hotelCode }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :class-name="'break-all'"
        :label="t('page.revenue.booking_info')"
        :min-width="90"
      >
        <template #default="scope">
          <p>
            {{ scope.row.bookingNo }}
          </p>
          <p>
            {{ scope.row.mobile}}
          </p>
          <p>
            {{ scope.row.roomTypeName}}
          </p>
          <p>
            {{ getBookingType(scope.row.type)}} {{ scope.row.checkInDatePlan }}
            <span v-if="scope.row.type === 3">{{ scope.row.endDate }}</span>
          </p>
          <p v-if="scope.row.type === 1">
            {{ formatTime(scope.row.startTime) }} ~ {{ formatTime(scope.row.endTime) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :class-name="'break-all'"
        :label="t('page.revenue.extra_fee')"
        :min-width="90"
      >
        <template #default="scope">
          <p>
            {{ formatMoney(scope.row.extraFee) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :class-name="'break-all'"
        :label="t('page.revenue.total_amount')"
        :min-width="90"
      >
        <template #default="scope">
          <p>
            {{ formatMoney(scope.row.totalAmount) }}
          </p>
        </template>
      </el-table-column>
       <el-table-column
        :class-name="'break-all'"
        :label="t('page.revenue.discount')"
        :min-width="90"
      >
        <template #default="scope">
          <p>
            {{ formatMoney(scope.row.totalHotelDiscount) }}
          </p>
        </template>
      </el-table-column>
       <el-table-column
        :class-name="'break-all'"
        :label="t('page.revenue.user_pay')"
        :min-width="90"
      >
        <template #default="scope">
          <p>
            {{ formatMoney(scope.row.amountFromUser) }}
          </p>
        </template>
      </el-table-column>
       <el-table-column
        :class-name="'break-all'"
        :label="t('page.revenue.paid_in_advance')"
        :min-width="90"
      >
        <template #default="scope">
          <p>
            {{ formatMoney(scope.row.paidInAdvance) }}
          </p>
        </template>
      </el-table-column>
    </el-table>
    <template v-slot:footer>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="filter.page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="filter.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ui.total"
        />
    </template>
  </portal-section>
</template>
<script>
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { getRevenue, fetchSuggestionsHotels } from './api'
import debounce from '@/utils/debounce'
import { useRoute } from 'vue-router'
import { useFormat } from '@/utils/useFormat'
const today = new Date()

export default defineComponent({
  name: 'Revenue',
  setup() {
    // data
    const { formatDate, formatMoney, formatTime } = useFormat()
    const { t, locale } = useI18n()
    const route = useRoute()
    const ui = reactive({
      isLoadingRevenue: false,
      isLoadingHotel: false,
      total: 0,
      type: [
        {
          label: 'page.revenue.check_in_date',
          value: 1
        },
        {
          label: 'page.revenue.booking_time',
          value: 2
        }
      ]
    })
    const listSuggestionsHotels = ref([])
    const dataRevenue = ref([])
    const filter = reactive({
      hotelSn: Number(route.params.sn),
      type: 1,
      page: 1,
      limit: 10,
      startDate: formatDate(route.query.startDate,false),
      endDate: formatDate(route.query.endDate,false),
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
        getRevenueData()
      }
    )
    // life cycle
    onMounted(
      () => {
        getRevenueData()
        onFetchSuggestionsHotels({
          limit: 10,
          hotelSn: route.params.sn
        })
      }
    )
    // method
    const getRevenueData = async () => {
      ui.isLoadingRevenue = true
      dataRevenue.value = []
      try {
        const { data }  = await getRevenue(filter)
        if (data.data?.revenueList.length > 0) {
          dataRevenue.value = data.data.revenueList
          dataRevenue.value.unshift(data.data.statistics)
        }
        ui.total = data.data.meta.total
      } catch (error) {
        return false
      } finally {
        ui.isLoadingRevenue = false
      }
    }
    const searchSuggestionsHotels = debounce(function (keyword) {
      onFetchSuggestionsHotels({
        limit: 10,
        keyword: keyword
      })
    }, 500)
    const onFetchSuggestionsHotels = async (params) => {
      ui.isLoadingHotel = true
      try {
        const { data } = await fetchSuggestionsHotels(params)
        listSuggestionsHotels.value = data.data
      } catch (error) {
        return false
      } finally {
        ui.isLoadingHotel = false
      }
    }
    const handleSizeChange = async (size) => {
      filter.limit = size
      getRevenueData()
    }
    const handleCurrentChange = async (page) => {
      filter.page = page
      getRevenueData()
    }

    
    const indexMethod = (index) => {
      if (index == 0) {
        return '';
      } else {
        return index;
      }
    }
    const getBookingType = (type) => {
      switch (type) {
        case 1:
          return t('page.myBooking.hourly') + ' :' 
        case 2:
          return t('page.myBooking.overnight') + ' :'
        case 3:
          return t('page.myBooking.daily') + ' :'
      }
    }
    return {
      // data
      t,
      locale,
      ui,
      dataRevenue,
      filter,
      listSuggestionsHotels,
      // computed
      dateRange,
      // methods
      formatMoney,
      formatTime,
      indexMethod,
      getBookingType,
      searchSuggestionsHotels,
      getRevenueData,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>
<style lang="stylus" module>
  .hotel-list
    font-size: 13px;
    color: #4a5d6e;
    height: auto;
    border-bottom: 1px solid #ececec;
</style>