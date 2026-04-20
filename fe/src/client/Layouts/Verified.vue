<template>
  <div>
    <nav class="nav-bar">
      <div class="content">
        <router-link to="/">
          <img src="https://i.imgur.com/MvFojL5.png" class="logo" />
        </router-link>

        <div class="menu-wrapper">
          <div class="toggle-button" @click="isToggleMenu = !isToggleMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              width="18"
              height="20"
              x="0"
              y="0"
              viewBox="0 0 124 124"
              style="enable-background: new 0 0 512 512"
              xml:space="preserve"
              class=""
            >
              <g>
                <g>
                  <path
                    d="M112,6H12C5.4,6,0,11.4,0,18s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,6,112,6z"
                    fill="#ffffff"
                    data-original="#000000"
                    class=""
                  ></path>
                  <path
                    d="M112,50H12C5.4,50,0,55.4,0,62c0,6.6,5.4,12,12,12h100c6.6,0,12-5.4,12-12C124,55.4,118.6,50,112,50z"
                    fill="#ffffff"
                    data-original="#000000"
                    class=""
                  ></path>
                  <path
                    d="M112,94H12c-6.6,0-12,5.4-12,12s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,94,112,94z"
                    fill="#ffffff"
                    data-original="#000000"
                    class=""
                  ></path>
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </g>
            </svg>
          </div>

          <div class="menu">
            <router-link to="/member-center" class="button-link"
              >TRUNG TÂM HỘI VIÊN</router-link
            >
            <router-link to="/change-password" class="button-link"
              >ĐỔI MẬT KHẨU</router-link
            >
            <router-link to="/recharge" class="button-link"
              >NẠP TIỀN</router-link
            >
            <router-link to="/withdraw" class="button-link"
              >RÚT TIỀN</router-link
            >
            <router-link to="/transaction-history" class="button-link"
              >LỊCH SỬ GIAO DỊCH</router-link
            >
            <a
              href="/logout"
              class="button-link logout cursor-pointer"
              @click.prevent="logout"
              >ĐĂNG XUẤT</a
            >
          </div>
        </div>
      </div>

      <div class="mobile-menu" :class="{ show: isToggleMenu }">
        <div class="header">
          <router-link to="/">
            <img src="https://i.imgur.com/MvFojL5.png" class="logo" />
          </router-link>
          <div class="close" @click="isToggleMenu = !isToggleMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              width="12"
              height="16"
              x="0"
              y="0"
              viewBox="0 0 320.591 320.591"
              style="enable-background: new 0 0 512 512"
              xml:space="preserve"
              class=""
            >
              <g>
                <g>
                  <g id="close_1_">
                    <path
                      d="m30.391 318.583c-7.86.457-15.59-2.156-21.56-7.288-11.774-11.844-11.774-30.973 0-42.817l257.812-257.813c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875l-259.331 259.331c-5.893 5.058-13.499 7.666-21.256 7.288z"
                      fill="#ffffff"
                      data-original="#000000"
                      class=""
                    ></path>
                    <path
                      d="m287.9 318.583c-7.966-.034-15.601-3.196-21.257-8.806l-257.813-257.814c-10.908-12.738-9.425-31.908 3.313-42.817 11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414-6.35 5.522-14.707 8.161-23.078 7.288z"
                      fill="#ffffff"
                      data-original="#000000"
                      class=""
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>

        <div class="content">
          <div class="menu">
            <router-link to="/member-center" class="button-link"
              >TRUNG TÂM HỘI VIÊN</router-link
            >
            <router-link to="/change-password" class="button-link"
              >ĐỔI MẬT KHẨU</router-link
            >
            <router-link to="/recharge" class="button-link"
              >NẠP TIỀN</router-link
            >
            <router-link to="/withdraw" class="button-link"
              >RÚT TIỀN</router-link
            >
            <router-link to="/transaction-history" class="button-link"
              >LỊCH SỬ GIAO DỊCH</router-link
            >
            <a
              href="/logout"
              class="button-link logout cursor-pointer"
              @click.prevent="logout"
              >ĐĂNG XUẤT</a
            >
          </div>
        </div>
      </div>
    </nav>
    <modal
      :active="isShowNofity"
      :title="notifyTitle"
      :type="modalType"
      @close="isShowNofity = false"
    />
    <div class="pt-[100px]">
      <router-view></router-view>
    </div>

    <div class="footer">
      <p>© 2023 Vin Trade Group All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import depositSocket from "@/services/DepositSocket.js";
import Modal from "@/client/components/Modal.vue";
export default {
  components: {
    Modal,
  },

  data() {
    return {
      isToggleMenu: false,
      isShowNofity: false,
      notifyTitle: "",
      modalType: ""
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("login");
    },
  },

  created() {
    depositSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if(data.type == 'nap'){
          if(data.data.status == 1){
            const { balance } = this.$store.state.userInfo;
            const amount = data.data.amount;
            this.$store.dispatch('updateUserInfo', { balance: balance + amount})
            this.notifyTitle = "Yêu cầu nạp tiền của bạn đã được phê duyệt."
            this.modalType = "";
            this.isShowNofity = true;
          }
          else if(data.data.status == -1){
            this.notifyTitle = "Yêu cầu nạp tiền của bạn đã bị từ chối."
            this.modalType = 'danger'
            this.isShowNofity = true;
          }
        }

         if(data.type == 'rut'){
          if(data.data.status == 1){
            this.notifyTitle = "Yêu cầu rút tiền của bạn đã được phê duyệt."
            this.modalType = "";
            this.isShowNofity = true;
          }
          else if(data.data.status == -1){
            const { balance } = this.$store.state.userInfo;
            const amount = data.data.amount;
            this.$store.dispatch('updateUserInfo', { balance: balance + amount})

            this.notifyTitle = "Yêu cầu rút tiền của bạn đã bị từ chối."
            this.modalType = 'danger'
            this.isShowNofity = true;
          }
        }
      };
  },

  watch: {
    $route() {
      this.isToggleMenu = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/responsive";
@import "@/assets/client/scss/color";

.logo {
  max-height: 50px;
  @include max-lg {
    max-height: 28.8px;
  }
}
.button-link {
  display: flex;
  align-items: center;
  background: #a0a0a0b5;
  border-radius: 5px;
  min-height: 30px;
  justify-content: center;
  padding: 6px 10px;
  text-align: center;
  position: relative;
  white-space: nowrap;
  transition: all 0.5s ease-in-out;
  margin: 6px 10px;

  font-size: 12px;
  color: white;

  &.logout {
    color: $primary;
    border: 2px solid currentColor;
    background: #00000062;
  }

  &.router-link-exact-active {
    background: $primary;
    color: #fdef03;
  }

  &:not(.logout):hover {
    background: $primary;
  }
}

.nav-bar {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: #373737;
  padding: 6px 0;
  @include max-lg {
    padding: 0;
    background: #181818;
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;

    width: 100%;
    padding: 10px 30px;
    @include max-lg {
      justify-content: space-between;
    }
  }
  .menu-wrapper {
    .toggle-button {
      display: none;
      cursor: pointer;
    }
    .menu {
      display: flex;
    }
    // display: flex;
    @include max-lg {
      .toggle-button {
        display: block;
      }
      .menu {
        display: none;
      }
    }
  }
}

.footer {
  font-size: 11px;
  background: #222222;
  padding: 1em 0;
  z-index: 0;
  text-align: center;
  color: #fff;

  @include min-lg {
    margin-top: 4.15%;
  }
}

.mobile-menu {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #272727;

  transition: transform 0.3s ease-in-out;
  transform: translateY(-100%);
  .header {
    display: flex;
    justify-content: space-between;

    .logo {
      margin: 11px;
    }

    .close {
      padding: 15px;
      background: #ff9100;
      cursor: pointer;
    }
  }

  .content {
    display: block;
    .button-link {
      font-size: 18px;
      padding: 10px 0;
      background: transparent;

      &.logout {
        width: 125px;
        margin: auto;
        padding: 5px 20px;
        border-width: 1px;
      }
    }
  }
  &.show {
    transform: translateY(0);
  }
}
</style>
