<template>
  <portal-section :class="$style['revenue']">
    <template  #header>
      <el-form
        :inline="true"
        :model="filter"
        class="demo-form-inline"
      >
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
            @change="listRevenueData"
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
            @change="listRevenueData"
          >
            <el-option
              v-for="(item, index) in ui.type"
              :key="index"
              :value="item.value"
              :label="t(item.label)"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <el-table
      v-loading="ui.isLoadingRevenue"
      :data="dataRevenue"
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
            :to="{ path: `/revenues-detail/${scope.row.hotelSn}`, 
            query: { startDate: filter.startDate, endDate: filter.endDate} }">
            {{ scope.row.hotelName }}
          </router-link>
          <p>
            {{ scope.row.hotelCode }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :class-name="'break-all'"
        :label="t('page.revenue.total_confirmed')"
        :min-width="90"
      >
        <template #default="scope">
          <p>
            {{ formatMoney(scope.row.totalConfirmed) }}
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
    <template #footer>
        <el-pagination
          v-model:currentPage="filter.page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="filter.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ui.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
    </template>
  </portal-section>
</template>
<script>
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { listRevenue, fetchSuggestionsHotels } from './api'
import debounce from '@/utils/debounce'
import { useFormat } from '@/utils/useFormat'
const today = new Date()

export default defineComponent({
  name: 'Revenue',
  setup() {
    // data
    const { formatDate, formatMoney } = useFormat()
    const { t, locale } = useI18n()
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
      hotelSn: '',
      type: 1,
      page: 1,
      limit: 10,
      startDate: formatDate(
        new Date(today.getFullYear(), today.getMonth(), 1),
        false
      ),
      endDate: formatDate(
        new Date(today.getFullYear(), today.getMonth() + 1, 0),
        false
      ),
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
        listRevenueData()
      }
    )
    // life cycle
    onMounted(
      () => {
        listRevenueData()
      }
    )
    // method
    const listRevenueData = async () => {
      ui.isLoadingRevenue = true
      dataRevenue.value = []
      try {
        const { data }  = await listRevenue(filter)
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
      listRevenueData()
    }
    const handleCurrentChange = async (page) => {
      filter.page = page
      listRevenueData()
    }

    
    const indexMethod = (index) => {
      if (index == 0) {
        return '';
      } else {
        return index;
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
      indexMethod,
      searchSuggestionsHotels,
      listRevenueData,
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