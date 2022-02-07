<template>
  <div :class="$style['hotel-details']">
    <portal-section
      v-if="dataHotel"
      v-loading="isLoading"
      :class="$style['hotel-details__detail']"
    >
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.Hotel_name_code_group_name') }}</p>
            </el-col>
            <el-col :span="14">
              <p type="text">
                {{ dataHotel.name }} / ({{ dataHotel.code }}) / <span>{{ dataHotel.hotelGroup?.name }}</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.payment') }}</p>
            </el-col>
            <el-col :span="14">
              <div
                v-if="dataHotel.origin != 2"
                class="col-md-6 "
              >
                <p>{{ paymentContent }}</p>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.overnight_time_daily_time') }}</p>
            </el-col>
            <el-col :span="14">
              <p>{{ dataHotel.startOvernight }}h ~ {{ dataHotel.endOvernight }}h/{{ dataHotel.startDaily }}h ~ {{ dataHotel.endDaily }}h</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.province_district') }}</p>
            </el-col>
            <el-col :span="14">
              <p>{{ dataHotel.provinceName }} / {{ dataHotel.districtName }} </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.address') }}</p>
            </el-col>
            <el-col :span="14">
              <p>{{ dataHotel.address }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.display') }}</p>
            </el-col>
            <el-col :span="14">
              <p
                v-if="dataHotel.display == 1"
                type="text"
              >
                <i class="el-icon-check" />
              </p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.total_review') }}</p>
            </el-col>
            <el-col :span="14">
              <p>{{ dataHotel.totalReview }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.total_like') }}</p>
            </el-col>
            <el-col :span="14">
              <p>{{ dataHotel.totalFavorite }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.hotel_type') }}</p>
            </el-col>
            <el-col :span="14">
              <p>{{ hotelStyle }} </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.room_available') }}</p>
            </el-col>
            <el-col :span="14">
              <p>{{ roomAvailable }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              :class="$style['lable-background']"
            >
              <p>{{ t('page.hotelDetail.total_view') }}</p>
            </el-col>
            <el-col :span="14">
              <p>{{ dataHotel.totalView }}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="4"
          :class="$style['lable-background']"
        >
          <p>{{ t('page.hotelDetail.hash_tag') }}</p>
        </el-col>
        <el-col :span="20">
          <p v-if="dataHotel.hashTagList?.length > 0 && dataHotel.origin != 2">
            <el-tag
              v-for="(item, index) in dataHotel.hashTagList"
              :key="index"
              class="mr-2"
              :type="item.type"
            >
              {{ item.name }}
            </el-tag>
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="4"
          :class="$style['lable-background']"
        >
          <p>{{ t('page.hotelDetail.facilities') }}</p>
        </el-col>
        <el-col :span="20">
          <p>
            <el-row>
              <el-col
                v-for="(facilities,index) in dataHotel.facilityList" 
                :key="index"
                :span="2"
              >
                <div 
                  v-if="facilities.imagePath"
                  style="text-align: center;"
                >
                  <img
                    :class="$style['img-responsive-icon-faci']"
                    :src="formatImage(facilities.imagePath)"
                  >
                  <p
                    v-if="locale === 'vi'"
                    class="style-text-alight-center-faci"
                  >
                    {{ facilities.name }}
                  </p>
                  <p
                    v-if="locale === 'en'"
                    class="style-text-alight-center-faci"
                  >
                    {{ facilities.nameEn }}
                  </p>
                </div>
              </el-col>
            </el-row>
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="4"
          :class="$style['lable-background']"
        >
          <p>{{ t('page.hotelDetail.extra_fee') }}</p>
        </el-col>
        <el-col :span="20">
          <p
            v-if="dataHotel.extraFee == 1"
            type="text"
          >
            <i class="el-icon-check" />
            {{ t('page.hotelDetail.extra_fee') }}
            <i
              class="el-icon-top"
              :class="$style['text-danger']"
            />
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="4"
          :class="$style['lable-background']"
        >
          <p>{{ t('page.hotelDetail.vn_description') }}</p>
        </el-col>
        <el-col :span="20">
          <p v-html="dataHotel.description" />
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="4"
          :class="$style['lable-background']"
        >
          <p>{{ t('page.hotelDetail.english_description') }}</p>
        </el-col>
        <el-col :span="20">
          <p v-html="dataHotel.enDescription" />
        </el-col>
      </el-row>
    </portal-section>
    <portal-section
      v-if="!isLoading"
      v-loading="isLoading"
      :class="$style['hotel-details__image-view']"
    > 
      <template #header>
        <div :class="$style['image-label']">
          {{ t('page.hotelDetail.hotel_images') }}
        </div>
      </template>
      <vueper-slides
        ref="vueperslides1"
        :class="$style['image-main']"
        :touchable="false"
        fade
        :autoplay="false"
        :bullets="false"
        fixed-height="600px"
        @slide="$refs.vueperslides2.goToSlide($event.currentSlide.index, { emit: false })"
      >
        <vueper-slide
          v-for="(slide, i) in dataHotel.hotelImageList"
          :key="i"
          :class="$style['custome-slider-main']"
          :image="formatImage(slide.imagePath)"
        />
      </vueper-slides>
      <br>
      <vueper-slides
        ref="vueperslides2"
        :class="$style['thumbnails']"
        :style="{ maxWidth: dataHotel.hotelImageList?.length* 10 + '%' }"
        :visible-slides="dataHotel.hotelImageList?.length"
        fixed-height="100px"
        :bullets="false"
        :touchable="false"
        :gap="1"
        :arrows="false"
        @slide="$refs.vueperslides1.goToSlide($event.currentSlide.index, { emit: false })"
      >
        <vueper-slide
          v-for="(slide, i) in dataHotel.hotelImageList"
          :key="i"
          :image="formatImage(slide.imagePath)"
          @click="$refs.vueperslides2.goToSlide(i)"
        />
      </vueper-slides>
    </portal-section>
  </div>
</template>
<script>
import { useI18n } from 'vue-i18n'
import { onMounted, ref, computed, defineComponent} from 'vue';
import { getHotelDetails } from './api'
import { useRoute } from 'vue-router'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import { useFormat } from '@/utils/useFormat'

export default defineComponent({
  name: 'HotelDetails',
  components: {
    VueperSlides,
    VueperSlide
  },
  setup() {
    // data
    const isLoading = ref(false)
    const { t, locale } = useI18n()
    const route = useRoute()
    const dataHotel = ref({})
    const { formatImage } = useFormat()
    // computed
    const roomAvailable = computed (() => {
      return dataHotel.value.roomAvailable == 1 ? t('page.hotelDetail.hotel_available') : t('page.hotelDetail.hotel_unavailable')
    });
    const paymentContent = computed (() => {
      if (dataHotel.value.hotelStatus === 4) {
        return t('page.hotelDetail.at_hotel')
      } else if (dataHotel.value.hotelStatus === 3) {
        switch (dataHotel.value.paymentWay) {
          case 1:
            return t('page.hotelDetail.both')
          case 2:
            return t('page.hotelDetail.at_hotel')
          case 3:
            return t('page.hotelDetail.online')
          default:
            return ''
        }
      } else {
        return ''
      }
    });
    const hotelStyle = computed (() => {
      switch (dataHotel.value.style) {
          case 0:
            return '---'
          case 1:
            return t('page.hotelDetail.couples')
          case 2:
            return t('page.hotelDetail.travel')
          case 3:
            return t('page.hotelDetail.couples_and_travel')
          case 4:
            return t('page.hotelDetail.quarantine')
          default:
            return ''
        }
    });
    // life cycle
    onMounted(
      () => {
        getHotelDetail(route.params.sn)
      },
    )
    // method
    const getHotelDetail = async (sn) => {
      try {
        isLoading.value = true
        const { data }  = await getHotelDetails({
          hotelSn: sn,
          bookingType: 1
        })
        dataHotel.value = data.data
      } catch (error) {
        return false
      } finally {
        isLoading.value = false
      }
    }
    return {
      t,
      locale,
      isLoading,
      dataHotel,
      roomAvailable,
      paymentContent,
      hotelStyle,
      getHotelDetail,
      formatImage
    }
  }
})
</script>
<style lang="stylus" module>
.hotel-details
  .portal-section
    padding: 12px !important;
  p
    padding: 12px
    color: #606266
.lable-background
  background-color: #F0F0F0;
.image-label
    padding: 10px;
    background-color: #6fb2f9;
    display: block;
    width: 100%;
    color: #ffff
.image-main
    padding-bottom: 10px;
.text-danger
  color: #F56C6C
.thumbnails
  margin: auto;
  max-width: 300px;
  .vueperslide
    box-sizing: border-box;
    border: 1px solid #fff;
    transition: 0.3s ease-in-out;
    opacity: 0.7;
  .vueperslide--active
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
    opacity: 1;
    border-color: #000;

.custome-slider-main 
  @media (min-width: 640px) 
      width: 50%;
      display: block;
      margin: 0 auto;
.img-responsive-icon-faci
    margin: 0 auto;
    height: 40px;
    width: 40px;
</style>