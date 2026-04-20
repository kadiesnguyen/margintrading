<template>
  <div class="container">
    <div class="form-wrapper">
      <div class="form-title">
        <p>ĐỔI MẬT KHẨU</p>
      </div>
      <div id="typeAccount" class="input-group">
        <p>TÀI KHOẢN ĐĂNG NHẬP</p>
        <input
          type="text"
          style="color: black"
          disabled=""
          :value="$store.state.userInfo.username"
          class="name"
        />
      </div>
      <div id="password" class="input-group">
        <p>*MẬT KHẨU HIỆN TẠI</p>
        <input
          name="current_password"
          type="password"
          style="color: black"
          maxlength="30"
          required=""
          placeholder="*MẬT KHẨU HIỆN TẠI"
          v-model="oldPassword"
        />
      </div>
      <div id="password" class="input-group">
        <p>*MẬT KHẨU MỚI</p>
        <input
          name="password"
          type="password"
          style="color: black"
          maxlength="30"
          required=""
          placeholder="MẬT KHẨU MỚI"
          v-model="newPassword"
        />
      </div>
      <div id="check" class="input-group">
        <p>* XÁC NHẬN MẬT KHẨU MỚI</p>
        <input
          name="password_confirmation"
          style="color: black"
          maxlength="30"
          type="password"
          required=""
          placeholder="XÁC NHẬN MẬT KHẨU MỚI"
          v-model="newPasswordConfirm"
        />
      </div>
      <div id="saveChange">
        <button type="button" class="button" @click="savePassword">LƯU</button>
      </div>
      <div class="warning">
        <h4>LƯU Ý:</h4>
        <p>
          TRONG TRƯỜNG HỢP KHÔNG THỂ THAY ĐỔI THÔNG TIN, QUÝ KHÁCH VUI LÒNG LIÊN
          HỆ VỚI NHÂN VIÊN CHĂM SÓC KHÁCH HÀNG!
        </p>
      </div>
    </div>
    <modal
      :title="messsage"
      :active="isShowModal"
      @close="isShowModal = false"
      :closed="closed"
    />
  </div>
</template>

<script>
import Modal from "@/client/components/Modal.vue";
import { changePassword as apiChangePassword } from "@/client/api/userApi";
export default {
  components: {
    Modal,
  },

  data() {
    return {
      isShowModal: false,
      messsage: "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      closed: null
    };
  },

  methods: {
    savePassword() {
      if (!this.oldPassword) {
        this.messsage = "Vui lòng nhập Mật khẩu hiện tại";
        this.isShowModal = true;
        return;
      }

      if (!this.newPassword) {
        this.messsage = "Vui lòng nhập Mật khẩu mới";
        this.isShowModal = true;
        return;
      }

      if (!this.newPasswordConfirm) {
        this.messsage = "Vui lòng nhập Xác nhận mật khẩu mới";
        this.isShowModal = true;
        return;
      }

      if (this.newPassword !== this.newPasswordConfirm) {
        this.messsage = "  Mật khẩu và mật xác nhận lại phải giống nhau";
        this.isShowModal = true;
        return;
      }
      const changePasswordData = {
        password: this.oldPassword,
        newPassword: this.newPassword,
      };
      apiChangePassword(changePasswordData)
        .then((res) => {
          if (res.success == 0) {
            this.messsage = "Mật khẩu không chính xác. Vui lòng nhập lại.";
            this.isShowModal = true;
            return;
          }

           if (res.success == 3) {
            this.messsage = "Lỗi cập nhật mật khẩu.";
            this.isShowModal = true;
            return;
          }

          if (res.success == 1) {
            this.messsage = "Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại";
            this.isShowModal = true;
            this.$store.dispatch("logout");
            this.closed = () => {
              this.$router.push("/login");
            }
            // 
            return;
          }
        })
        .finally(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/form";
@import "@/assets/client/scss/responsive";
</style>
