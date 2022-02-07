<template>
  <portal-section
    v-loading="ui.loading"
    :class="$style['search-booking']"
  >
    <template #header>
      <el-input
        v-model="filter.searchId"
        :placeholder="t('page.myBooking.search')"
        @input="handleSearch"
      />
    </template>
    <TableBookings
      :data="myBookings"
      @show-cancel-dialog="showCancelDialog"
      @show-successfully-dialog="showSuccessfullyDialog"
    />
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
    <!--  -->
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
import TableBookings from '../components/table-bookings.vue'
import CancelDialog from '../components/cancel-dialog.vue'
import SuccessfullyDialog from '../components/successfully-dialog.vue'
import { defineComponent, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { searchMyBookings } from './api'
import { cancelMyBooking } from '../list/api'
import debounce from '@/utils/debounce'
import { ElMessage, ElMessageBox } from 'element-plus'
export default defineComponent({
  name: 'SearchById',
  components: {
    TableBookings,
    CancelDialog,
    SuccessfullyDialog
  },
  setup() {
    // ref DOM
    const successfullyDialogRef = ref(null)
    const cancelDialogRef = ref(null)
    // data
    const { t, locale } = useI18n()
    const ui = reactive({
      loading: false,
      cancelDialogVisible: false,
      successfullyDialogVisible: false
    })
    const currentPage = ref(1)
    const pagination = ref({})
    const myBookings = ref([])
    const filter = reactive({
      searchId: '',
      limit: 10,
      page: 1
    })
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
            onSearchMyBookings()
          }
        } catch (error) {
          return false
        }
      })
    }
    const handleSearch = debounce(function () {
      onSearchMyBookings()
    }, 600)
    const onSearchMyBookings = async () => {
      ui.loading = true
      try {
        const { data } = await searchMyBookings(filter)
        myBookings.value = data.data.myBookingList
        pagination.value = data.data.meta
      } catch (error) {
        return false
      } finally {
        ui.loading = false
      }
    }
    const handleCancelSuccess = () => {
      ui.successfullyDialogVisible = true
      onSearchMyBookings()
    }
    const handleSizeChange = (value) => {
      filter.limit = Number(value)
      onSearchMyBookings()
    }
    const handleCurrentChange = (value) => {
      filter.page = Number(value)
      onSearchMyBookings()
    }
    return {
      // ref
      cancelDialogRef,
      successfullyDialogRef,
      // data
      myBookings,
      currentPage,
      ui,
      filter,
      pagination,
      t,
      locale,
      // methods
      showSuccessfullyDialog,
      showCancelDialog,
      handleSearch,
      handleCancelSuccess,
      openCancelConfirm,
      handleCurrentChange,
      handleSizeChange
    }
  }
})
</script>
<style lang="stylus" module>
.search-booking
  :global
    .el-select, .el-date-editor, .el-input
      margin-right $space * 4
</style>