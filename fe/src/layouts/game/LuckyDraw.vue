<template>
  <div class="wrapper">
    <vs-alert active="true">
      Sau mỗi ngày hệ thống sẽ lấy ra 3 người trong danh sách email và nickname
      ở dưới để tiến hành trao giải. Càng nhiều email và nickname sàn càng uy
      tín!
    </vs-alert>
    <vs-textarea
      v-model="email"
      placeholder="Mỗi email nằm trên 1 dòng"
      label="Danh sách email ngẫu nhiên"
      rows="15"
    />

    <div class="btn">
      <vs-button @click="saveEmail" :disabled="loading.email"
        >Lưu danh sách email</vs-button
      >
    </div>

    <vs-textarea
      v-model="nickname"
      placeholder="Mỗi nickname nằm trên 1 dòng"
      label="Danh sách nickname ngẫu nhiên"
      rows="15"
    />

    <div class="btn">
      <vs-button @click="saveNickname" :disabled="loading.nickname"
        >Lưu danh sách nickname</vs-button
      >
    </div>
  </div>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";

export default {
  data() {
    return {
      email: "",
      nickname: "",
      loading: {
        email: false,
        nickname: false
      }
    };
  },
  methods: {
    async saveEmail() {
      this.loading.email = true;
      AuthenticationService.createLuckyDrawAdmin(
        { email: this.email },
        "email"
      ).then(resp => {
        if (resp.data.success) {
          this.loading.email = false;

          return this.$vs.notify({
            text: `Lưu danh sách email thành công!`,
            color: "success",
            position: "top-right"
          });
        } else {
          this.loading.email = false;
          return this.$vs.notify({
            text: resp.data.message,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle"
          });
        }
      });
    },
    async saveNickname() {
      this.loading.nickname = true;
      AuthenticationService.createLuckyDrawAdmin(
        { nickname: this.nickname },
        "nickname"
      ).then(resp => {
        if (resp.data.success) {
          this.loading.nickname = false;

          return this.$vs.notify({
            text: `Lưu danh sách nickname thành công!`,
            color: "success",
            position: "top-right"
          });
        } else {
          this.loading.nickname = false;
          return this.$vs.notify({
            text: resp.data.message,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle"
          });
        }
      });
    }
  },
  created() {
    let token = localStorage.getItem("token");
    this.$store.dispatch("setToken", token);

    AuthenticationService.getLuckyDrawAdmin().then(resp => {
      this.$vs.loading.close("#loading-corners > .con-vs-loading");

      if (resp.data.success == 4) {
        localStorage.removeItem("token");
        this.$router.push("/pages/login").catch(() => {});
      } else {
        const result = resp.data.data;
        const resultEmail = result.find((e) => e.type === 'email');
        const resultNickname = result.find((e) => e.type === 'nickname');

        if (resultEmail) {
          this.email = resultEmail.email.replaceAll('|', '\n');
        }

        if (resultNickname) {
          this.nickname = resultNickname.nickname.replaceAll('|', '\n');
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  .btn {
    text-align: right;
  }
}
</style>
