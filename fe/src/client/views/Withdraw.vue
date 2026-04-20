<template>
  <div class="container">
    <div class="form-wrapper" v-if="checkBank">
      <div class="form-title">
        <p>THÔNG TIN SỐ DƯ</p>
      </div>
      <div class="member_form">
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
        <div class="input-group">
          <p class="style-2">VÍ ĐIỆN TỬ :</p>
          <input
            type="text"
            style="color: black; border-color: transparent"
            disabled=""
            :value="balance"
            class="input-2 credit"
          />
        </div>
      </div>
      <div class="form-title" style="margin-top: 30px">
        <p>RÚT TIỀN</p>
      </div>
      <div class="withdraw_form">
        <div id="bank" class="input-group">
          <p>TÊN NGÂN HÀNG :</p>
          <input
            readonly=""
            name="bank"
            class="bank"
            style="
              color: black;
              background-color: #e1e1e1;
              pointer-events: none;
            "
            type="text"
            :value="bankName"
          />
        </div>
        <div id="bank_branch" class="input-group">
          <p>CHI NHÁNH NGÂN HÀNG :</p>
          <input
            readonly=""
            name="bank_branch"
            class="bank_branch"
            style="
              color: black;
              background-color: #e1e1e1;
              pointer-events: none;
            "
            type="text"
            :value="bankBranch"
          />
        </div>
        <div id="bankAccount" class="input-group">
          <p>SỐ TÀI KHOẢN :</p>
          <input
            readonly=""
            name="bank_number"
            class="bank_number"
            style="
              color: black;
              background-color: #e1e1e1;
              pointer-events: none;
            "
            type="text"
            :value="bankNumber"
          />
        </div>

        <div id="bankAccount" class="input-group">
          <p>CHỦ TÀI KHOẢN :</p>
          <input
            readonly=""
            name="bank_number"
            class="bank_number"
            style="
              color: black;
              background-color: #e1e1e1;
              pointer-events: none;
            "
            type="text"
            :value="bankHolder"
          />
        </div>

        <div id="amount" class="input-group">
          <p>SỐ TIỀN :</p>
          <input
            type="number"
            class="amount"
            v-model.number="amount"
            style="color: black"
            placeholder="TỐI THIỂU 200,000 VND"
          />
        </div>
        <div id="saveChange">
          <button type="button" class="button" @click="withdraw">GỬI</button>
        </div>
      </div>
      <div class="warning">
        <h4>LƯU Ý:</h4>
        <p>Phí hệ thống xử lý rút lợi nhuận là 4%.</p>
        <p>
          Thành viên cập nhật thông tin ngân hàng phải trùng khớp với họ và tên
          thông tin ban đầu đăng ký.
        </p>
        <p>
          Để ngăn chặn hành vi gian lận , lừa đảo và đánh cắp mất tài khoản.
        </p>
        <p>
          Nếu bạn cần thay đổi thông tin vì lý do cần thiết, vui lòng liên hệ
          với nhân viên chăm sóc khách hàng trực tuyến.
        </p>
        <p>
          Nếu bạn sử dụng nền tảng này để thực hiện bất kỳ hành vi gian lận rửa
          tiền nào,
        </p>
        <p>
          công ty có quyền xem xét tài khoản thành viên hoặc chấm dứt vĩnh viễn
          các dịch vụ của thành viên mà không cần thông báo trước.
        </p>
      </div>
    </div>
    <div v-else class="form-wrapper">
      <div class="form-title">
        <p>THÊM TÀI KHOẢN NGÂN HÀNG</p>
      </div>
      <div class="bank_form">
        <div id="bankName" class="input-group">
          <p class="required">Tài Khoản Ngân Hàng:</p>
          <select v-model="bankName">
            <option value="" class="opacity-70" disabled>
              Chọn tên ngân hàng
            </option>
            <option value="ABBANK">ABBANK</option>
            <option value="ACB">ACB</option>
            <option value="Agribank">Agribank</option>
            <option value="Bac A Bank">Bac A Bank</option>
            <option value="BAOVIET Bank">BAOVIET Bank</option>
            <option value="BIDV">BIDV</option>
            <option value="DongA Bank">DongA Bank</option>
            <option value="Eximbank">Eximbank</option>
            <option value="GPBank">GPBank</option>
            <option value="HDBank">HDBank</option>
            <option value="Kienlongbank">Kienlongbank</option>
            <option value="LienVietPostBank">LienVietPostBank</option>
            <option value="MB Bank">MB Bank</option>
            <option value="MSB">MSB</option>
            <option value="Nam A Bank">Nam A Bank</option>
            <option value="NCB">NCB</option>
            <option value="OCB">OCB</option>
            <option value="OceanBank">OceanBank</option>
            <option value="PVcomBank">PVcomBank</option>
            <option value="Sacombank">Sacombank</option>
            <option value="SAIGONBANK">SAIGONBANK</option>
            <option value="SCB">SCB</option>
            <option value="SeABank">SeABank</option>
            <option value="SHB">SHB</option>
            <option value="ShihanBank">ShihanBank</option>
            <option value="Techcombank">Techcombank</option>
            <option value="TPBank">TPBank</option>
            <option value="VIB">VIB</option>
            <option value="Viet Capital Bank">Viet Capital Bank</option>
            <option value="VietABank">VietABank</option>
            <option value="VietBank">VietBank</option>
            <option value="Vietcombank">Vietcombank</option>
            <option value="VietinBank">VietinBank</option>
            <option value="VPBank">VPBank</option>
          </select>
        </div>
        <div class="input-group">
          <p class="required">Chi Nhánh:</p>
          <input v-model="bankBranch" style="color: black" type="text" />
        </div>
        <div id="bankAccount" class="input-group">
          <p class="required">Số Tài Khoản:</p>
          <input v-model="bankNumber" style="color: black" type="text" />
        </div>

        <div id="bankAccount" class="input-group">
          <p class="required">Chủ tài Tài Khoản :</p>
          <input v-model="bankHolder" style="color: black" type="text" />
        </div>

        <div class="input-group">
          <p>CMND Mặt Trước:</p>
          <input
            type="file"
            accept="image/jpeg,image/gif,image/png"
            required="required"
            ref="idFront"
            class="hidden"
            @change="onIdFrontChange"
          />
          <div class="flex">
            <button
              class="bg-[#34495e] text-white w-24 h-10 rounded-md mr-2"
              @click="$refs.idFront.click()"
            >
              {{ uploadIdFrontPercent || "Chọn File" }}
            </button>
            <img
              v-if="idFront"
              :src="idFrontImage"
              class="max-w-[100px] h-[50px]"
            />
          </div>
          <p>CMND Mặt Sau:</p>
          <input
            type="file"
            ref="idBack"
            class="hidden"
            accept="image/jpeg,image/gif,image/png"
            required="required"
            @change="onIdBackChange"
          />
          <div class="flex">
            <button
              class="bg-[#34495e] text-white w-24 h-10 rounded-md mr-2"
              @click="$refs.idBack.click()"
            >
              {{ uploadIdBackPercent || "Chọn File" }}
            </button>
            <img
              v-if="idBack"
              :src="idBackImage"
              class="max-w-[100px] h-[50px]"
            />
          </div>

          <!-- <p>Ảnh chân dung:</p>
          <input
            type="file"
            ref="avatar"
            class="hidden"
            accept="image/jpeg,image/gif,image/png"
            required="required"
            @change="onAvatarChange"
          />
          <div class="flex">
            <button
              class="bg-[#34495e] text-white w-24 h-10 rounded-md mr-2"
              disabled
              @click="$refs.avatar.click()"
            >
              {{ uploadAvatarPercent || "Chọn File" }}
            </button>
            <img
              v-if="avatar"
              :src="avatarImage"
              class="max-w-[100px] h-[50px]"
            />
          </div> -->
        </div>
        <span class="notice text-red-600"
          >Vui lòng chụp ảnh và up thông tin tài khoản chính xác, mặt trái của
          CMND và kèm ảnh chân dung để không ảnh hưởng đến quyền lợi cá nhân của bạn.</span
        >
        <div id="saveChange">
          <button type="button" class="button" @click="updateBankInfo">
            Gửi
          </button>
        </div>
      </div>
      <div class="warning">
        <h4>LƯU Ý:</h4>
        <p>Phí hệ thống xử lý rút lợi nhuận là 4%.</p>
        <p>
          Thành viên cập nhật thông tin ngân hàng phải trùng khớp với họ và tên
          thông tin ban đầu đăng ký.
        </p>
        <p>
          Để ngăn chặn hành vi gian lận , lừa đảo và đánh cắp mất tài khoản.
        </p>
        <p>
          Nếu bạn cần thay đổi thông tin vì lý do cần thiết, vui lòng liên hệ
          với nhân viên chăm sóc khách hàng trực tuyến.
        </p>
        <p>
          Nếu bạn sử dụng nền tảng này để thực hiện bất kỳ hành vi gian lận rửa
          tiền nào,
        </p>
        <p>
          công ty có quyền xem xét tài khoản thành viên hoặc chấm dứt vĩnh viễn
          các dịch vụ của thành viên mà không cần thông báo trước.
        </p>
      </div>
    </div>

    <modal
      :title="message"
      :active="isShowMessage"
      @close="isShowMessage = false"
      :closed="notifyClosed"
    />
  </div>
</template>

<script>
import {
  withdrawal as apiWithdraw,
  uploadAvatar,
  uploadPassportFront,
  uploadPassportBack,
  updateBankInfo as apiUpdateBankInfo,
  getBankInfo,
} from "@/client/api/userApi";
import Modal from "@/client/components/Modal.vue";
import helper from "@/client/helper";

export default {
  components: {
    Modal,
  },

  data() {
    return {
      amount: 0,
      message: "",
      isShowMessage: false,
      checkBank: false,
      bankBranch: "",
      bankNumber: "",
      bankName: "",
      bankHolder: "",
      idFront: null,
      idBack: null,
      avatar: null,

      notifyClosed: null,
      uploadIdFrontPercent: 0,
      uploadIdBackPercent: 0,
      uploadAvatarPercent: 0,
    };
  },

  computed: {
    balance() {
      return helper.formatPrice(this.$store.state.userInfo.balance, 0) + " VNĐ";
    },
    idFrontImage() {
      return URL.createObjectURL(this.idFront);
    },

    idBackImage() {
      return URL.createObjectURL(this.idBack);
    },

    avatarImage() {
      return URL.createObjectURL(this.avatar);
    },
  },
  methods: {
    onAvatarChange(e) {
      // this.idFront = e.target.files[0];
      var data = new FormData();
      data.append("image", e.target.files[0]);
      uploadAvatar(data, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          this.uploadAvatarPercent = ((loaded / total) * 100).toFixed(0) + "%";
        },
        timeout: 0,
      })
        .then((res) => {
          this.uploadAvatarPercent = 0;
          if (res.success == 1) {
            this.avatar = e.target.files[0];
          }
        })
        .catch((error) => {
          this.uploadAvatarPercent = 0;
        });
    },
    onIdFrontChange(e) {
      // this.idFront = e.target.files[0];
      var data = new FormData();
      data.append("image", e.target.files[0]);
      uploadPassportFront(data, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          this.uploadIdFrontPercent = ((loaded / total) * 100).toFixed(0) + "%";
        },
        timeout: 0,
      })
        .then((res) => {
          this.uploadIdFrontPercent = 0;
          if (res.success == 1) {
            this.idFront = e.target.files[0];
          }
        })
        .catch((error) => {
          this.uploadIdFrontPercent = 0;
        });
    },
    onIdBackChange(e) {
      // this.idBack = e.target.files[0];
      var data = new FormData();
      data.append("image", e.target.files[0]);
      uploadPassportBack(data, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          this.uploadIdBackPercent = ((loaded / total) * 100).toFixed(0) + "%";
        },
        timeout: 0,
      })
        .then((res) => {
          this.uploadIdBackPercent = 0;
          if (res.success == 1) {
            this.idBack = e.target.files[0];
          }
        })
        .catch((error) => {
          this.uploadIdBackPercent = 0;
        });
    },

    async updateBankInfo() {
      if (!this.bankName) {
        this.message = "Vui lòng chọn một ngân hàng";
        this.isShowMessage = true;
        return;
      }

      if (!this.bankBranch) {
        this.message = "Vui lòng nhập Chi nhánh ngân hàng";
        this.isShowMessage = true;
        return;
      }

      if (!this.bankNumber) {
        this.message = "Vui lòng nhập Số tài khoản ngân hàng";
        this.isShowMessage = true;
        return;
      }

      if (!this.bankHolder) {
        this.message = "Vui lòng nhập Tên chủ tài khoản ngân hàng";
        this.isShowMessage = true;
        return;
      }

      // if (!this.idFront) {
      //   this.message = "Vui lòng chọn Ảnh CMND mặt trước";
      //   this.isShowMessage = true;
      //   return;
      // }

      // if (!this.idBack) {
      //   this.message = "Vui lòng chọn Ảnh CMND măt sau";
      //   this.isShowMessage = true;
      //   return;
      // }

      //   if (!this.avatar) {
      //   this.message = "Vui lòng chọn Ảnh chân dung";
      //   this.isShowMessage = true;
      //   return;
      // }


      // const formDataFront = new FormData();
      // formDataFront.append("image", this.idFront);
      // const idFrontRes = await uploadPassportFront(formDataFront``);
      // console.log(idFrontRes);

      // const formDataBack = new FormData();
      // formDataBack.append("image", this.idBack);
      // const idBackRes = await uploadPassportFront(formDataFront);
      // console.log(idBackRes);
      const bank = {
        name: this.bankName,
        branch: this.bankBranch,
        number: this.bankNumber,
        holder: this.bankHolder,
      };

      apiUpdateBankInfo(bank).then((res) => {
        if (res.success == 1) {
          this.message = "Cập nhật thành công!";
          this.isShowMessage = true;
          this.checkBank = true;
          return;
        }
      });
    },

    withdraw() {
      const checkBalance =
        Number(this.$store.state.userInfo.balance) >= this.amount;

      if (this.amount <= 0) {
        this.message = "Số tiền không hợp lệ";
        this.isShowMessage = true;
        return;
      }

      if (!checkBalance) {
        this.message = "Số dư không đủ";
        this.isShowMessage = true;
        return;
      }

      apiWithdraw({ amount: this.amount }).then((res) => {
        if (res.success == 1) {
          const balance =
            Number(this.$store.state.userInfo.balance) - this.amount;
          this.$store.dispatch("updateUserInfo", { balance });
          this.message =
            "Gửi yêu cầu rút tiền thành công. Vui lòng chờ quản trị viên xác thực.";
          this.isShowMessage = true;
          this.notifyClosed = () => {
            this.$router.push("/transaction-history/withdraw");
          };
        } else if (res.success == 0) {
          this.message = "Số dư không đủ";
          this.isShowMessage = true;
          return;
        } else if (res.success == 2) {
          this.message = "Vui lòng cập nhật lại thông tin cá nhân.";
          this.isShowMessage = true;
          this.checkBank = false;
          return;
        }
      });
    },
  },

  created() {
    getBankInfo().then((res) => {
      if (res.success == 1) {
        if (res.data.bank) {
          const bank = res.data.bank.split("|");
          if (bank.length == 4) {
            this.bankName = bank[0];
            this.bankBranch = bank[1];
            this.bankNumber = bank[2];
            this.bankHolder = bank[3];
          }
        }

        this.checkBank = res.data.verified || false;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/form";
@import "@/assets/client/scss/responsive";
</style>