<template>
  <div>
    <form @submit.prevent>
      <div class="py-2">
        <label for="" class="mb-2 inline-block">TÊN ĐĂNG NHẬP</label>

        <input type="text" class="
            w-full
            h-10
            px-2
            bg-gray-300
            rounded-md
            border-none
            focus:outline-1 focus:outline-yellow-400
          " placeholder="TÊN ĐĂNG NHẬP" v-model="username" />
      </div>

      <div class="py-2">
        <label for="" class="mb-2 inline-block">MẬT KHẨU ĐĂNG NHẬP</label>
        <input type="password" class="
            w-full
            h-10
            px-2
            bg-gray-300
            rounded-md
            border-none
            focus:outline-1 focus:outline-yellow-400
          " placeholder="MẬT KHẨU" v-model="password" />
      </div>

      <button class="
          bg-[#cc3d39]
          mt-8
          rounded-full
          w-full
          px-8
          py-4
          text-xs
          font-bold
          text-white
        " @click="login" type="button">
        ĐĂNG NHẬP
      </button>

      <div class="flex justify-evenly my-5 mx-auto">
        <router-link to="register">ĐĂNG KÝ NGAY</router-link>
        <div>|</div>
        <router-link to="/">QUAY LẠI TRANG CHỦ</router-link>
      </div>
    </form>
    <modal :title="modalTitle" :active="isShowModal" @close="isShowModal = false" />
  </div>
</template>
<script>
import { login as ApiLogin, getUserInfo } from "@/client/api/userApi";
import Modal from "@/client/components/Modal.vue";
export default {
  components: {
    Modal,
  },
  data() {
    return {
      username: "",
      password: "",
      isShowModal: false,
      modalTitle: "",
    };
  },

  methods: {
    login() {
      if (!this.username) {
        this.modalTitle = "Vui lòng nhập tên đăng nhập";
        this.isShowModal = true;
        return;
      }
      if (!this.password) {
        this.modalTitle = "Vui lòng nhập mật khẩu";
        this.isShowModal = true;
        return;
      }
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
                this.$store.dispatch('login', true);
                this.$store.dispatch("setUserInfo", res.data);
                return this.$router.push("/member-center");
              } else {
                localStorage.removeItem("userToken");
                window.location.href = window.location.origin + '/logout'
              }
            });
            this.$router.push("/member-center");
          }

          if (data.success == 0 || data.success == 3) {
            this.modalTitle = "Sai tên đăng nhập hoặc mật khẩu.";
            this.isShowModal = true;
          }
        })
        .catch((err) => { })
        .finally();
      // localStorage.setItem("userToken", "test-token");
      // this.$router.push("/");
    },
  },
};
</script>
<style lang="">
</style>
