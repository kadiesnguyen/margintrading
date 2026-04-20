<!-- =========================================================================================
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Admin
  Author: Ares
  Author Telegram: @skydn93
========================================================================================== -->

<template>
  <div id="payment-methods">
    <div id="loading-corners" class="vs-con-loading__container">
      <vs-table ref="table" pagination :max-items="itemsPerPage" :data="data">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <!-- ITEMS PER PAGE -->
          <vs-dropdown vs-trigger-click class="cursor-pointer items-per-page-handler">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2 text-black">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ data.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : data.length }} of {{ queriedItems }}</span>
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

          <div>
            <vs-button @click="showAdd">{{ $t('add') }}</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th sort-key="id">ID</vs-th>
          <vs-th sort-key="method">{{ $t('phuongthucthanhtoan') }}</vs-th>
          <vs-th sort-key="number">{{ $t('sophuongthucthanhtoan') }}</vs-th>
          <vs-th sort-key="name">{{ $t('tennganhang') }}</vs-th>
          <vs-th sort-key="holder">{{ $t('tennguoinhan') }}</vs-th>
          <vs-th sort-key="created_at">{{ $t('ngaytao') }}</vs-th>
          <vs-th v-if="checkRole('*')">{{ $t('hanhdong') }}</vs-th>
        </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :data="tr" :key="index" v-for="(tr, index) in data">
                <vs-td>
                    {{tr.id}}
                </vs-td>

                <vs-td>
                    {{ tr.method}}
                </vs-td>

                <vs-td>
                    {{ tr.number}}
                </vs-td>

                <vs-td>
                    {{ tr.name }}
                </vs-td>

                 <vs-td>
                    {{ tr.holder}}
                </vs-td>


                <vs-td>
                  <p class="user-create">{{ formatDate(new Date(tr.created_at)) }}</p>
                </vs-td>
                <vs-td class="whitespace-no-wrap text-center" v-if="checkRole('*')">
                      <vx-tooltip style="float: left" :title="tr.email" color="info" text="Edit">
                          <vs-button color="dark" type="line" icon-pack="feather" icon="icon-edit" @click="editBankPopup(tr)"></vs-button>
                      </vx-tooltip>

                       <vx-tooltip style="float: left" :title="tr.email" color="info" text="Lock">
                          <vs-button color="dark" type="line" icon-pack="feather" icon="icon-lock"></vs-button>
                      </vx-tooltip>
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
      </vs-table>
    </div>

     <vs-popup class="" :title="`${id == -1 ? $t('them') : $t('chinhsua')} ${$t('phuongthucthanhtoan')}`" :active.sync="isshowMethodsPopup">
        <vs-input :label="$t('phuongthucthanhtoan')" :placeholder="!methodName ? 'INTERNET BANKING' : '' " v-model="methodName" class="w-full"/>
        <vs-input :label="$t('sophuongthucthanhtoan')" :placeholder="!numberMethods ? '111111111' : ''" v-model="numberMethods" class="w-full"/>
        <vs-input :label="$t('tennganhang')" :placeholder="!bankName ? 'CITY BANK' : ''" v-model="bankName" class="w-full"/>
        <vs-input :label="$t('tennguoinhan')" :placeholder="!holderName ? 'NGUYEN VAN A': ''" v-model="holderName" class="w-full"/>
        <vs-button class="mt-4" @click="setBankList">Gửi</vs-button>
     </vs-popup>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import AuthenticationService from '@/services/AuthenticationService'
import moment from 'moment'
import { checkRole } from "@/helpers/helpers.js"

export default {
  components: {
    vSelect,
  },
  data() {
    return {
        checkRole,
        data: [],
        isMounted: false,
        itemsPerPage: 20,
        isshowMethodsPopup: false,
        methodName: "",
        numberMethods: "",
        bankName: "",
        holderName: "",
        editing: null,
        id: -1,
    }
  },
  computed: {
    currentPage() {
      if(this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    queriedItems() {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.data.length
    }
  },
  methods: {
    setBankList(){
        if(this.id == -1){
            this.updateBankList();
        }
        else {
            this.editBank();
        }
    },
    showAdd(){
        this.id = -1;
        this.methodName = "",
        this.numberMethods = "",
        this.bankName = "",
        this.holderName = "",
        this.isshowMethodsPopup = true;
    },

    updateBankList(){
        const bank = {
            method: this.methodName,
            number: this.numberMethods,
            name: this.bankName,
            holder: this.holderName,
            id: this.data.length + 1,
            created_at: Date.now()
        }

        const bankList = [...this.data, bank]
        AuthenticationService.setBankList(bankList).then( (res) => {
            if(res.data.success == 1){
                this.data.push(bank)
            }
            this.isshowMethodsPopup = false;
            return this.$vs.notify({
                text: "Thêm thành công thành công!",
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'
            });
        })
    },

    formatDate(value){
      if (value) {
          return moment(String(value)).format('MM/DD/YYYY hh:mm:ss')
      }
    },

    editBankPopup(bank){
        this.methodName = bank.method;
        this.numberMethods = bank.number;
        this.bankName = bank.name;
        this.holderName = bank.holder;
        this.id = bank.id;
        this.isshowMethodsPopup = true;
    },

    editBank(){
        const index = this.data.findIndex((e)=>{
            return e.id == this.id;
        });
        const bank = {
            method: this.methodName,
            number: this.numberMethods,
            name: this.bankName,
            holder: this.holderName,
        }

        const bankList = [...this.data]
        bankList[index] = {...bankList[index], ...bank}
        AuthenticationService.setBankList(bankList).then( (res) => {
            if(res.data.success == 1){
                if(index != -1){
                    this.$set(this.data, index, {...this.data[index], ...bank});
                }
                this.isshowMethodsPopup = false;
                return this.$vs.notify({
                  text: "Cập nhật thành công!",
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'});
              }
        })
    }

  },
  created() {
    AuthenticationService.getbankList().then( (res) => {
        if(res.data.success == 1){
            if(Array.isArray(res.data.data)){
                this.data = res.data.data;
            }
        }
    });
  },
  mounted() {
    this.isMounted = true;

  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/extraComponents/tree.scss";

button.btn-async{
  background: rgba(var(--vs-warning),0.15);
}

button.btn-delete{
  background: rgba(var(--vs-danger),0.15);
}
</style>

<style lang="scss">
#payment-methods {
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
