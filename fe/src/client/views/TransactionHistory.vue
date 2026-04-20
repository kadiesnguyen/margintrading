<template>
  <div class="container">
    <div class="form-wrapper">
      <div class="form-title">
        <p>LỊCH SỬ GIAO DỊCH</p>
      </div>

      <div class="tab-buttons-wrapper">
        <div class="history-page-button">
          <router-link
            :to="{
              name: 'transaction-history',
              params: { pathMatch: 'recharge' },
            }"
            class="text-white p-2 w-48 text-center rounded-md block"
          >
            <h4>NẠP TIỀN</h4>
          </router-link>
        </div>
        <div class="history-page-button">
          <router-link
            :to="{
              name: 'transaction-history',
              params: { pathMatch: 'withdraw' },
            }"
            class="text-white p-2 w-48 text-center rounded-md block"
          >
            <h4>LỊCH SỬ RÚT TIỀN</h4>
          </router-link>
        </div>
      </div>
      <p v-if="!history.length">Chưa có yêu cầu nào</p>
      <div v-else>
        <div class="member-list">
          <ul id="deposit_record">
            <li class="li-title">
              <div class="w-60">
                <b> NGÀY ĐẶT ĐƠN</b>
              </div>
              <div class="w-40">
                <b>CHI TIẾT</b>
              </div>
            </li>
            <li class="li-title" v-for="(e, index) in history" :key="index">
              <div class="w-60">
                <b>{{
                  moment(new Date(e.created_at)).format("DD/MM/YYYY HH:mm")
                }}</b>
              </div>
              <div class="w-40">
                <p>
                  <b class="item-history-title">Số tiền: </b>
                  <b>{{ formatPrice(e.amount) }} VND</b>
                </p>
                <p>
                  <b class="item-history-title">Trạng thái: </b>
                  <b class="text-danger">{{ statusText(e.status)}}</b>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRechargeHistory, getWithdrawalHistory } from "@/client/api/userApi";
import { formatPrice } from "@/helpers/helpers.js";

import moment from "moment";
export default {
  data() {
    return {
      history: [],
      moment,
      formatPrice,
    };
  },

  methods: {
    getTransactionsData(type) {
      if (type == "recharge") {
        getRechargeHistory().then((res) => {
          this.history = res.data;
        });
      } else {
        getWithdrawalHistory().then((res) => {
          this.history = res.data;
        });
      }
    },

    statusText(status){
      if(status == 0){
        return "Đang chờ xác nhận"
      }

      if(status == 1){
        return "Thành công"
      }

      return "Bị từ chôi"
    }
  },
  created() {
    if(!this.$route.params.pathMatch){
      this.$router.push("/transaction-history/recharge")
    }
    else{
      this.getTransactionsData(this.$route.params.pathMatch);
    }
  },

  watch: {
    "$route.params.pathMatch"(value) {
      this.getTransactionsData(value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/form";
@import "@/assets/client/scss/responsive";
@import "@/assets/client/scss/color";

.tab-buttons-wrapper{
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.history-page-button {
  & > a {
    border: 1px solid black;
    color: black;

    &:hover {
      border-color: $primary;
      color: $primary;
    }
    &.router-link-exact-active {
      color: #fdef03;
      border: none;
      background: $primary;
    }
  }
}

.member-list {
  & > ul > li {
    color: #082435;
  }
  font-size: 14px;

  @include min-lg {
    .w-60 {
      flex: 60%;
    }
    .w-40 {
      flex: 40%;
    }
    & > ul {
      border: 1px solid #fff;
      border-radius: 5px;
      padding-left: 0;
      & > li {
        &:first-child {
          display: flex;
          align-items: center;
        }
        display: flex;
        border-bottom: 1px solid #b1b1b1;
        padding: 8px;
        -webkit-align-items: center;
        align-items: center;
        text-align: left;
        margin-bottom: 0;
        border-radius: 0;
      }
    }
  }
}
</style>
