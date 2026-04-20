<template>
  <div class="w-full">
    <form @submit.prevent>
      <div class="py-2">
        <label for="" class="mb-2 inline-block">HỌ TÊN THẬT</label>
        <input
          type="text"
          class="
            w-full
            h-8
            2xl:h-10
            px-2
            bg-gray-300
            rounded-md
            border-none
            focus:outline-1 focus:outline-yellow-400
          "
          placeholder="HỌ TÊN THẬT"
          v-model="name"
        />
      </div>

      <div class="py-2">
        <label for="" class="mb-2 inline-block">SỐ ĐIỆN THOẠI</label>
        <input
          class="
            w-full
            h-8
            2xl:h-10
            px-2
            bg-gray-300
            rounded-md
            border-none
            focus:outline-1 focus:outline-yellow-400
          "
          placeholder="Vui lòng nhập SĐT liên hệ"
          v-model="phone"
        />
        <span class="mt-2.5 inline-block text-sm text-[#ad0000]"
          >Để bảo vệ quyền lợi của bạn, Tên / ID / tài khoản đã đăng ký phải là
          cùng một người. Vui lòng sử dụng số điện thoại di động của bản thân và
          nhận được tin nhắn văn bản. Không được sử dụng nhiều danh tính để đăng
          ký tài khoản với số lượng lớn dẫn đến trùng lặp thông tin thành viên
          hoặc mất điểm, bạn tự chịu hậu quả rủi ro.</span
        >
      </div>

      <div class="py-2">
        <label for="" class="mb-2 inline-block">TÊN ĐĂNG NHẬP</label>
        <input
          type="text"
          class="
            w-full
            h-8
            2xl:h-10
            px-2
            bg-gray-300
            rounded-md
            border-none
            focus:outline-1 focus:outline-yellow-400
          "
          placeholder="TÊN ĐĂNG NHẬP"
          v-model="username"
        />
      </div>

      <div class="py-2 flex gap-2 input-group">
        <div class="basis-1/2 input-wrapper">
          <label for="" class="mb-2 inline-block">MẬT KHẨU ĐĂNG NHẬP</label>
          <input
            type="password"
            class="
              w-full
              h-8
              2xl:h-10
              px-2
              bg-gray-300
              rounded-md
              border-none
              focus:outline-1 focus:outline-yellow-400
            "
            placeholder="MẬT KHẨU ĐĂNG NHẬP"
            v-model="password"
          />
        </div>

        <div class="basis-1/2 input-wrapper">
          <label for="" class="mb-2 inline-block">MẬT KHẨU ĐĂNG NHẬP</label>
          <input
            type="password"
            class="
              w-full
              h-8
              2xl:h-10
              px-2
              bg-gray-300
              rounded-md
              border-none
              focus:outline-1 focus:outline-yellow-400
            "
            placeholder="Bắt buộc nhập mật khẩu xác nhận"
            v-model="passwordConfirm"
          />
        </div>
      </div>

      <div class="py-2 flex gap-2 input-group">
        <div class="basis-1/2 input-wrapper">
          <label for="" class="mb-2 inline-block">Vui lòng nhập SĐT Zalo</label>
          <input
            type="text"
            class="
              w-full
              h-8
              2xl:h-10
              px-2
              bg-gray-300
              rounded-md
              border-none
              focus:outline-1 focus:outline-yellow-400
            "
            placeholder="SĐT Zalo"
            v-model="zaloPhone"
          />
        </div>

        <div class="basis-1/2 input-wrapper">
          <label for="" class="mb-2 inline-block">MÃ GIỚI THIỆU</label>
          <input
            type="text"
            class="
              w-full
              h-8
              2xl:h-10
              px-2
              bg-gray-300
              rounded-md
              border-none
              focus:outline-1 focus:outline-yellow-400
            "
            placeholder="NHẬP MÃ"
            v-model="refCode"
          />
        </div>
      </div>

      <div class="py-2 text-[#333] text-sm">
        <div class="form-check">
          <input
            class="
              form-check-input
              appearance-none
              h-4
              w-4
              border border-gray-300
              rounded-sm
              bg-white
              checked:bg-blue-600 checked:border-blue-600
              focus:outline-none
              transition
              duration-200
              align-top
              bg-no-repeat bg-center bg-contain
              float-left
              mr-2
              cursor-pointer
            "
            type="checkbox"
            v-model="confirm"
          />
        </div>
        Xác nhận rằng tôi trên 18 tuổi và mọi hoạt động trên trang web này không
        vi phạm pháp luật do quốc gia nơi tôi sinh sống. Tôi cũng chấp nhận tất
        cả các quy tắc và quy định liên quan và tuyên bố về quyền riêng tư trong
        ứng dụng này.
      </div>

      <button
        class="
          bg-[#cc3d39]
          mt-7
          lg:mt-8
          rounded-full
          w-full
          px-8
          py-3
          2xl:py-4
          text-xs
          font-bold
          text-white
        "
        @click="register"
      >
        ĐĂNG KÝ
      </button>

      <div class="flex justify-evenly my-5 mx-auto">
        <router-link to="login">ĐÃ CÓ TÀI KHOẢN</router-link>
        <div>|</div>

        <router-link to="/">QUAY LẠI TRANG CHỦ</router-link>
      </div>
    </form>
    <modal
      :title="modalTitle"
      :active="isShowModal"
      @close="isShowModal = false"
      :closed="closed"
    />
  </div>
</template>
<script>
import {
  register as apiRegister,
  login as ApiLogin,
  getUserInfo,
} from "@/client/api/userApi";
import Modal from "@/client/components/Modal.vue";

export default {
  components: {
    Modal,
  },
  data() {
    return {
      name: "",
      phone: "",
      username: "",
      password: "",
      passwordConfirm: "",
      zaloPhone: "",
      refCode: "",
      confirm: false,
      isShowModal: false,
      modalTitle: "",
      closed: null,
    };
  },

  methods: {
    register() {
      if (!this.name) {
        this.modalTitle = "Vui lòng nhập Họ tên thật.";
        this.isShowModal = true;
        return;
      }

      if (!this.phone) {
        this.modalTitle = "Vui lòng nhập số điện thoại.";
        this.isShowModal = true;
        return;
      }

      if (!this.username) {
        this.modalTitle = "Vui lòng nhập tên đăng nhập.";
        this.isShowModal = true;
        return;
      }
      else{
        const validUsername = /^[a-zA-Z0-9_]+$/i
        if(!validUsername.test(this.username)){
          this.modalTitle = "Tên đăng nhập chỉ bao gồm chữ cái, chữ số vào ký tự: _";
          this.isShowModal = true;
          return;
        }
      }

      if (!this.password) {
        this.modalTitle = "Vui lòng nhập mật khẩu.";
        this.isShowModal = true;
        return;
      }

      if (!this.passwordConfirm) {
        this.modalTitle = "Vui lòng nhập xác nhận mật khẩu.";
        this.isShowModal = true;
        return;
      }

      if (this.password !== this.passwordConfirm) {
        this.modalTitle = "Xác nhận mật khẩu không chính xác.";
        this.isShowModal = true;
        return;
      }

      if (!this.confirm) {
        this.modalTitle =
          "Vui lòng xác nhận bạn đồng ý với điều khoản của chúng tôi để hoàn thành quá trình đăng ký tài khoản.";
        this.isShowModal = true;
        return;
      }
      const registerData = {
        name: this.name,
        phone: this.phone,
        username: this.username,
        password: this.password,
        refCode: this.refCode,
      };

      apiRegister(registerData)
        .then((res) => {
          if (res.success == 3) {
            this.modalTitle = "Tên đăng nhập đã tồn tại trong hệ thống";
            this.isShowModal = true;
            return;
          }

          if (res.success == 2) {
            this.modalTitle = "Số điện thoại đã tồn tại trong hệ thống";
            this.isShowModal = true;
            return;
          }

          if (res.success == 1) {
            this.modalTitle = "Đăng kí tài khoản thành công";
            this.isShowModal = true;
            this.closed = async () => {
              const loginData = {
                username: this.username,
                password: this.password,
              };

              ApiLogin(loginData)
                .then((data) => {
                  if (data.success == 1) {
                    localStorage.setItem("userToken", data.token);
                    getUserInfo().then((res) => {
                      if (res.success == 1) {
                        this.$store.dispatch('login', true)
                        this.$store.dispatch("setUserInfo", res.data);
                        this.$router.push("/");
                      } else {
                        localStorage.removeItem("userToken");
                        window.location.href = window.location.origin + '/logout'
                      }
                    });
                  }
                  if (data.success == 0 || data.success == 3) {
                    this.modalTitle = "Sai tên đăng nhập hoặc mật khẩu.";
                  }
                })
                .catch((err) => {console.log(err);})
                .finally();
            };
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally();
    },
  },

  created(){
    if(this.$route.query.ref){
      this.refCode = this.$route.query.ref;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/client/scss/responsive";
.input-group {
  @include max-lg {
    flex-direction: column;
    gap: 20px;
    .input-wrapper {
      flex-basis: 100%;
    }
  }
}
</style>
