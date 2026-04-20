<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <h4>Phê duyệt nạp tiền</h4>
        <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar style="height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 10px);" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">
        <div>
          <h5>Thông tin nạp tiền <b>{{ currentUser.from_u }}</b></h5>
          <div>---</div>
          <div><b>Số điện thoại:</b> {{ currentUser.email }}</div>
          <div><b>Số tiền:</b> {{ nFormatter(currentUser.amount, 2) }}</div>
          <div><b>Nội dung chuyển khoản:</b> {{ currentUser.email }}</div>
          <div><b>Thời gian yêu cầu nạp tiền:</b> {{ formatDate(currentUser.created_at) }}</div>
        </div>
        
        <div>---</div>
        <vs-input label="Lý do" v-model="currentUser.note" class="mt-5 mb-5 w-full" type="text" name="item-email" />
        <vs-button type="border" class="mr-6" color="danger" @click="submitDataUpdateMoney(-1)">Từ chối</vs-button>
        <vs-button color="success" @click="submitDataUpdateMoney(1)">Chấp nhận</vs-button>
      </div>
    </VuePerfectScrollbar>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import moment from 'moment';
// import AuthenticationService from '@/services/AuthenticationService'
import DepositService from "@/services/DepositService"
export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    currentDataMoney: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      currentUser: {
        id: 0,
        amount: 0,
        real_amount: 0,
        create_at: '',
        email: '',
        from_u: '',
        note: '',
        status: 0,
        bank: '',
      },
      settings: { // perfectscrollbar settings
          maxScrollbarLength: 60,
          wheelSpeed: .60,
      },
    }
  },
  watch: {
    isSidebarActive(val) {
      if(!val) return
      let {
        amount,
        created_at,
        email,
        from_u,
        real_amount,
        id,
        note,
        bank,
      } = JSON.parse(JSON.stringify(this.currentDataMoney));
      this.currentUser.id = id;
      this.currentUser.amount = amount;
      this.currentUser.real_amount = real_amount;
      this.currentUser.created_at = created_at;
      this.currentUser.email = email;
      this.currentUser.from_u = from_u;
      this.currentUser.note = note;
      this.currentUser.bank = bank;
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive
      },
      set(val) {
        if(!val) {
          this.$emit('closeSidebar', {
            isEdit: true,
            id: this.currentUser.id,
            status: this.currentUser.status,
            note: this.currentUser.note,
          })
        }
      }
    },
  },
  methods: {
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
    formatDate(value){
      if (value) {
          return moment(String(value)).format('MM/DD/YYYY hh:mm:ss')
      }
    },
    submitDataUpdateMoney(status){
      const obj = {
        status,
        id: this.currentUser.id,
        note: this.currentUser.note,
        email: this.currentUser.email,
        amount: this.currentUser.amount,
      }

      this.currentUser.status = status;

        DepositService.handleMoney(obj)
        .then((resp) => {
          this.isSidebarActiveLocal = false;
          if(resp.data.success == 1){

            return this.$vs.notify({
                text: `${status === 1 ? 'Chấp nhận': 'Từ chối'} nạp tiền ${this.currentDataMoney.from_u} thành công!`,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'});
            }else{
              if(!resp.data.l){
                return this.$vs.notify({
                  text: 'Thời gian đăng nhập đã hết, vui lòng đăng nhập lại để sử dụng',
                  color:'danger',
                  iconPack: 'feather',
                  icon:'icon-alert-circle'});
              }
              return this.$vs.notify({
                text: resp.data.message,
                color:'danger',
                iconPack: 'feather',
                icon:'icon-alert-circle'});
            }
        })
    },
  },
  components: {
    VuePerfectScrollbar,
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
</style>
