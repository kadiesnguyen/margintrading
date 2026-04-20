<template>
  <div>
    <header class="gw">
      <div class="header-info">
        <nav class="header-nav">
          <a href="member-center" class="nav-link active">Trung tâm giao dịch</a>
          <a href="member-center?tab=password" class="nav-link">Đổi mật khẩu</a>
          <a href="member-center?tab=deposit" class="nav-link">Nạp tiền</a>
          <a href="member-center?tab=withdraw" class="nav-link">Rút tiền</a>
          <a href="member-center?tab=history" class="nav-link">Lịch sử nạp rút</a>
        </nav>

        <div class="header-right">
          <span class="header-user">Xin chào {{ $store.getters.userInfo.username }}</span>
          <span class="header-wallet">Ví: {{ formatPrice($store.getters.userInfo.balance, 0) }}</span>
          <button class="logout-btn" @click="logout">Đăng xuất</button>
        </div>

        <!-- Mobile hamburger -->
        <label class="nav-switch" @click="isShowMobileMenu = !isShowMobileMenu">
          <i class="fa size--30" :class="isShowMobileMenu ? 'fa-close' : 'fa-bars'"></i>
        </label>

        <!-- Mobile dropdown -->
        <div class="mobile-menu" :class="{ show: isShowMobileMenu }">
          <a href="member-center" class="mobile-link">Trung tâm giao dịch</a>
          <a href="member-center?tab=password" class="mobile-link">Đổi mật khẩu</a>
          <a href="member-center?tab=deposit" class="mobile-link">Nạp tiền</a>
          <a href="member-center?tab=withdraw" class="mobile-link">Rút tiền</a>
          <a href="member-center?tab=history" class="mobile-link">Lịch sử nạp rút</a>
          <div class="mobile-link">Xin chào {{ $store.getters.userInfo.username }} | Ví: {{ formatPrice($store.getters.userInfo.balance, 0) }}</div>
          <div class="mobile-link logout-mobile" @click="logout">Đăng xuất</div>
        </div>
      </div>
    </header>

    <notification-modal
      :isShowModal="isShowNotificationModal"
      @close="isShowNotificationModal = false"
    />
    <trading-rules-modal
      :isShowModal="isShowTradingRulesModal"
      @close="isShowTradingRulesModal = false"
    />
    <trading-history-modal
      v-if="isShowTradingHistoryModal"
      :isShowModal="isShowTradingHistoryModal"
      @close="isShowTradingHistoryModal = false"
    />
  </div>
</template>

<script>
import NotificationModal from "./Modal/NotificationsModal.vue";
import TradingRulesModal from "./Modal/TradingRulesModal.vue";
import TradingHistoryModal from "./Modal/TradingHistoryModal.vue";
import helper from "@/client/helper";

export default {
  components: { NotificationModal, TradingRulesModal, TradingHistoryModal },
  data() {
    return {
      isShowMobileMenu: false,
      isShowNotificationModal: false,
      isShowTradingRulesModal: false,
      isShowTradingHistoryModal: false,
      formatPrice: helper.formatPrice,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("userToken");
      window.open("/login", "_self");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/responsive.scss";

.header-info {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  align-items: center;
  background-color: #000000;
  padding: 0 16px;
  height: 44px;
  position: relative;
}

.header-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  flex: 1;

  @include max-md {
    display: none;
  }
}

.nav-link {
  color: #bec2c5;
  font-size: 14px;
  padding: 0 10px;
  text-decoration: none;
  white-space: nowrap;
  line-height: 44px;

  &:hover { color: #fff; }

  &.active {
    color: #87cefa;
    border-bottom: 2px solid #87cefa;
  }
}

.header-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  white-space: nowrap;

  @include max-md {
    display: none;
  }
}

.header-user {
  color: #fff;
  font-size: 14px;
}

.header-wallet {
  color: #fff;
  font-size: 14px;
}

.logout-btn {
  color: #fff;
  background: transparent;
  border: 1px solid #858585;
  font-size: 13px;
  padding: 3px 12px;
  cursor: pointer;
  border-radius: 2px;

  &:hover { border-color: #fff; }
}

.nav-switch {
  display: none;
  margin-bottom: 0;
  color: #fff;
  cursor: pointer;
  margin-left: auto;

  i {
    font-size: 24px;
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }

  @include max-md {
    display: inline-block;
  }
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 44px;
  right: -100%;
  width: 220px;
  background: #000;
  padding: 8px 0;
  z-index: 100;
  box-shadow: 0 0 0 1px #5f5f5f;
  transition: right ease 0.3s;
  flex-direction: column;

  &.show {
    right: 0;
  }

  @include max-md {
    display: flex;
  }
}

.mobile-link {
  color: #a5a5a5;
  font-size: 14px;
  padding: 8px 16px;
  text-decoration: none;
  border-bottom: 1px solid #222;
  display: block;

  &:hover { color: #fff; background: #111; }

  &.logout-mobile { cursor: pointer; }
}
</style>
