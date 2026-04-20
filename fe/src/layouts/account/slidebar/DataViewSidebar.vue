<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Đức Nguyễn
  Author Telegram:  @skydnz
========================================================================================== -->


<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <h4>{{ $t('CẬP NHẬT TÀI KHOẢN') }}</h4>
        <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar style="height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 10px);" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">

        <!-- Product Image -->
        <template v-if="dataImg">

          <!-- Image Container -->
        <div class="img-container w-64 mx-auto flex items-center justify-center">
          <img :src="`${dm}api/auth/me/photo/${dataImg}`" width="100" alt="img">
        </div>
        </template>
        <vs-input :label="$t('Họ và Tên')" v-model="dataName" class="mt-5 w-full" />
        <vs-input :label="$t('Số CMND')"  v-model="dataIdNumber" class="mt-5 w-full"/>
        <vs-input :label="$t('Số điện thoại')"  v-model="dataPhone" class="mt-5 w-full"/>
        <vs-input :label="$t('Tên chủ tài khoản')" v-model="dataBankHolder" class="mt-5 w-full" />
        <vs-input :label="$t('Số tài khoản')" v-model="dataBankNumber" class="mt-5 w-full" />
        <div class="select-wrapper mt-5 w-full" >
          <label>{{ $t('Tên ngân hàng') }}</label>
          <v-select v-model="dataBankName" :options="bankList.map((item)=>{
              return {...item, label: `${item.fullname} (${item.bank})`}
            })" :reduce="bank => bank.bank" label="label" class="w-full" />

        </div>
        <vs-input :label="$t('Chi nhánh')" v-model="dataBankBranch" class="mt-5 w-full" />
        <vs-input :label="$t('Mật khẩu')" v-model="dataPassword" class="mt-5 w-full" />
        <template v-if="superUser == 1">
            <p class="mt-2">Bạn không thể sửa Quyền của chính bạn</p>
        </template>
        <div class="flex flex-wrap items-center p-6" slot="footer">
          <vs-button class="mr-6" @click="submitDataUpdateUser" :disabled="!isFormValid">OK</vs-button>
          <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancel</vs-button>
        </div>

      </div>


    </VuePerfectScrollbar>

  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import AuthenticationService from '@/services/AuthenticationService'
import config from '@/config.json';
import vSelect from 'vue-select'

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {},
    }
  },
  watch: {
    isSidebarActive(val) {
      if(!val) return
      let { id, last_name, bank, phone, so_cmnd, profile_image } = JSON.parse(JSON.stringify(this.data))
      this.dataId = id
      // this.dataName = email
      this.dataName = last_name
      this.dataImg = profile_image
      this.dataPassword = "";
      try{
        const bankData = bank.split("|");
        this.dataBankName = bankData[0];
        this.dataBankBranch = bankData[1];
        this.dataBankNumber = bankData[2];
        this.dataBankHolder = bankData[3];
      }catch(err){

      }
      this.dataPhone = phone;
      this.dataIdNumber = so_cmnd;
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  data() {
    return {
        dm: config.domain,
        superUser: 0,
        dataId: null,
        dataName: '',
        dataPhone: '',
        dataIdNumber: '',
        dataBankHolder: '',
        dataBankName: '',
        dataBankNumber: '',
        dataBankBranch: '',
        dataPassword: '',
        dataImg: null,
        dataPermission: 0,
        isLevelVIP: 0,
        settings: { // perfectscrollbar settings
            maxScrollbarLength: 60,
            wheelSpeed: .60,
        },

        bankList:[
          { bank: "ACB", fullname: "NH TMCP Á Châu"},
          { bank: "ABBANK", fullname: "NH TMCP An Bình"},
          { bank: "AGRIBANK", fullname: "NH NN&PT NT"},
          { bank: "BIDV", fullname: "NH TMCP Đầu tư & Phát triển VN"},
          { bank: "MUFG", fullname: "NH TOKYO - MITSUBISHI"},
          { bank: "BNP", fullname: "BNP PARIBAS BANK"},
          { bank: "BVB", fullname: "NH TMCP Bảo Việt"},
          { bank: "BACABANK", fullname: "NH TMCP Bắc Á"},
          { bank: "CIMB", fullname: "NH TNHH MTV CIMB"},
          { bank: "CITI BANK", fullname: "NH CITI BANK"},
          { bank: "COOPBANK", fullname: "NH Hợp tác xã Việt Nam"},
          { bank: "DONGABANK", fullname: "NH TMCP Đông Á"},
          { bank: "EXIMBANK", fullname: "NH TMCP Xuất Nhập Khẩu"},
          { bank: "GPBANK", fullname: "NH TM TNHH MTV Dầu Khí Toàn Cầu"},
          { bank: "HABUBANK", fullname: "NH TMCP Nhà Hà Nội"},
          { bank: "HDBANK", fullname: "NH TMCP Phát Triển TP. HCM"},
          { bank: "HLB", fullname: "NH TNHH MTV HONGLEONG VIET NAM"},
          { bank: "HSBC", fullname: "NH TNHH MTV HSBC (Viet Nam)"},
          { bank: "IBK", fullname: "NH IBK"},
          { bank: "ICBC", fullname: "NH INDUSTRIAL AND COMMERCIAL BANK OF CHINA"},
          { bank: "IVB", fullname: "NH TNHH INDOVINA"},
          { bank: "KB", fullname: "NH KOOMIN"},
          { bank: "KEB Hana", fullname: "NH KEB Hana"},
          { bank: "KLB", fullname: "NH TMCP KIÊN LONG"},
          { bank: "LPB", fullname: "NH TMCP Bưu Điện Liên Việt"},
          { bank: "MAYBANK", fullname: "NH MALAYAN BANKING BERHAD"},
          { bank: "MSB", fullname: "NH TMCP HÀNG HẢI"},
          { bank: "MB", fullname: "NH TMCP QUÂN ĐỘI"},
          { bank: "MHB", fullname: "NH Phát triển nhà Đồng bằng sông Cửu Long"},
          { bank: "Mizuho", fullname: "NH Mizuho"},
          { bank: "NAMABANK", fullname: "NH TMCP NAM Á"},
          { bank: "NCB", fullname: "NH TMCP QUỐC DÂN"},
          { bank: "BIDC", fullname: "NH DT & PT Campuchia"},
          { bank: "LAOVIETBANK", fullname: "NH Liên Doanh Lào - Việt"},
          { bank: "CB", fullname: "NH TMCP Xây Dựng Việt Nam"},
          { bank: "ANZ", fullname: "NH TNHH ANZ VIET NAM"},
          { bank: "OCB", fullname: "NH TMCP PHƯƠNG DÔNG"},
          { bank: "OCEANBANK", fullname: "NH TMCP ĐẠI DƯƠNG"},
          { bank: "PBVN", fullname: "NH TNHH MTV PUBLIC VIETNAM"},
          { bank: "PGBANK", fullname: "TN TMCP XĂNG DẦU PETROLIMEX"},
          { bank: "PVCOMBANK", fullname: "NH TMCP ĐẠI CHÚNG VIỆT NAM"},
          { bank: "SACOMBANK", fullname: "NH TMCP SÀI GÒN THƯƠNG TÍN"},
          { bank: "SAIGONBANK", fullname: "NH TMCP SÀI GÒN CÔNG THƯƠNG"},
          { bank: "SCB", fullname: "NH TMCP SÀI GÒN"},
          { bank: "SEABANK", fullname: "NH TMCP ĐÔNG NAM Á"},
          { bank: "SHB", fullname: "NH TMCP SAI GON - HA NOI"},
          { bank: "SHINHANBANK", fullname: "SHBVN - NH TNHH MTV SHINHAN VN"},
          { bank: "TECHCOMBANK", fullname: "NH TMCP KỸ THƯƠNG VIỆT NAM"},
          { bank: "SIAM BANK", fullname: "THE SIAM COMMERCIAL BANK PUBLIC"},
          { bank: "STANDARD CHARTERED", fullname: "NH TNHH MTV Standard Chatered Bank VN"},
          { bank: "TPBANK", fullname: "NH TMCP TIÊN PHONG"},
          { bank: "UOB", fullname: "NH TNHH MTV UNITED OVERSEAS BANK"},
          { bank: "VIETCOMBANK", fullname: "NH TMCP NGOẠI THƯƠNG"},
          { bank: "VIETINBANK", fullname: "NH TMCP CÔNG THƯƠNG"},
          { bank: "VPBANK", fullname: "NH TMCP VIỆT NAM THỊNH VƯỢNG"},
          { bank: "VAB", fullname: "NH TMCP VIỆT Á"},
          { bank: "VPSB", fullname: "NH CHÍNH SÁCH XÃ HỘI"},
          { bank: "VDB", fullname: "NH PHÁT TRIỂN VIỆT NAM"},
          { bank: "VIB", fullname: "NH TMCP QUỐC TẾ VIỆT NAM"},
          { bank: "VIETCAPITAL BANK", fullname: "NH TMCP BẢN VIỆT"},
          { bank: "VIETBANK", fullname: "NH TMCP VIỆT NAM THƯƠNG TÍN"},
          { bank: "VRB", fullname: "NH LIÊN DOANH VIỆT NGA"},
          { bank: "WOO", fullname: "WOORI BANK"},
        ]
    }
  },

  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive
      },
      set(val) {
        if(!val) {
          this.$emit('closeSidebar')

        }
      }
    },
    isFormValid() {
      return !!this.dataName
    }
  },
  methods: {
    formatPrice(value, minimum) {
        var formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minimum
        });
        return formatter.format(value);
    },
    initValues() {
      if(this.data.id) return
        this.dataId = null
    },

    submitDataUpdateUser() {
      this.$validator.validateAll().then(result => {
        if (result) {
            const obj = {
              id: this.dataId,
              name: this.dataName,
              bankName: this.dataBankName,
              bankBranch: this.dataBankBranch,
              bankHolder: this.dataBankHolder,
              bankNumber: this.dataBankNumber,
              phone: this.dataPhone,
              idNumber: this.dataIdNumber,
            }
            if(this.dataPassword){
              obj.password = this.dataPassword;
            }
              AuthenticationService.updateMember(obj)
              .then((resp) => {
                if(resp.data.success == 1){
                  const bank = `${obj.bankName}|${obj.bankBranch}|${obj.bankNumber}|${obj.bankHolder}`
                  this.$emit("user-updated", {
                    id: obj.id,
                    bank: bank,
                    last_name: obj.name,
                    so_cmnd: obj.idNumber,
                    phone: obj.phone
                  })
                  return this.$vs.notify({
                      text:'Đã cập nhập thông tin thành công cho' + this.data.username,
                      color:'success',
                      iconPack: 'feather',
                      icon:'icon-check'});
                  }else{
                    return this.$vs.notify({
                      text: resp.data.message,
                      color:'danger',
                      iconPack: 'feather',
                      icon:'icon-alert-circle'});
                  }
              })


        }

      })
    },
    updateCurrImg(input) {
      if (input.target.files && input.target.files[0]) {
        var reader = new FileReader()
        reader.onload = e => {
          this.dataImg = e.target.result
        }
        reader.readAsDataURL(input.target.files[0])
      }
    }
  },
  components: {
    VuePerfectScrollbar,
    vSelect
  }
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
    // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
}
.select-wrapper{
  select{
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.7);;
    padding: 0.7rem;
    height: 40px;
  }
}
</style>
