<!-- =========================================================================================
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Admin
  Author: Ares
  Author Telegram: @skydnz
========================================================================================== -->

<template>
  <div id="list-agency-account" class="data-list-container">
    <template v-if="!isShowCapDuoiPopup">
      <vs-tabs class="px-6" v-if="checkRole('VIEW_ROLE')">
          <vs-tab :label="$t('nhanvien')" @click="tab='nv'" >
          </vs-tab>
          <vs-tab :label="$t('vaitro')" @click="tab='role'">
          </vs-tab>
      </vs-tabs>
      <div id="loading-corners" class="vs-con-loading__container" v-if='tab=="nv"'>
        <vs-table ref="table" pagination :max-items="itemsPerPage" search :data="products">
          <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

            <div class="flex flex-wrap-reverse items-center data-list-btn-container">
              <!-- ADD NEW -->
              <div>
                <vs-button @click="addNewAccountPopup" v-if="checkRole('*')">{{ $t('add') }}</vs-button>
              </div>
            </div>

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
            <vs-th sort-key="username">{{ $t('tendangnhap') }}</vs-th>
            <vs-th sort-key="email">Email</vs-th>
            <vs-th sort-key="name">Name</vs-th>
            <vs-th sort-key="isDisabled">{{ $t('trangthai') }}</vs-th>
            <vs-th sort-key="last_login">Last activate</vs-th>
            <vs-th sort-key="role">{{ $t('vaitro') }}</vs-th>
            <vs-th sort-key="ref_code">Code REF</vs-th>
            <vs-th v-if="checkRole('*')">{{ $t('hanhdong') }}</vs-th>
          </template>

            <template slot-scope="{data}">
              <tbody>
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <p>{{ tr.username }}</p>
                    </vs-td>

                  <vs-td>
                      <p>{{ tr.email}}</p>
                  </vs-td>

                  <vs-td>
                      <p>{{ tr.first_name }} {{ tr.last_name }}</p>
                  </vs-td>

                  <vs-td>
                    {{ tr.isDisabled ? "LOCKED" :  "ACTIVE"}}
                  </vs-td>

                  <vs-td>
                    {{ tr.last_login || 'N/A'}}
                  </vs-td>

                  <vs-td>
                    {{ tr.manage_supers == 1 ? $t('quantrivien') : $t('nhanvien')}}
                  </vs-td>

                  <vs-td>
                    {{ tr.ref_code }}
                  </vs-td>


                  <vs-td class="whitespace-no-wrap text-center" v-if="checkRole('*')">
                        <vx-tooltip style="float: left" :title="tr.nick_name" color="warning" text="EDIT">
                            <vs-button color="dark" type="line" icon-pack="feather" icon="icon-edit" @click.stop="editUserPopup(tr)"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="float: left" :title="tr.email" color="warning" :text="tr.isDisabled ? 'UNLOCK' : 'LOCK'">
                            <vs-button color="dark" type="line" icon-pack="feather" :icon="`icon-${tr.isDisabled ? 'unlock' : 'lock'}`" @click.stop="toggleLockAccount(tr)"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="float: left" :title="tr.email" color="info" text="View ref">
                            <vs-button color="dark" type="line" icon-pack="feather" icon="icon-eye" @click="showPopupCapDuoi(tr)"></vs-button>
                        </vx-tooltip>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
        </vs-table>

      </div>

      <div v-else>
        <edit-role />
      </div>

      <vs-popup background-color="rgba(255,255,255,.6)" class="" title="Background" :active.sync="popupDeleteActive">
        <p> Bạn đồng ý xóa tài khoản {{ UserInfo.email }} này.</p>
        <vs-button icon="icon-trash" icon-pack="feather" type="gradient" @click.stop="deleteUser(UserInfo.id, UserInfo.index)">Đồng ý</vs-button>
      </vs-popup>

      <vs-popup class="" :title="`${id == -1 ? $t('xemthongtinnguoidung') : $t('suathongtinnguoidung')}`" :active.sync="isShowUserPopup">
          <div v-if="id == -1">
              <label for="" class="vs-input--label">Open from list user</label>
            <v-select v-model="selectedAddRoleUser" :options="listAllusers.filter(u => !u.manage_supers )" :reduce="m => m.id" label="username" class="w-full" @option:selected="onSelectUser" v-if="userLoaded"/>
             <div v-else class="ml-2">Loading {{this.listAllusers.length}} / {{userCount}}</div>
          </div>

          <label for="" class="vs-input--label">{{ $t('tendangnhap') }} <span class="text-danger">*</span></label>
          <vs-input :placeholder="!username ? '' : '' " v-model="username" class="w-full"/>
          <label for="" class="vs-input--label">Mật khẩu <span v-if="id == -1" class="text-danger">*</span></label>
          <vs-input :placeholder="!password ? '******' : ''" v-model="password" class="w-full"/>
          <vs-input label="First name" :placeholder="!lastName ? 'A' : ''" v-model="lastName" class="w-full"/>
          <vs-input label="Last name" :placeholder="!firstName ? 'Nguyen Van' : ''" v-model="firstName" class="w-full"/>
          <vs-input label="Email" :placeholder="!email ? 'nguyenvana@gmail.com': ''" v-model="email" class="w-full"/>
          <vs-input :label="$t('sodienthoai')" :placeholder="!phone ? '0333123456': ''" v-model="phone" class="w-full"/>
          <vs-input v-if="id == -1 && !selectedAddRoleUser" label="Mã giới thiệu" :placeholder="!ref_code ? 'Mã giới thiệu sẽ được tạo tự động nếu không nhập': ''" v-model="ref_code" class="w-full"
                  @input="onInput"/>
          <div class="">
            <label for="" class="vs-input--label">{{ $t('vaitro') }} <span class="text-danger">*</span></label>
            <v-select v-model="role" :options="roleSelections" :reduce="role => role.value" label="label" class="w-full" />
          </div>
          <vs-button class="mt-4" @click="confirm">{{ $t('gui') }}</vs-button>
      </vs-popup>
    </template>
    <AccountDownLineList v-else :data="capduoiInfo" @close="isShowCapDuoiPopup = false"/>
     <!-- <vs-popup class="" title="Thông tin cấp dưới" :active.sync="isShowCapDuoiPopup">
        <template v-if="capduoiInfo">
          <p>Tổng nạp: {{ formatPrice((capduoiInfo.nap || {}).amount || 0) }}</p>
          <p>Tổng tổng rút: {{ formatPrice((capduoiInfo.rut || {}).amount || 0) }}</p>
          <p>Tổng Chơi: {{ formatPrice(capduoiInfo.bet.amount || 0) }}</p>
          <p>Tổng Thắng: {{ formatPrice(capduoiInfo.bet.win || 0) }}</p>
          <p>Tổng Thua: {{ formatPrice(capduoiInfo.bet.lose || 0) }}</p>

        </template>
        <template v-else>
          Vui lòng chờ trong giây lát
        </template>
     </vs-popup> -->
    <!-- <vs-popup title="Address Wallet" :active.sync="popupAdressWallet">
      <p>
          Address: {{ getAdress }} <feather-icon icon="CopyIcon" v-clipboard:copy="getAdress" v-clipboard:success="onCopy" class="cursor-pointer"></feather-icon><br>
          Private Key: {{ getPrivateKey }} <feather-icon icon="CopyIcon" v-clipboard:copy="getPrivateKey" v-clipboard:success="onCopy" class="cursor-pointer"></feather-icon><br>
          WFI BTC Address: {{ getWfiKey }} <feather-icon icon="CopyIcon" v-clipboard:copy="getWfiKey" v-clipboard:success="onCopy" class="cursor-pointer"></feather-icon>
      </p>
    </vs-popup> -->
  </div>
</template>

<script>
import DataViewSidebar from '@/layouts/account/slidebar/DataViewSidebar.vue'
import vSelect from 'vue-select'
import AuthenticationService from '@/services/AuthenticationService'
import AccountDownLineList from "./AccountDownLineList.vue"
import EditRole from "./EditRole.vue"
import Vue from 'vue'
import { checkRole } from "@/helpers/helpers.js"


async function delay(time){
  return new Promise((res)=>{
    setTimeout(() => {
      res()
    }, time);
  })

}
export default {
  components: {
    DataViewSidebar,
    AccountDownLineList,
    vSelect,
    EditRole,
  },
  data() {
    return {
      checkRole,
      getAdress: '',
      getPrivateKey: '',
      getWfiKey: '',
      popupAdressWallet: false,
      UserInfo: {},
      popupDeleteActive: false,
      fileName: "",
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      productsFake: [],
      tab: 'nv',
      itemsPerPage: 20,
      isMounted: false,
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      ref_code: "",
      sidebarData: {},
      isShowUserPopup: false,
      id: -1,
      selectedAddRoleUser: "",
      roleSelections: [
        {
          value: 'agency', label: this.$t('nhanvien')

        },
        {
           value: 'admin', label: this.$t('quantrivien'),
        }
      ],

      listAllusers: [],
      isShowCapDuoiPopup: false,
      capduoiInfo: null,
      userLoaded: false,
      userCount: 0
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
    onInput(e){
      this.ref_code = e.trim().replace(/\s/g, '').toUpperCase();
    },
    checkUsername(value){
        let reg = /^[a-zA-Z0-9\._@]{5,}$/
        return reg.test(value)
    },

    checkEmail(value){
        let reg = /\S+@\S+\.\S+/
        return reg.test(value)
    },

    checkRefCode(value){
      let reg = /^[A-Z0-9]*$/
      return reg.test(value)
    },

    confirm(){
      if(
        !this.username ||
        (!this.password && this.id == -1 && !this.selectedAddRoleUser)||
        !this.role
      )
      {
         return this.$vs.notify({
          text:'Vui lòng điền đầy đủ thông tin',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'});
      }

      if(!this.checkUsername(this.username)){
         return this.$vs.notify({
          text:'Tên đăng nhập chỉ bao gồm chứ cái IN HOA, in thường, chữ số và ký tự ".", "_", "@"',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'});
      }

      if(!!this.email && !this.checkEmail(this.email)){
         return this.$vs.notify({
          text:'Địa chỉ Email không hợp lệ',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'});
      }

      if(this.id == -1 && !!this.ref_code && !this.checkRefCode(this.ref_code)){
          return this.$vs.notify({
          text:'Mã giới thiệu chỉ bao gồm chữ IN HOA và chữ số.',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'});
      }

      const data = {
        username: this.username,
        password: this.password,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        ref_code: this.ref_code,
        role: this.role
      }

      if(this.id == -1 && !this.selectedAddRoleUser){
        this.addNewAccount(data)
      }
      else {
        data.id = this.id;
        if(this.selectedAddRoleUser){
          data.id = this.selectedAddRoleUser;
        }
        this.EditUser(data);
      }
    },

    addNewAccount(data){
       AuthenticationService.createAgency(data).then((res)=>{
          if(res.data.success == 1){
            this.productsFake.splice(0, 0, res.data.data);
            this.isShowUserPopup = false;
            return this.$vs.notify({
              text: 'Thêm mới nhân viên thành công!',
              color: 'success',
              iconPack: 'feather',
              position: 'top-center',
              icon: 'icon-check-circle'
            })
          }

          if(res.data.success == 2){
            this.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              position: 'top-center',
              icon: 'icon-check-circle'
            })
          }
        });
    },

    EditUser(data){
       AuthenticationService.updateAgency(data).then((res)=>{
          if(res.data.success == 1){
            const index = this.productsFake.findIndex( (el) => {
              return el.id == data.id
            })
            data.manage_supers = data.role == 'admin' ? 1: 0;
            delete data.role;
            if(index != -1){
               this.$set(this.productsFake, index, {...this.productsFake[index], ...data});
            }
            else{
              const userIndex = this.listAllusers.findIndex( (el) => {
                return el.id == data.id
              })
              this.$set(this.listAllusers, userIndex , {...this.listAllusers[userIndex], ...data});
              this.productsFake.splice(0, 0, this.listAllusers[userIndex]);
            }

            this.isShowUserPopup = false;
            this.$vs.notify({
              text: 'Cập nhật nhân viên thành công!',
              color: 'success',
              iconPack: 'feather',
              position: 'top-center',
              icon: 'icon-check-circle'
            })
          }

          if(res.data.success == 2){
            this.$vs.notify({
              text: 'Tên đăng nhập đã tồn tại',
              color: 'warning',
              iconPack: 'feather',
              position: 'top-center',
              icon: 'icon-check-circle'
            })
          }
        });
    },

    clickGetAddress(a, p, w){
        this.popupAdressWallet = true
        if(w != '') {
          this.getWfiKey = w
        }else{
          this.getWfiKey = 'N/A'
        }
        this.getAdress = a
        this.getPrivateKey = p
    },

    onCopy() {
          this.$vs.notify({
              text: 'Đã sao chép vào bộ nhớ',
              color: 'success',
              iconPack: 'feather',
              position: 'top-center',
              icon: 'icon-check-circle'
          })
      },

    openPopDelete(data){
      this.UserInfo = data
      this.popupDeleteActive = true
    },
    deleteUser(id, index) {

      AuthenticationService.deleteMember(id)
        .then((resp) => {
          if(resp.data.success){
              Vue.delete(this.productsFake, index)
              this.popupDeleteActive = false
              return this.$vs.notify({
                  text:'Đã xóa thành công',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'});
          }
        })
    },
    formatPrice(value, minimum) {
        var formatter = new Intl.NumberFormat('en-US', {
            //style: 'currency',
            //currency: '',
            minimumFractionDigits: minimum
        });
        return formatter.format(value);
    },

    addNewAccountPopup(){
      this.id = -1;
      this.username = "",
      this.password = "",
      this.firstName = "",
      this.lastName = "",
      this.email = "",
      this.phone = "",
      this.role  = "",
      this.isShowUserPopup = true;
      this.selectedAddRoleUser = "";
    },

    async loadUsers(){
      let check = true;
      while(check){
        try{
          const offset = this.listAllusers.length ? this.listAllusers.length - 1 : 0;

          const limit = 50;
          const params = {offset, limit}
          const res = await AuthenticationService.getAllMember(params);
          if(res.data.success == 1){
            this.userCount = res.data.data.count;
            const usersGet = res.data.data.items
            if(usersGet.length){
              this.listAllusers.push(...usersGet);
            }
            else{
              check = false;
              this.userLoaded = true;
            }
          }
        }catch(error){
          check = false;
          console.log(error)
        }
        await delay(500)
      }
    },


    editUserPopup(data) {
      this.id = data.id;
      this.username = data.username;
      this.firstName = data.first_name;
      this.lastName = data.last_name;
      this.email = data.email;
      this.phone = data.phone;
      this.ref_code = data.ref_code;
      this.role =  data.manage_supers == 1 ? 'admin' : 'agency';
      this.selectedAddRoleUser = "";
      this.isShowUserPopup = true;
    },

    onSelectUser(data){
      this.selectedAddRoleUser = data.id;
      // this.id = data.id;
      this.username = data.username;
      this.firstName = data.first_name;
      this.lastName = data.last_name;
      this.email = data.email;
      this.phone = data.phone;
    },

    getOrderStatusColor(status) {
      if(status == 0) return "warning"
      if(status == 1) return "success"
      //if(status == 2) return "danger"
      return "warning"
    },
    getOrderStatusColorText(status) {
      if(status == 0) return "Chưa bật"
      if(status == 1) return "Đã bật"
      //if(status == 2) return "danger"
      return "Chưa bật"
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

    openLoadingInDiv(){
            this.$vs.loading({
                container: '#loading-corners',
                type: 'corners',
                scale: 0.6
            })
    },

     toggleLockAccount(data) {
      if (data.isDisabled) {
        // Mở khóa TK
        AuthenticationService.enabledAccount(data.id)
          .then((resp) => {
            if(resp.data.success == 1){
              if(resp.data.data.affectedRows){
                  data.isDisabled = false;
                  return this.$vs.notify({
                  text:'Mở khóa TK thành công',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'});
              }
              else{
                return this.$vs.notify({
                  text:'Không thể mở khóa tài khoản này.',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'});
              }

            }else{
              localStorage.removeItem('token');
              this.$router.push('/pages/login').catch(() => {})
            }
          })
      } else {
        AuthenticationService.disabledAccount(data.id)
          .then((resp) => {
            if(resp.data.success == 1){
                 if(resp.data.data.affectedRows){
                    data.isDisabled = true;
                    return this.$vs.notify({
                      text:'Khóa TK thành công',
                      color:'success',
                      iconPack: 'feather',
                      icon:'icon-check'
                  });
              }
              else{
                return this.$vs.notify({
                  text:'Không thể khóa TK này.',
                  color:'danger',
                  iconPack: 'feather',
                  icon:'icon-check'});
              }

            }else{
              localStorage.removeItem('token');
              this.$router.push('/pages/login').catch(() => {})
            }
          })
      }
    },

    showPopupCapDuoi(user){
      this.capduoiInfo = null;

      let parms = {
        ref_code: user.ref_code,
        email: user.email
      }
      AuthenticationService.getCapDuoiInfo(parms).then(res=>{
        if(res.data.success == 1){
          this.capduoiInfo = res.data.data;
          this.capduoiInfo.user = user;
          this.isShowCapDuoiPopup = true;
        }
      });
    }
  },
  created() {

    let token = localStorage.getItem('token')
    this.$store.dispatch('setToken', token)

    AuthenticationService.getListAgency()
    .then((resp) => {

      this.$vs.loading.close('#loading-corners > .con-vs-loading');

      if(resp.data.success == 4){
          localStorage.removeItem('token');
          this.$router.push('/pages/login').catch(() => {})
      }else{
          this.productsFake = resp.data.data;
      }
    })
    if(this.checkRole('*')) {
      this.loadUsers();
    }


  },
  mounted() {
    this.isMounted = true;
    this.openLoadingInDiv();
  }
}
</script>

<style lang="scss">
#list-agency-account {
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
