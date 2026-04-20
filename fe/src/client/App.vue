<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { getUserInfo } from "@/client/api/userApi";
import depositSocket from "@/services/DepositSocket.js";
export default {
  methods: {
    login() {
      getUserInfo().then((res) => {
        if (res.success == 1) {
          this.$store.dispatch("setUserInfo", res.data);
          depositSocket.connect();
          depositSocket.socket.onopen = (s) => {
            const {username, name, phone} = this.$store.state.userInfo
            depositSocket.send("accountDetail", {email: username, name, phone});
          };
        } else {
          localStorage.removeItem("userToken");
          window.location.href = window.location.origin + '/logout'
        }
      });
    },
  },
  created() {
    if (this.$store.state.isLogin) {
      this.login();
    }
  },

  watch: {
    "$store.state.isLogin"(v) {
      if (v) this.login();
      else depositSocket.close();
    },
  },
};
</script>

