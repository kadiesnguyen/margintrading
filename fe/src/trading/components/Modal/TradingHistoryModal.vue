<template>
  <base-modal :isShowModal="isShowModalLocal" @close="$emit('close')">
    <div slot="title">Lịch sử giao dịch</div>
    <template slot="content">
      <div id="log-report">
        <div
          class="modal-body-left"
          :class="{
            show: isShowLeftMenu,
          }"
        >
          <form
            action="#"
            class="form-init-bet-history-user"
            method="get"
            accept-charset="utf8"
            @submit.prevent="searchHistory"
          >
            <div class="row select-row">
              <div class="col-sm-12 btn-row">
                <h6>
                  Lựa chọn
                  <div class="select-input-box">
                    <select name="symbolId" class="form-control selectpicker">
                      <option value="1" selected="">BTC/USD</option>
                    </select>
                  </div>
                </h6>
              </div>

              <div class="col-lg-6 col-sm-12">
                <h6>Thời gian bắt đầu</h6>
                <!--  -->
                <b-input-group class="mb-3">
                  <b-form-input
                    v-model="startDate"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    autocomplete="off"
                  ></b-form-input>

                  <b-form-datepicker
                    v-model="startDate"
                    button-only
                    right
                    locale="en-US"
                  ></b-form-datepicker>
                </b-input-group>
                <!--  -->
              </div>
              <div class="col-lg-6 col-sm-12">
                <h6>Thời gian kết thúc</h6>
                <b-input-group class="mb-3">
                  <b-form-input
                    v-model="endDate"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    autocomplete="off"
                  ></b-form-input>

                  <b-form-datepicker
                    class="hidden"
                    v-model="endDate"
                    button-only
                    right
                    locale="en-US"
                  ></b-form-datepicker>
                </b-input-group>
              </div>
              <div class="col-sm-12 btn-row">
                <label
                  class="btn btn-dark close-menu"
                  @click="isShowLeftMenu = false"
                  >Đóng</label
                >
                <button class="btn btn-danger" type="submit">Tìm kiếm</button>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-body-right">
          <h6 class="modal-scroll-info">BTC/USD</h6>
          <label
            class="left-control-btn fa fa-search"
            @click="isShowLeftMenu = true"
          ></label>
          <div class="modal-body-right-scroll list-user-history-bet-result">
            <table>
              <thead>
                <tr>
                  <th>Mã số giao dịch / Thời gian giao dịch</th>
                  <th>Nội dung giao dịch</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #507cff; font-weight: bold">
                  <td>Khối lượng giao dịch : {{ formatPrice(totalBet, 0)}} VND</td>
                  <td>
                    Lợi nhuận :
                    <font color="white">{{ formatPrice(totalWin, 0) }} VND</font>
                  </td>
                </tr>

                <tr
                  style="background-color: #f1f1f1; font-weight: bold"
                  v-for="tr in historyData"
                  :key="tr.oss"
                >
                  <td>
                    <p>ID: {{ tr.oss }}</p>
                    <p>Thời gian mua hàng: {{ formatDate(tr.d) }}</p>
                    <p>Giá trị: {{ tr.c }}</p>
                    <p>Loại: {{ tr.r ? "Cao" : "Thấp" }}</p>
                  </td>
                  <td>
                    <p>ID: {{ tr.oss }}</p>
                    <p>Số tiền: {{ formatPrice(tr.ab, 0) }} VNĐ</p>
                    <p>
                      Loại hàng đã đặt: {{ tr.bs == "buy" ? "Cao" : "Thấp" }}
                    </p>
                    <p>Kết quả: {{ tr.aw > 0 ? "Đúng" : "Sai" }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from "./BaseModal.vue";
import { BFormDatepicker, BInputGroup, BFormInput } from "bootstrap-vue";
import { getBetHistory, getBetHistoryByDate } from "@/client/api/userApi";

import helper from "@/client/helper";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  props: ["isShowModal"],
  components: {
    BaseModal,
    BFormDatepicker,
    BInputGroup,
    BFormInput,
  },

  data() {
    return {
      startDate: "",
      endDate: "",
      isShowLeftMenu: false,
      isShowModalLocal: false,
      historyData: [],
      formatPrice: helper.formatPrice,
      formatDate: helper.formatDateTime
    };
  },

  computed:{
    totalBet(){
      return this.historyData.reduce((prev, curr) => {
        return curr.ab + prev;
      }, 0)
    },

    totalWin(){
      return this.historyData.reduce((prev, curr) => {
        return curr.aw + prev;
      }, 0)
    }
  },

  methods: {
    getBetHistory() {
      getBetHistory().then((res) => {
        if (res.success == 1) {
          this.historyData = res.data;
        }
      });
    },

    searchHistory(){
      const params = {
        s: this.startDate,
        e: this.endDate

      }
       getBetHistoryByDate(params).then((res) => {
        if (res.success == 1) {
          this.historyData = res.data;
        }
      });
    }
  },

  created() {
    this.startDate = moment(new Date()).format("YYYY-MM-DD");
    this.endDate = moment(new Date()).add(1, "days").format("YYYY-MM-DD");
    this.getBetHistory();
  },

  
  mounted() {
    this.isShowModalLocal = true;
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/responsive.scss";

#log-report {
  position: relative;
  height: 100%;
}
.modal-body-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 30%;
  background-color: silver;
  padding: 0 15px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background-image: url("~@/assets/client/images/trade/cross.png");
  background-repeat: repeat;
  transition: all ease 0.2s;
  z-index: 1050;

  .btn {
    width: 100%;
  }
  .close-menu {
    display: none;
    margin-bottom: 0px;
  }

  .btn-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  @include max-lg {
    width: 100%;

    padding: 1rem 15px;
    bottom: auto;
    right: 0;

    .btn {
      width: calc(50% - 5px);
    }
    .close-menu {
      display: block;
    }

    transform: translateY(-120%);
    transition: all 0.2s ease;
    opacity: 0;
    &.show {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.modal-body-right {
  width: 70%;
  height: 100%;
  padding: 15px;
  margin-left: 30%;
  transition: all ease 0.2s;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-content: center;

  .modal-scroll-info {
    display: none;
    margin-bottom: 0;
    line-height: 30px;
    font-weight: bold;
    font-size: 1rem;
  }

  .left-control-btn {
    width: 60px;
    height: 35px;
    line-height: 35px;
    font-size: 20px;
    text-align: center;
    margin-bottom: 0;
    background-color: #3d6896;
    color: #fff;
    cursor: pointer;
    margin-bottom: 5px;
    display: none;
    transition: all ease 0.2s;
    overflow: hidden;
    float: right;
  }

  .modal-body-right-scroll {
    width: 100%;
    overflow: auto;
    height: calc(100% - 40px);
    table {
      width: 100%;
      min-width: 760px;
      th,
      td {
        width: 50%;
        p{
          margin: 0;
          font-weight: 500;
        }
      }
      thead th {
        color: #fff;
        font-weight: bold;
        font-family: -apple-system, BlinkMacSystemFont, "Microsoft Jheng Hei",
          "PingFang", "蘋方", "微軟正黑體", "Segoe UI", Roboto, "Helvetica Neue",
          Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol" !important;
        font-size: 1rem;
        padding: 0.3rem 1rem;
        background-color: #4f81b7;
        position: sticky;
        position: -webkit-sticky;
        top: 0;
      }

      tbody tr {
        border-bottom: 2px dashed silver;
        td {
          font-size: 14px;
          padding: 0.2rem 0.5rem;
        }
      }
    }
  }
  @include max-lg {
    width: 100%;
    margin-left: 0;

    .left-control-btn,
    .modal-scroll-info {
      display: block;
    }
  }
}
</style>
