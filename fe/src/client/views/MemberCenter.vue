<template>
  <div class="container bottom-main-block">
    <div class="right-block">
      <div class="news-block">
        <div class="news-left">
          <img src="@/assets/client/images/promotion.png" class="w-9 h-9" />
          <h4>TIN MỚI NHẤT</h4>
        </div>
        <div class="news-right">
          <div class="marquee-text">
            <a
              href="le-ho-leveraged-token"
              title="Lễ hội Leveraged Tokens: Giao dịch để Chia sẻ Nhóm Giải thưởng $ 40.000 và Thưởng thức Airdrop may mắn lên đến $ 200!"
              class="inline-block name text-lefts"
              >Lễ hội Leveraged Tokens: Giao dịch để Chia sẻ Nhóm Giải thưởng $
              40.000 và Thưởng thức Airdrop may mắn lên đến $ 200!</a
            >
            <a
              href="openleverage"
              title="OpenLeverage (OLE) Được Niêm yết trên AutoHold"
              class="inline-block name text-left"
              >OpenLeverage (OLE) Được Niêm yết trên AutoHold</a
            >
            <a
              href="cac-chien-dich-spot-dang-dien-ra"
              title="Các chiến dịch Spot đang diễn ra"
              class="inline-block name text-left"
              >Các chiến dịch Spot đang diễn ra</a
            >
            <a
              href="giao-dich-rsr-hop-dong-vinh-vien-jst"
              title="Giao dịch RSR, Hợp đồng vĩnh viễn JST, Giành phần thưởng 20.000 USDT!"
              class="inline-block name text-left"
              >Giao dịch RSR, Hợp đồng vĩnh viễn JST, Giành phần thưởng 20.000
              USDT!</a
            >
          </div>
        </div>
      </div>
      <div class="flex gap-5 flex-col md:flex-row">
        <div class="w-full md:w-1/2">
          <div class="stats-info-agileits">
            <div class="member-top">
              <div class="member-image">
                <!-- <img src="img/impe/icon_user_photo.html" alt="" /> -->
              </div>
              <div class="member-top-block">
                <div class="flex justify-between member-data">
                  <p>TÀI KHOẢN ĐĂNG NHẬP：</p>
                  <p><span class="name text-red-600">{{userInfo.username}}</span></p>
                </div>
                <div class="flex justify-between member-data">
                  <p>HỌ TÊN</p>
                  <p class="realname">{{ userInfo.name }}</p>
                </div>
                <div class="flex justify-between member-data">
                  <p>SỐ ĐIỆN THOẠI</p>
                  <p class="mobile">{{ userInfo.phone }}</p>
                </div>
                <div class="flex justify-between member-data">
                  <p>MÃ GIỚI THIỆU</p>
                  <p class="mobile">{{ userInfo.ref }}</p>
                </div>
                <div class="flex justify-between member-data cursor-pointer" @click="copyRefLink">
                  <p> LINK GIỚI THIỆU</p>
                  <copy-tooltip :value="refLink" message="Copied">
                      <p class="mobile">{{ refLink }}</p>
                  </copy-tooltip>

                </div>
              </div>
            </div>
            <div
              class="member-bottom flex flex-col justify-center items-center"
            >
              <h4>VÍ ĐIỆN TỬ</h4>
              <h1 class="credit">{{ balance }} VND</h1>
            </div>
            <div class="trading-center mt-5 p-4">
              <div class="title-block">
                <p class="text-xl text-white">TRUNG TÂM GIAO DỊCH</p>
              </div>
              <div class="trading-center-block">
                <div class="trading-introduction">
                  <div class="flex flex-wrap md:flex-nowrap overflow-auto mb-8 justify-around">
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-1.png"
                        alt="BTC/USD"
                      />
                      <p>BTC/USD</p>
                    </div>
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-2.png"
                        alt="ETH/USD"
                      />
                      <p>ETH/USD</p>
                    </div>
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-3.png"
                        alt="AUD/USD"
                      />
                      <p>AUD/USD</p>
                    </div>
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-4.png"
                        alt="CNYC/ USD"
                      />
                      <p>CNYC/ USD</p>
                    </div>
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-5.png"
                        alt="EUR/USD"
                      />
                      <p>EUR/USD</p>
                    </div>
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-6.png"
                        alt="GBP/USD"
                      />
                      <p>GBP/USD</p>
                    </div>
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-7.png"
                        alt="DASH/USD"
                      />
                      <p>DASH/USD</p>
                    </div>
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-8.png"
                        alt="EOS/USD"
                      />
                      <p>EOS/USD</p>
                    </div>
                    <div class="currency-value">
                      <img
                        src="@/assets/client/images/demo/money-9.png"
                        alt="LTC/USD"
                      />
                      <p>LTC/USD</p>
                    </div>
                  </div>
                  <div class="mx-auto rounded-md">
                    <router-link
                      to="/han-muc-tai-chinh"
                      class="
                        bg-primary
                        px-9
                        py-4
                        rounded-md
                        text-white
                        whitespace-nowrap
                        block
                        w-fit
                        mx-auto
                      "
                    >
                      BẮT ĐẦU
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 border-t-4 border-primary rounded-md">
          <div class="max_staticcal">
            <div class="tradingview-widget-container w-full h-[600px]">
              <iframe
                scrolling="no"
                allowtransparency="true"
                frameborder="0"
                src="https://s.tradingview.com/embed-widget/market-overview/?locale=en#%7B%22colorTheme%22%3A%22dark%22%2C%22dateRange%22%3A%2212M%22%2C%22showChart%22%3Atrue%2C%22largeChartUrl%22%3A%22%22%2C%22isTransparent%22%3Atrue%2C%22showSymbolLogo%22%3Atrue%2C%22width%22%3A%221110%22%2C%22height%22%3A%22600%22%2C%22plotLineColorGrowing%22%3A%22rgba(25%2C%20118%2C%20210%2C%201)%22%2C%22plotLineColorFalling%22%3A%22rgba(25%2C%20118%2C%20210%2C%201)%22%2C%22gridLineColor%22%3A%22rgba(42%2C%2046%2C%2057%2C%201)%22%2C%22scaleFontColor%22%3A%22rgba(120%2C%20123%2C%20134%2C%201)%22%2C%22belowLineFillColorGrowing%22%3A%22rgba(33%2C%20150%2C%20243%2C%200.12)%22%2C%22belowLineFillColorFalling%22%3A%22rgba(33%2C%20150%2C%20243%2C%200.12)%22%2C%22symbolActiveColor%22%3A%22rgba(33%2C%20150%2C%20243%2C%200.12)%22%2C%22tabs%22%3A%5B%7B%22title%22%3A%22Indices%22%2C%22symbols%22%3A%5B%7B%22s%22%3A%22KRAKEN%3AETHUSD%22%7D%2C%7B%22s%22%3A%22KRAKEN%3AEURUSD%22%7D%2C%7B%22s%22%3A%22KRAKEN%3AAUDUSD%22%7D%2C%7B%22s%22%3A%22KRAKEN%3AGBPUSD%22%7D%2C%7B%22s%22%3A%22KRAKEN%3ADASHUSD%22%7D%2C%7B%22s%22%3A%22KRAKEN%3AEOSUSD%22%7D%2C%7B%22s%22%3A%22KRAKEN%3ALTCUSD%22%7D%5D%2C%22originalTitle%22%3A%22Indices%22%7D%2C%7B%22title%22%3A%22Commodities%22%2C%22symbols%22%3A%5B%7B%22s%22%3A%22CME_MINI%3AES1!%22%2C%22d%22%3A%22S%26P%20500%22%7D%2C%7B%22s%22%3A%22CME%3A6E1!%22%2C%22d%22%3A%22Euro%22%7D%2C%7B%22s%22%3A%22COMEX%3AGC1!%22%2C%22d%22%3A%22Gold%22%7D%2C%7B%22s%22%3A%22NYMEX%3ACL1!%22%2C%22d%22%3A%22Crude%20Oil%22%7D%2C%7B%22s%22%3A%22NYMEX%3ANG1!%22%2C%22d%22%3A%22Natural%20Gas%22%7D%2C%7B%22s%22%3A%22CBOT%3AZC1!%22%2C%22d%22%3A%22Corn%22%7D%5D%2C%22originalTitle%22%3A%22Commodities%22%7D%2C%7B%22title%22%3A%22Bonds%22%2C%22symbols%22%3A%5B%7B%22s%22%3A%22CME%3AGE1!%22%2C%22d%22%3A%22Eurodollar%22%7D%2C%7B%22s%22%3A%22CBOT%3AZB1!%22%2C%22d%22%3A%22T-Bond%22%7D%2C%7B%22s%22%3A%22CBOT%3AUB1!%22%2C%22d%22%3A%22Ultra%20T-Bond%22%7D%2C%7B%22s%22%3A%22EUREX%3AFGBL1!%22%2C%22d%22%3A%22Euro%20Bund%22%7D%2C%7B%22s%22%3A%22EUREX%3AFBTP1!%22%2C%22d%22%3A%22Euro%20BTP%22%7D%2C%7B%22s%22%3A%22EUREX%3AFGBM1!%22%2C%22d%22%3A%22Euro%20BOBL%22%7D%5D%2C%22originalTitle%22%3A%22Bonds%22%7D%2C%7B%22title%22%3A%22Forex%22%2C%22symbols%22%3A%5B%7B%22s%22%3A%22FX%3AEURUSD%22%7D%2C%7B%22s%22%3A%22FX%3AGBPUSD%22%7D%2C%7B%22s%22%3A%22FX%3AUSDJPY%22%7D%2C%7B%22s%22%3A%22FX%3AUSDCHF%22%7D%2C%7B%22s%22%3A%22FX%3AAUDUSD%22%7D%2C%7B%22s%22%3A%22FX%3AUSDCAD%22%7D%5D%2C%22originalTitle%22%3A%22Forex%22%7D%5D%2C%22utm_source%22%3A%22bmwindex.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22market-overview%22%7D"
                style="box-sizing: border-box; height: 100%; width: 100%"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import helper from "@/client/helper";

import CopyTooltip from "@/client/components/CopyTooltip.vue";

export default {
  components: {
    CopyTooltip
  },
  computed:{
    ...mapGetters(['userInfo']),

    balance(){
      return helper.formatPrice(this.userInfo.balance, 0);
    },

    refLink(){
      return `${window.location.origin}/register?ref=${this.userInfo.ref}`
    }
  },

  methods: {
    copyRefLink(){

    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/responsive";
@import "@/assets/client/scss/color";

.news-block {
  margin: 15px 0;
  display: flex;
  height: 50px;
  padding: 0 15px;
  background-color: #fff;
  border-radius: 5px;
  border: solid thin #ebebeb;
  .news-left {
    display: none;
    @include min-md {
      display: flex;
      align-items: center;
      width: 180px;
      box-sizing: border-box;
    }
    h4 {
      line-height: 3.5;
      font-size: 6px;
      color: #cc3d39 !important;
      white-space: nowrap;
      @include min-md {
        margin-left: 10px;
      }
    }
  }

  .news-right {
    width: 100%;
    overflow: hidden;

    .marquee-text {
      display: flex;
      justify-content: start;
      flex-wrap: nowrap;
      align-items: start;
      overflow: hidden;
      animation: news-top-animation 7s 0.5s linear infinite;
      animation-fill-mode: forwards;
      line-height: 3.5;

      a {
        color: #000;
        display: inline-block;
        font-size: 14px;
        transition: color 0.5s ease-in-out;
        white-space: nowrap;
        margin-right: 20px;
      }
    }
  }
}
.member-top,
.member-bottom {
  background: #f7f7f7;
  border-radius: 5px;
  position: relative;
  z-index: 1;
  padding: 10px;
  overflow: hidden;
  border: solid thin #ebebeb;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.member-top {
  border-top: 4px solid $primary;
  .member-data {
    padding: 5px 0;
    margin-bottom: 5px;
    border-bottom: 1px solid #d1d1d1;

    gap: 20px;
    p:nth-child(1){
      white-space: nowrap;
    }
    .mobile{
      overflow: hidden;
      text-overflow: ellipsis;
    }

  }
}

.member-bottom {
  margin-top: 20px;
  border-top: 4px solid #252525;
  font-size: 20px;
  color: white;
  background: $primary;
  height: 155px;
}
.currency-value {
  text-align: center;
  color: #000;
  cursor: pointer;

  flex: 0 0 30%;
  img {
    max-width: 80px;
    width: 100%;
    display: inline;
  }
  p {
    margin-bottom: 15px;
    font-size: 12px;
    white-space: nowrap;
  }
  @include min-md {
    width: 20%;
    flex: 0 0 20%;
    img {
      width: 40%;
    }
  }

  @include min-lg {
    width: 15%;
    padding: 0;
  }
}

.trading-center {
  margin: 15px 0;
  background-color: #f7f7f7;
  border-radius: 5px;
  padding: 15px;
  border: solid thin #ebebeb;
  box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.15);

  .title-block {
    background-color: $primary;
    text-align: center;
    padding: 6px 3px;
    border-radius: 5px;
    margin-bottom: 15px;
  }
}
</style>
