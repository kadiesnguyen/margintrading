<!-- =========================================================================================
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Admin
  Author: Ares
  Author Telegram: @skydnz
========================================================================================== -->

<template>
  <div id="list-history-deposit" class="data-list-container">
    <div id="loading-corners" class="vs-con-loading__container">
      <vs-table ref="table"  pagination :max-items="itemsPerPage" search :data="products">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <!-- ITEMS PER PAGE -->
          <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2 text-black">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ products.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : products.length }} of {{ queriedItems }}</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>

              <vs-dropdown-item @click="itemsPerPage=20">
                <span>20</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage=50">
                <span>50</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage=100">
                <span>100</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <template slot="thead">
          <vs-th sort-key="id">ID</vs-th>
          <vs-th sort-key="account">{{ $t('tendangnhap') }}</vs-th>
          <!-- <vs-th sort-key="type">Tên</vs-th> -->
          <vs-th sort-key="amount">{{ $t('sotien') }}</vs-th>
          <vs-th sort-key="note">{{ $t('ghichu') }}</vs-th>
          <vs-th sort-key="status">{{ $t('trangthai') }}</vs-th>
          <vs-th sort-key="datecreate">{{ $t('thoigian') }}</vs-th>
          <vs-th>{{ $t('hanhdong') }}</vs-th>
        </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                <vs-td>
                  <p class="">
                    {{tr.id}}
                  </p>
                </vs-td>

                <vs-td>
                      <p class="de-name font-medium truncate">{{ tr.email }}</p>
                </vs-td>
                <vs-td>
                  <p class="de-amount">{{ formatPrice(tr.amount, 0) }}<br>
                  </p>
                </vs-td>

                <vs-td>
                  <div class="de-note" style="white-space: nowrap;" v-html="formatBank(tr.bank)"></div>
                </vs-td>

                <vs-td>
                  <vs-chip :color="getOrderStatusColor(tr.status)" class="de-status">{{ getOrderStatusColorText(tr.status) | title }}</vs-chip>
                </vs-td>

                <vs-td>
                  <p class="de-create">{{ formatDate(tr.created_at) }}</p>
                </vs-td>

                <vs-td class="whitespace-no-wrap text-left">
                      <vx-tooltip v-if="tr.status === 0" style="float: left" color="primary" text="Xử lý">
                          <vs-button color="dark" type="line" icon-pack="feather" icon="icon-feather" @click.stop="toggleDataSidebarHandleMoney(tr)"></vs-button>
                      </vx-tooltip>
                      <span v-else-if="tr.status == 1" style="color: #00ff37;">Đã duyệt</span>
                      <span v-else style="color: #ff6f6f;">Từ chối</span>
                      <!-- <vx-tooltip v-if="tr.delete_status == 0" style="float: left" color="danger" text="Xóa">
                          <vs-button color="dark" type="line" icon-pack="feather" icon="icon-trash" @click.stop="deleteDeposit(tr.id, indextr, 1)"></vs-button>
                      </vx-tooltip> -->
                      <!-- <vx-tooltip v-else style="float: left" color="warning" text="Thu hồi">
                          <vs-button color="dark" type="line" icon-pack="feather" icon="icon-arrow-up-left" @click.stop="deleteDeposit(tr.id, indextr, 0)"></vs-button>
                      </vx-tooltip> -->
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
      </vs-table>
    </div>
    <data-view-sidebar
      :isSidebarActive="isHandleMoney"
      @closeSidebar="toggleDataSidebarHandleMoney"
      :currentDataMoney="currentDataMoney"
    />
  </div>
</template>

<script>

import vSelect from 'vue-select'
import AuthenticationService from '@/services/AuthenticationService'
import DataViewSidebar from '@/layouts/account/slidebar/HandleMoneyNap.vue'
import moment from 'moment'
import Vue from 'vue'

export default {
  components: {
    vSelect,
    DataViewSidebar,
  },
  data() {
    return {
      showDeleteMultiBt: true,
      activePrompt: false,
      selectedUser: [],
      fileName: "",
      formats:["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      headerTitle: ["Tài khoản", "Loại", "Số Tiền", "Trạng Thái", "Ngày Nạp" ],
      headerVal: ["account", "type", "amount", "status", "datecreate" ],
      productsFake: [
      ],
      itemsPerPage: 20,
      isMounted: false,
      isHandleMoney: false,
      currentDataMoney: {},

      dtUSD: 0,
      dtBNB: 0,
      feeBNB: 0,
    }
  },
  computed: {
    currentPage() {
      if(this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    products() {
      return this.productsFake
    },
    queriedItems() {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.productsFake.length
    }
  },
  methods: {
    formatBank(bank){
      if(!bank) return "";
      const bankInfo = bank.split("|")
      return `<p>Ngân hàng: <b>${bankInfo[0]}</b></p>
              <p>Số tài khoản: <b>${bankInfo[1]}</b></p>
              <p>Chủ tài khoản: <b>${bankInfo[2]}</b></p>`
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
    toggleDataSidebarHandleMoney(tr) {
      this.isHandleMoney = !this.isHandleMoney;

      if (tr.isEdit) {
        const indReNew = this.productsFake.findIndex((e) => e.id === tr.id);
        if (indReNew > -1) {
          const prodClone = JSON.parse(JSON.stringify(this.productsFake));
          prodClone[indReNew].note = tr.note;
          prodClone[indReNew].status = tr.status;
          this.productsFake = prodClone;
        }
      }

      if (typeof tr !== 'undefined') {
        this.currentDataMoney = tr;
      }
    },
    typeMoney(currency) {
      switch (currency.toUpperCase()) {
        case 'BTC':
        case 'ETH':
        case 'USDT':
          return {
            t: 'Hệ thống',
            i: require('@/assets/images/sky/icon_bank/paypal-mini.png')
          }
        case 'VND':
          return {
            t: 'Ngân hàng VNĐ',
            i: require('@/assets/images/sky/icon_bank/vnd-mini.svg')
          }

        default:
          return {
            t: currency.toUpperCase(),
            i: require('@/assets/images/sky/icon_bank/paypal-mini.png')
          }
      }
    },

    deleteMultiple(){
      let token = localStorage.getItem('token')
      this.$store.dispatch('setToken', token)

      if(this.selectedUser.length == 0){
        return this.$vs.notify({
          text:'Hãy chọn đối tượng cần xóa',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'});
      }
      for(var i = this.selectedUser.length - 1; i >= 0 ;i--){
          let id = this.selectedUser[i]['id'];
          let obj = {
            id: id,
            val: 1
          }
          AuthenticationService.deleteTrashByID(obj)
          .then((resp) => {
            if(!resp.data.success){
              localStorage.removeItem('token');
              this.$router.push('/pages/login').catch(() => {})
            }
          })
          Vue.delete(this.productsFake, i)
      }
      this.selectedUser = []
      return this.$vs.notify({
          text:'Đã xóa thành công',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'});
    },

    deleteDeposit(id, index, val) {
      let token = localStorage.getItem('token')
      this.$store.dispatch('setToken', token)
      let obj = {
        id: id,
        val: val
      }
      AuthenticationService.deleteTrashByID(obj)
        .then((resp) => {
          if(resp.data.success){
              Vue.delete(this.productsFake, index)
              this.popupDeleteActive = false
              return this.$vs.notify({
                  text:'Đã xóa thành công',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'});
          }else{
            localStorage.removeItem('token');
            this.$router.push('/pages/login').catch(() => {})
          }
        })
    },

    trashDataDeposit(){
      this.showDeleteMultiBt = false
      let token = localStorage.getItem('token')
      this.$store.dispatch('setToken', token)

      AuthenticationService.getDepositAllTrash()
      .then((resp) => {
        if(!resp.data.success){
            localStorage.removeItem('token');
            this.$router.push('/pages/login').catch(() => {})
        }else{
            this.productsFake = resp.data.data;
        }
      })
    },

    getOrderStatusColor(status) {
      if(status == 0) return "warning"
      if(status == 1) return "success"
      //if(status == 2) return "danger"
      return "warning"
    },
    getOrderStatusColorText(status) {
      if(status == 0) return "Đang xử lý"
      if(status == 1) return "Hoàn thành"
      if(status == -1) return "Từ chối"
      //if(status == 2) return "danger"
      return "Đang xử lý"
    },

    getIconType(type){
      let cur = type.toUpperCase();
      return cur
    },

    formatDate(value){
      if (value) {
          return moment(String(value)).format('MM/DD/YYYY hh:mm:ss')
      }
    },

    formatPrice(value, minimum){
      if(void 0 === value) value = 0;
      var formatter = new Intl.NumberFormat('en-US', {
          //style: 'currency',
          //currency: '',
          minimumFractionDigits: minimum
      });

      return formatter.format(value);
    },

    toggleDataSidebar(val=false) {
      this.addNewDataSidebar = val
    },




    //==================================================================
    //==================================================================
    //==================================================================
    //==================================================================
    //==================================================================
    //==================================================================
    // export ra file
    //==================================================================
    exportToExcel() {
        // kiểm tra nếu chưa chọn đối tượng thình sẽ không hiện bản xuất file
      if(this.selectedUser.length == 0){
        return this.$vs.notify({
            title:'Xuất dữ liệu',
            text:'Vui lòng chọn nội dung để hoàn thành',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-heart'});
      }
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.selectedUser
        const data = this.formatJson(this.headerVal, list)
        excel.export_json_to_excel({
          header: this.headerTitle,
          data,
          filename: this.fileName,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat
        })
        this.clearFields()
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        // Add col name which needs to be translated
        // if (j === 'timestamp') {
        //   return parseTime(v[j])
        // } else {
        //   return v[j]
        // }

        return v[j]
      }))
    },
    clearFields() {
      this.fileName = ""
      this.cellAutoWidth = true
      this.selectedFormat = "xlsx"
    },

    //==================================================================
    //==================================================================
    //==================================================================
    //==================================================================
    //==================================================================
    //==================================================================
    //==================================================================
    openLoadingInDiv(){
        this.$vs.loading({
            container: '#loading-corners',
            type: 'corners',
            scale: 0.6
        })
    },


      reloadList(){
          this.showDeleteMultiBt = true
          let token = localStorage.getItem('token')
          this.$store.dispatch('setToken', token)

          AuthenticationService.getDepositListHistory()
          .then((resp) => {

            this.$vs.loading.close('#loading-corners > .con-vs-loading');

            if(resp.data.success == 4){
                localStorage.removeItem('token');
                this.$router.push('/pages/login').catch(() => {})
            }else{
                this.productsFake = resp.data.data;
            }
          })
    },

      getDTNap(){
            AuthenticationService.getRevenueNap()
            .then((resp) => {
                let g = resp.data;

                if(g.success == 1){

                  this.dtUSD = g.data.dtUSD;
                  this.dtBNB = g.data.dtBNB;
                  this.feeBNB = g.data.freeBNB;
                }

            })
      },


  },
  created() {
    // if(!moduleDataList.isRegistered) {
    //   this.$store.registerModule('dataList', moduleDataList)
    //   moduleDataList.isRegistered = true
    // }

    //this.$store.registerModule('dataList', this.productsFake);

    //this.$store.dispatch("dataList/fetchDataListItems")
    //console.log(this.productsFake);
    //console.log(this.$store.state.dataList);
    this.reloadList();
    this.getDTNap();
  },
  mounted() {
    this.isMounted = true;
    this.openLoadingInDiv();

  }
}
</script>

<style lang="scss">
#list-history-deposit {
  .vs-con-table {

    /*
      Below media-queries is fix for responsiveness of action buttons
      Note: If you change action buttons or layout of this page, Please remove below style
    */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search{
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          &+i {
            left: 1rem;
          }

          &:focus+i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr{
          box-shadow: 0 4px 20px 0 rgba(0,0,0,.05);
          td{
            padding: 20px;
            &:first-child{
              border-top-left-radius: .5rem;
              border-bottom-left-radius: .5rem;
            }
            &:last-child{
              border-top-right-radius: .5rem;
              border-bottom-right-radius: .5rem;
            }
          }
          td.td-check{
            padding: 20px !important;
          }
      }
    }

    .vs-table--thead{
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text{
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check{
        padding: 0 15px !important;
      }
      tr{
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>
