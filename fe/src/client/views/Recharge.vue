<template>
  <div class="container">
    <div class="form-wrapper">
      <div class="form-title">
        <p>NẠP TIỀN</p>
      </div>

      <div class="input-group">
        <p class="style-2">TÀI KHOẢN ĐĂNG NHẬP :</p>

        <input
          type="text"
          style="color: black; border-color: transparent"
          disabled=""
          :value="$store.state.userInfo.username"
          class="input-2 name"
        />
      </div>

      <div class="input-group input-group-2">
        <p class="style-2">VÍ ĐIỆN TỬ :</p>

        <input
          type="text"
          style="color: black; border-color: transparent"
          disabled=""
          :value="balance"
          class="input-2 credit"
        />
      </div>

      <div class="form-title mt-4"><p>CHỌN PHƯƠNG THỨC NẠP TIỀN</p></div>
      <div id="choosesolu">
        <div class="input-group">
          <div class="sumitonly">
            <select name="recharge_method">
              <option value="1">CHUYỂN KHOẢN</option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <div class="sumitonly">
            <p>CHỌN TÀI KHOẢN:</p>
            <select v-model="bankSelected">
              <option v-for="(bank, index) in bankList" :value="index" :key="index">{{ bank.name }} - {{ bank.number }}</option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <p>MỤC TIÊU LƯU TRỮ</p>

          <select name="recharge_target">
            <option value="1">VÍ ĐIỆN TỬ</option>
          </select>
        </div>

        <div class="input-group">
          <p>NHẬP SỐ TIỀN</p>

          <input
            type="number"
            name="amount"
            style="color: black"
            placeholder="TỐI THIỂU 500,000 VND"
            v-model.number="amount"
          />
        </div>

        <div class="input-group need-confirm" style="display: none">
          <button id="recharge-submit" type="submit" class="submit">
            Send
          </button>
        </div>
      </div>

      <div id="spoil">
        <button
          id="recharge-button"
          type="button"
          class="button"
          @click="rechargeValidate"
        >
          XÁC NHẬN
        </button>
      </div>
      <div class="warning">
        <h4>LƯU Ý:</h4>
        <p>
          Cùng một tài khoản / địa chỉ gia đình / hộ gia đình / điện thoại / địa
          chỉ IP / máy tính dùng chung / môi trường mạng được coi là cùng một
          thành viên.
        </p>
        <p>Nếu truy vấn được nhiều tài khoản và cùng một IP không rõ ràng</p>
        <p>, đó sẽ bị coi là tài khoản lừa đảo toàn quyền xử lý.</p>
        <p>
          Số điểm đăng ký cần phải trên 300.000 điểm, vui lòng xác nhận số tài
          khoản, nếu số tài khoản cung cấp sai, công ty chúng tôi không chịu
          trách nhiệm.
        </p>
        <p>
          Sau khi thành viên điền số tài khoản lần đầu tiên sẽ bị ràng buộc vĩnh
          viễn không có bất kỳ sự thay đổi nào.
        </p>
        <p>
          Cá cược hợp lệ không bao gồm cá cược song phương lẫn nhau và bộ phận
          kiểm soát rủi ro của công ty sẽ xem xét lại. Vui lòng không vi phạm
          các nội quy và quy định rút tiền đối với các hoạt động cá nhân.
        </p>
        <p>
          Nếu bạn sử dụng nền tảng này để thực hiện bất kỳ hành vi gian lận rửa
          tiền nào, công ty có quyền xem xét tài khoản thành viên hoặc chấm dứt
          vĩnh viễn các dịch vụ của thành viên mà không cần thông báo trước.
        </p>
      </div>
    </div>

    <modal
      :active="isShowNofity"
      :title="notifyTitle"
      @close="isShowNofity = false"
      :closed="notifyClosed"
    />

    <div
      id="recharge-modal"
      class="modal"
      v-if="isShowRechargeInfo"
      @click.self="isShowRechargeInfo = false"
    >
      <!-- Modal content -->
      <div class="modal-content">
        <span class="close" @click="isShowRechargeInfo = false">×</span>
        <h2 class="font-bold text-2xl">Thông tin nạp tiền</h2>

        <div class="d-flex flex-wrap">
          <div class="item_bank">
            <div>
              <p class="title-bank">
                Tên ngân hàng: <span class="value">{{ bankInfo.name }}</span>
              </p>
              <copy-tooltip :value="bankInfo.name" message="Copied">
                <span class="copy">Copy</span>
              </copy-tooltip>
            </div>
            <div>
              <p class="name-account">
                Chủ tài khoản : <span class="value">{{ bankInfo.holder }}</span>
              </p>
              <copy-tooltip :value="bankInfo.holder" message="Copied">
                <span class="copy" data-text="Copied">Copy</span>
              </copy-tooltip>
            </div>
            <div>
              <p class="sotk">
                Số tài khoản : <span class="value">{{ bankInfo.number }}</span>
              </p>
              <copy-tooltip :value="bankInfo.number" message="Copied">
                <span class="copy" data-text="Copied">Copy</span>
              </copy-tooltip>
            </div>
            <div>
              <p class="sotien">
                Số tiền :
                <span id="cf-amount" class="value">{{
                  formatPrice(amount, 0)
                }}</span>
                VND
              </p>
              <copy-tooltip :value="amount" message="Copied">
                <span class="copy">Copy</span>
              </copy-tooltip>
            </div>
            <div class="note">
              <div class="note__">
                Ghi chú:
                <span class="value"
                  >Nội Dung Chuyển Khoản : Tên ID Khách Hàng</span
                >
              </div>
              <span class="copy" data-text="Copied">Copy</span>
            </div>
          </div>

          <div id="saveChange" class="input-group">
            <button
              type="submit"
              class="button bg-primary text-white rounded-md px-4 py-3 w-full"
              @click="recharge"
            >
              GỬI LỆNH
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "@/client/components/Modal.vue";
import { recharge as apiRecharge, getBankNapInfo } from "@/client/api/userApi";
import helper from "@/client/helper";

import CopyTooltip from "@/client/components/CopyTooltip.vue";

export default {
  components: {
    Modal,
    CopyTooltip,
  },
  computed: {
    balance() {
      return helper.formatPrice(this.$store.state.userInfo.balance, 0) + " VNĐ";
    },

    bankInfo() {
      return this.bankList[this.bankSelected] || {};
    },
  },
  data() {
    return {
      amount: 0,
      notifyTitle: "",
      isShowNofity: false,
      isShowRechargeInfo: false,
      notifyClosed: null,
      bankSelected: 0,
      bankList: [],
      formatPrice: helper.formatPrice,
    };
  },
  methods: {
    rechargeValidate() {
      if (!this.amount) {
        this.notifyTitle = "Vui lòng nhập số tiền nạp";
        this.isShowNofity = true;
        return;
      }

      if (this.amount < 0) {
        this.notifyTitle = "Số tiền không hợp lệ";
        this.isShowNofity = true;
        return;
      }

      this.isShowRechargeInfo = true;
    },

    recharge() {
      const data = {
        a: this.amount,
        bank: this.bankInfo.name,
        holder: this.bankInfo.holder,
        number: this.bankInfo.number,
      };

      apiRecharge(data).then((res) => {
        if (res.success == 1) {
          this.notifyTitle =
            "Gửi yêu cầu nạp tiền thành công. Vui lòng chờ quản trị viên xác thực.";
          this.notifyClosed = () => {
            this.$router.push("/transaction-history/recharge");
          };
          this.isShowNofity = true;
        }
      });
    },
  },

  created() {
    getBankNapInfo().then((res) => {
      if (res.success == 1) {
        this.bankList = res.data;
        // this.bankInfo = res.data;
      }
    });
  },
};
</script>


<style lang="scss" scoped>
@import "@/assets/client/scss/form";
@import "@/assets/client/scss/responsive";

#recharge-modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);

  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 60%;
    @include max-sm {
      width: 90%;
    }
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s color;
    &:hover {
      color: #575757;
    }
  }
  .item_bank {
    & > div {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;

      span {
        font-size: 15px;
        color: #ad0000;
        letter-spacing: 1px;
      }
    }
    .copy {
      background: #575757;
      color: #fff;
      border-radius: 5px;
      padding: 5px 7px;
      display: inline-block;
      cursor: pointer;
      position: relative;
      z-index: 1;
    }
  }
}
</style>
