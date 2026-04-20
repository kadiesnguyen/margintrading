<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-analytics">
    <div class="vs-con-loading__container overflow-visible" id="loading-corners">
      <div class="vx-row">
        <div class="vx-col w-full lg:w-1/4 mb-base">
          <vx-card :title="$t('Status')" :subtitle="$t('today')">
            <template slot="actions">
              <feather-icon icon="MoreVerticalIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
            </template>
            <div class="flex">
              <!-- <span class="flex items-center"><div class="h-3 w-3 rounded-full mr-1 bg-primary"></div><span>Ngoại tuyến</span></span> -->
              <span class="flex items-center ml-4"><div class="h-3 w-3 rounded-full mr-1 bg-success"></div><span>Online</span></span>
            </div>
            <div slot="no-body-bottom">
              <!-- <vue-apex-charts type=radar height=385 :options="analyticsData.statisticsRadar.chartOptions" :series="salesRadar.series" /> -->
            </div>
          </vx-card>
        </div>

        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
          <statistics-card-line icon="UserPlusIcon" color="success" :statistic="dataGet.nNDK || 0" :statisticTitle="$t('newMember')" hideChart></statistics-card-line>
        </div>

        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
          <statistics-card-line icon="UsersIcon" :statistic="dataGet.nNDK || 0" :statisticTitle="$t('allMember')" hideChart></statistics-card-line>
        </div>

        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
          <statistics-card-line icon="BoxIcon" color="dark" :statistic="formatPrice(dataGet.tsBet || 0)" :statisticTitle="$t('allPlay')" hideChart></statistics-card-line>
        </div>

        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
          <statistics-card-line icon="SunIcon" color="warning" :statistic="formatPrice((dataGet.tsWin - dataGet.tsLose) || 0)" :statisticTitle="$t('totalPlay')" hideChart></statistics-card-line>
        </div>

        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
          <statistics-card-line icon="BriefcaseIcon" color="danger" :statistic="formatPrice(dataGet.tsTN || 0)" :statisticTitle="$t('totalNap')" hideChart></statistics-card-line>
        </div>

          <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
          <statistics-card-line icon="CreditCardIcon" color="dark" :statistic="formatPrice(dataGet.tsTR || 0)" :statisticTitle="$t('totalRut')" hideChart></statistics-card-line>
        </div>

      </div>
      <div class="flex flex-wrap">
        <datepicker :placeholder="$t('fromDate')" v-model="startDate" class="mr-4"></datepicker>
        <datepicker :placeholder="$t('fromDate')" v-model="endDate" class="mr-4"></datepicker>
        <vs-button class="py-1 px-2" @click="filterByDate" :disabled="!startDate && !endDate"><feather-icon icon="FilterIcon" svgClasses="h-6"/></vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import analyticsData from './ui-elements/card/analyticsData.js'
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'
import VxTimeline from "@/components/timeline/VxTimeline"
import AuthenticationService from '@/services/AuthenticationService'
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';

export default {
    data() {
        return {
            isCheckShowDT: 'all',
            checkpointReward: {},
            subscribersGained: {},
            ordersRecevied: {},
            salesBarSession: {},
            supportTracker: {},
            productsOrder: {},
            salesRadar: {},

            dataGet: {},

            rateTNFE: 0,
            analyticsData: analyticsData,
            dispatchedOrders: [],
            startDate: null,
            endDate: null,
        }
    },
    components: {
        VueApexCharts,
        StatisticsCardLine,
        ChangeTimeDurationDropdown,
        VxTimeline,
        Datepicker
    },
    methods: {
      openLoadingInDiv(){
          this.$vs.loading({
              container: "#loading-corners",
              type: 'corners',
              scale: 0.6
          })
          // this.$vs.loading({
          //     container: '#loading-corners2',
          //     type: 'corners',
          //     scale: 0.6
          // })
      },
      closeLoadingInDiv(){
          this.$vs.loading.close('#loading-corners > .con-vs-loading');
          // this.$vs.loading.close('#loading-corners2 > .con-vs-loading');
      },

      nFormatter(num, digits) {
        const lookup = [
          { value: 1, symbol: "" },
          { value: 1e3, symbol: "K" },
          { value: 1e6, symbol: "M" },
          { value: 1e9, symbol: "G" },
          { value: 1e12, symbol: "T" },
          { value: 1e15, symbol: "P" },
          { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function(item) {
          return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
      },

      formatPrice(value, minimum) {
          if(void 0 === value) value = 0;
          var formatter = new Intl.NumberFormat('en-US', {
              //style: 'currency',
              //currency: '',
              minimumFractionDigits: minimum
          });
          return formatter.format(value);
      },
      changeDT(val){
          this.openLoadingInDiv();
          let obj = {
              type: val
          }
          AuthenticationService.getShowDT(obj)
          .then((res) => {
              let g = res.data;
              this.closeLoadingInDiv();
              if(g.success == 1){
                this.dataGet.tsTNUSD = g.data.dtUSD;
                this.dataGet.tsTNThuc = g.data.dtBNB;
                this.dataGet.tsFee = g.data.freeBNB;

                this.dataGet.tsWin = g.data.tsWin;
                this.dataGet.tsLose = g.data.tsLose;
                this.dataGet.tsHHong = g.data.tsHHong;

              }

          })
      },

      filterByDate(){
        const params = {}
        if(moment(this.startDate).isValid()){
          const from = moment(this.startDate).format('yyyy-MM-DD');
          params.from = from;
        }

        if(moment(this.endDate).isValid()){
          const to = moment (this.endDate).format('yyyy-MM-DD');
          params.to = to;
        }
        this.openLoadingInDiv();
        AuthenticationService.getAnalytics(params)
        .then((res) => {
            this.closeLoadingInDiv();
            if(res.data.success == 1){
              let obj = res.data.data
              this.dataGet = obj;
            }else if(res.data.success == 4){
                localStorage.removeItem('token')
                this.$router.push('/pages/login').catch(() => {})
            }
         })
        .catch((error)   => { console.log(error) })
      }
    },
    created() {
        AuthenticationService.getAnalytics()
        .then((res) => {
            this.closeLoadingInDiv();

            if(res.data.success == 1){

              let obj = res.data.data

              this.dataGet = obj;


              //let tt = obj.tsTNFEE + obj.tsFee

              //this.rateTNFE = (obj.tsTNFEE/tt)*100


            }else if(res.data.success == 4){
                localStorage.removeItem('token')
                this.$router.push('/pages/login').catch(() => {})
            }
         })
        .catch((error)   => { console.log(error) })


      // //  User Reward Card
      // this.$http.get("/api/users/analytics")
      //   .then((response) => { this.checkpointReward = response.data })
      //   .catch((error)   => { console.log(error) })

      // // Subscribers gained - Statistics
      // this.$http.get("/api/card/card-statistics/subscribers")
      //   .then((response) => { this.subscribersGained = response.data })
      //   .catch((error)   => { console.log(error) })

      // // Orders - Statistics
      // this.$http.get("/api/card/card-statistics/orders")
      //   .then((response) => { this.ordersRecevied = response.data })
      //   .catch((error)   => { console.log(error) })

      // // Sales bar - Analytics
      // this.$http.get("/api/card/card-analytics/sales/bar")
      //   .then((response) => { this.salesBarSession = response.data })
      //   .catch((error)   => { console.log(error) })

      // // Support Tracker
      // this.$http.get("/api/card/card-analytics/support-tracker")
      //   .then((response) => { this.supportTracker = response.data })
      //   .catch((error)   => { console.log(error) })

      // // Products Order
      // this.$http.get("/api/card/card-analytics/products-orders")
      //   .then((response) => { this.productsOrder = response.data })
      //   .catch((error)   => { console.log(error) })

      // // Sales Radar
      // this.$http.get("/api/card/card-analytics/sales/radar")
      //   .then((response) => { this.salesRadar = response.data })
      //   .catch((error)   => { console.log(error) })

      // // Dispatched Orders
      // this.$http.get("/api/table/dispatched-orders")
      //   .then((response) => { this.dispatchedOrders = response.data })
      //   .catch((error)   => { console.log(error) })
    },
    mounted() {

      this.openLoadingInDiv();
    }
}
</script>

<style lang="scss">
/*! rtl:begin:ignore */
#dashboard-analytics {
  .greet-user{
    position: relative;

    .decore-left{
      position: absolute;
      left:0;
      top: 0;
    }
    .decore-right{
      position: absolute;
      right:0;
      top: 0;
    }
  }

  @media(max-width: 576px) {
    .decore-left, .decore-right{
      width: 140px;
    }
  }
}
/*! rtl:end:ignore */
</style>
