<!-- =========================================================================================
  Description: Data List - List View
  Item Name: Admin
  Author: Ares DN
  Author Telegram: @skydnz
========================================================================================== -->

<template>

  <div v-if="false">
        Nhập mã xác thực 2 FA để truy cập trang
        <vs-input class="mt-5" placeholder="Nhập mã 2FA" v-model="code_2fa" />
        <vs-button class="mt-5 vs-con-loading__container loading-btn" @click="openPage">Xác nhận </vs-button>

  </div>
  <div v-else id="list-edit-result" class="data-list-container">

    <template>
        <div class="vx-row">
          <div class="vx-col w-full lg:w-1/3">
              <p class="mb-4">
                  {{ $t('thoigianconlai') }}: <span class=" mr-4" style="color: #d65b00; font-weight: bold;">{{ countDown }}s</span>
                  {{ $t('trangthaidatcuoc') }}: <b :class="{'text-success': typeOder == $t('open'), 'text-danger': typeOder == $t('close'), 'mr-4': true}" style="font-weight: bold;">{{ typeOder }}</b>
                  {{ $t('phien') }}: <b class="text-success" style="font-weight: bold;">{{ sessionID }}</b>

                  <!-- d63200 // đóng -->
              </p>
              <p class="mb-4">
                  {{ $t('tongcuocbuy') }}: <span class="mr-4 text-danger" style="font-size: 20px">{{ price_buy }}</span>
                  {{ $t('tongcuocsell') }}: <span class="text-danger" style="font-size: 20px">{{ price_sell }}</span>
              </p>
              <p class="mb-4">
                  {{ $t('tongmarketingcuoc') }}: <span class="mr-4 text-danger" style="font-size: 20px">{{ price_total_mkt }}</span><br>
                  {{ $t('tongnguoichoicuoc') }}: <span class="text-danger" style="font-size: 20px">{{ price_total }}</span>
              </p>
              <!-- <vs-progress indeterminate color="primary"></vs-progress> -->
              <template v-if="!enableRandomSession">
                <vs-button @click="reloadAmTien" class="h-12 font-bold" color="danger" type="relief"> {{ $t('tatbeamtien') }}</vs-button>
                <br>
                <b>
                    {{ $t('hethongdanggoviamtien') }}
                </b>
                <p></p>
                <br>
                <div class="vx-row">
                  <b>
                      <!-- Nếu {{AMOUNTBECAU_MIN}} BOT sẽ kích hoạt bẻ cầu cho đến khi hết LỖ -->
                      {{ $t('neu30botsekichhoat') }}
                  </b>
                  <div class="vx-col w-full lg:w-1/2">
                    <vs-input type="number" class="mb-4" color="success" v-model="AMOUNTBECAU_MIN" />
                  </div>
                  <div class="vx-col w-full lg:w-1/2 text-center">
                    <vs-button @click="sbAmountBeCauMin" class="h-12 font-bold" color="success" type="relief">{{ $t('dongy') }}</vs-button>
                  </div>
                  <b>
                      <!-- Nếu BUY hoặc SELL lớn hơn {{AMOUNTBECAU_MAX}} sẽ kích hoạt bẻ cầu -->
                      {{ $t('neubuyhoacselllonhon') }}
                  </b>
                  <div class="vx-col w-full lg:w-1/2">
                    <vs-input type="number" class="mb-4" color="success" v-model="AMOUNTBECAU_MAX" />
                  </div>
                  <div class="vx-col w-full lg:w-1/2 text-center">
                    <vs-button @click="sbAmountBeCauMax" class="h-12 font-bold" color="success" type="relief">{{ $t('dongy') }}</vs-button>
                  </div>

                </div>
              </template>
              <!--  -->
               <div class="w-full">
                <p class="mb-4 mr-4">
                    {{ $t('chucnang') }}:
                </p>
                <!--<p>
                    <b>
                        Chú ý:
                    </b>
                        Nhập giá trị QUỸ tổng cược mặc định hệ thống trả cho người chơi, nếu hệ thống chi trả đạt tới mức QUỸ này thì hệ thống sẽ tự động kiếm lại QUỸ này<br>
                        Mục đích: khiến người chơi tin tưởng rằng hệ thống chúng ta không gian lận chỉnh sửa kết quả và thu hút người chơi
                </p>
                <p class="mb-4">Ví dụ: Nhập 1,000 $, hệ thống sẽ cho ra ngẫu nhiên BUY hoặc SELL, hệ thống sẽ tích tổng tiền: <br>
                1: THẮNG ( TÍCH 70% ) tổng tiền mỗi phiên sao cho "đủ số giá trị NHẬP bên dưới" dành QUỸ sau. Để cân bằng THẮNG THUA không lỗ<br>
                2: THUA mà hệ thống đã trả nếu đủ 1,000 $ thì sẽ bắt đầu gỡ lại!<br>
                <b><i> BUY hoặc SELL bên nào ít sẽ THẮNG</i> </b> <br>( Chúng ta đã ăn phí 5% mỗi cuộc giao dịch )
                </p>
                <p class="flex items-center">
                  <vs-input type="number" class="mb-4" color="success" label-placeholder="Là số tiền tối thiểu" v-model="PriceBOT" />
                  <vs-button @click="SubmitBOTPrice" class="h-12 font-bold" color="danger" type="relief"> Đồng ý
                  </vs-button> *** Để giá trị 0 là TẮT
                </P>
                <p>
                    <vs-checkbox v-model="checkOnOffBOT" @click="changeBOTOnOff">( BOT Cược tiền ảo)</vs-checkbox>
                    <br>
                    <br>

                </p>-->
                <p>
                    <!--<span class="font-bold mb-4">=====Chỉ được phép mở 1 trong 3 chức năng phía dưới======</span>-->
                    <span class="font-bold mb-4">( {{ $t('dotienneuamphienhientai') }} )</span>
                    <!--<vs-checkbox v-model="checkOnOffBOTGoTien" @click="changeBOTGoTienOnOff">( GỠ TIỀN NẾU ÂM PHIÊN HIỆN TẠI )</vs-checkbox>-->
                    <br>
                    <b>
                        NOTE:
                    </b>
                        {{ $t('chuyphienhientaineuamtien') }}
                    <br>
                    <br>


                     <!--<vs-checkbox v-model="checkOnOffAnGian" @click="changeBetOnOff">( CƯỢC thấp WIN )</vs-checkbox> -->

                    <!-- <vs-checkbox v-model="checkOnOffAnGian" @change="changeBetOnOff">Có / Không (CƯỢC thấp WIN)</vs-checkbox> -->
                     <!--<br>
                    <span>
                    <b>
                        Chú ý:
                    </b>
                        Nếu chọn Có: Tổng của TIỀN CƯỢC bên MUA / BÁN ( nếu thấp hơn sẽ THẮNG, nhiều hơn sẽ THUA )
                    </span> -->
                </p>
                <p>
                    <span>
                        -- Dong <IconCrypto style="width: 20px" coinname="btc" color="color" format="svg" />
                    </span>
                    <ul class="centerx mb-4 mr-4" style="margin-left: 30px; line-height: 35px;">
                        <li>
                            <vs-radio v-model="radioBC" class="ml-4" vs-value="buy" @change="changeMode('buy')">{{ $t('BUY') }}</vs-radio>
                            <vs-radio v-model="radioBC" class="ml-4" vs-value="sell" @change="changeMode('sell')">{{ $t('SELL') }}</vs-radio>
                            <vs-radio v-model="radioBC" class="ml-4" vs-value="off" @change="changeMode('off')">OFF</vs-radio>
                            <br>
                            <span class="mb-4">
                            <b>
                                Note:
                            </b>
                                {{ $t('chuyneuchoncaohoacthap') }}
                            </span>
                        </li>
                    </ul>
                </p>
          </div>
              <!--  -->

          </div>

           <div class="vx-col w-full lg:w-2/3">
              <vs-button @click="toggleRandomSession" class="h-12 font-bold mb-4">{{ enableRandomSession ? 'ON' : 'OFF' }} RANDOM </vs-button>
              <template v-if="enableRandomSession">
                <div class="mb-4">Open: {{ moment(new Date(currentTime)).format("HH:mm:ss") }}</div>
                <div class="mb-4">{{ $t('phien') }}: {{ RandomSessionsShow.length }}</div>
                <vue-timepicker format="HH:mm:ss" v-model="startTime" placeholder="00:00:00" class="mr-4"/>
                <vue-timepicker class="mr-4" format="HH:mm:ss" v-model="endTime" placeholder="00:00:00"/>
                <vs-button  v-if="isShowClearButton" @click="clearFilter">Xóa</vs-button>
                <vs-pagination
                  class="mt-4 mb-2"
                  :total="totalRandomPage"
                  v-model="currentRandomPage"
                  @input="changeRandomPage"
                  :max="7"
                  ></vs-pagination>

                <table class="tbv">
                  <tr>
                    <th>Phiên</th>
                    <th>Thời gian</th>
                    <th>Kết quả ngẫu nhiên</th>
                  </tr>
                  <tr :data="tr" :key="indextr" v-for="(tr, indextr) in RandomSessionsPage">
                    <td>{{ tr.session }}</td>
                    <td>{{ moment(new Date(tr.time)).format('DD-MM-YYYY HH:mm:ss') }}</td>
                    <td><p class="bet-type" :class="tr.kq === 'sell' ? 'text-danger' : 'text-success'">{{ tr.kq === 'sell' ? 'GIẢM' : 'TĂNG' }}</p></td>
                  </tr>
                </table>
              </template>
          </div>

          <div class="vx-col w-full lg:w-1/2 mt-4">
              <p>Marketing</p>
              <p class="mb-4">
                  {{ $t('marketingcuoccao') }}: <span class="mr-4 text-danger" style="font-size: 20px">{{ price_buy_mkt }}</span><br>
                  {{ $t('marketingcuocthap') }}: <span class="text-danger" style="font-size: 20px">{{ price_sell_mkt }}</span>
              </p>
              <table class="tbv">
                <tr>
                  <th>Email</th>
                  <th>{{ $t('loai') }}</th>
                  <th>{{ $t('BUY/SELL') }}</th>
                  <th>{{ $t('sotiencuoc') }}</th>
                </tr>
                <tr :data="tr" :key="indextr" v-for="(tr, indextr) in productsFake">
                  <template v-if="tr.mkt == 1">
                    <td>{{ tr.e }}</td>
                    <td><p class="bet-type">{{ tr.sv }}</p></td>
                    <td>
                      <p class="bet-buy_sell" v-if="tr.bet == 'buy'">
                          <span class="text-success mr-2">{{ $t('BUY') }}</span>
                          <feather-icon icon="TrendingUpIcon" svgClasses="w-5 h-5"/>
                      </p>
                      <p class="bet-buy_sell" v-else>
                        <span class="text-danger mr-2">{{ $t('SELL') }}</span>
                        <feather-icon icon="TrendingDownIcon" svgClasses="w-5 h-5"/>
                      </p>
                    </td>
                    <td>
                      <p class="bet-amount">
                          <IconCrypto style="width: 20px" coinname="usdt" color="color" format="svg" />
                          <font class="ml-2" color="#006c27">{{ formatPrice(tr.amount, 2) }}</font>
                      </p>
                    </td>
                  </template>

                </tr>

              </table>
          </div>
          <div class="vx-col w-full lg:w-1/2 mt-4">
              <p>{{ $t('nguoichoi') }}</p>
              <p class="mb-4">
                  {{ $t('nguoichoicuoccao') }}: <span class="mr-4 text-danger" style="font-size: 20px">{{ price_play_buy }}</span><br>
                  {{ $t('nguoichoicuocthap') }}: <span class="text-danger" style="font-size: 20px">{{ price_play_sell }}</span>
              </p>
              <table class="tbv">
                <tr>
                  <th>Email</th>
                  <th>{{ $t('loai') }}</th>
                  <th>{{ $t('BUY/SELL') }}</th>
                  <th>{{ $t('sotiencuoc') }}</th>
                </tr>
                <tr :data="tr" :key="indextr" v-for="(tr, indextr) in productsFake">
                  <template v-if="tr.mkt == 0">
                    <td>{{ tr.e }}</td>
                    <td><p class="bet-type">{{ tr.sv }}</p></td>
                    <td>
                      <p class="bet-buy_sell" v-if="tr.bet == 'buy'">
                          <span class="text-success mr-2">{{ $t('BUY') }}</span>
                          <feather-icon icon="TrendingUpIcon" svgClasses="w-5 h-5"/>
                      </p>
                      <p class="bet-buy_sell" v-else>
                        <span class="text-danger mr-2">{{ $t('SELL') }}</span>
                        <feather-icon icon="TrendingDownIcon" svgClasses="w-5 h-5"/>
                      </p>
                    </td>
                    <td>
                      <p class="bet-amount">
                          <IconCrypto style="width: 20px" coinname="usdt" color="color" format="svg" />
                          <font class="ml-2" color="#006c27">{{ formatPrice(tr.amount, 2) }}</font>
                      </p>
                    </td>
                  </template>

                </tr>

              </table>
          </div>
        </div>


    </template>


  </div>
</template>

<script>
import config from "@/config.json";
import AuthenticationService from "@/services/AuthenticationService";
import moment from "moment"
import VueTimepicker from 'vue2-timepicker'

export default {
  components: {
    VueTimepicker
  },
  data() {
    return {
      AMOUNTBECAU_MIN: -30,
      AMOUNTBECAU_MAX: 400,
      PriceBOT: 0,
      checkOnOffBOT: true,
      checkOnOffAnGian: false,
      checkOnOffBOTGoTien: false,
      radioBC: "",
      productsFake: [
        // {e: 'admin@gmail.com', uid: 'DS9OR0KGJS', sv: 'BTC/USDT', bet: 'buy', amount: '10' }
      ],
      itemsPerPage: 10,
      isMounted: false,

      countDown: 0,
      typeOder: "OPEN",

      price_buy: 0,
      price_sell: 0,
      price_buy_mkt: 0,
      price_sell_mkt: 0,
      price_total_mkt: 0,
      price_total: 0,

      price_play_buy: 0,
      price_play_sell: 0,

      active2fa: true,
      code_2fa: "",
      sessionID: 0,
      RANDOM_SESSION: {},
      startTime: "00:00:00",
      endTime: "00:00:00",
      currentTime: 0,
      currentRandomPage: 1,
      enableRandomSession: false,
      moment
    };
  },
  computed: {
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    products() {
      return this.productsFake;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.productsFake.length;
    },

    isShowClearButton(){
      return this.startTime !== "00:00:00" || this.endTime !== "00:00:00";
    },

    RandomSessionsList(){
      return Object.keys(this.RANDOM_SESSION).filter( el => {
        return el >= this.sessionID;
      }).map((el, index) => {
        return {
          session: el,
          time: this.currentTime + index * 60 * 1000,
          kq: this.RANDOM_SESSION[el]
        }
      });
    },

    RandomSessionsShow(){
      let currentDay = moment(new Date(this.currentTime)).format("YYYY-MM-DD");
      let startTimeStamp = moment(`${currentDay} ${this.startTime}`, 'YYYY-MM-DD HH:mm:ss').valueOf();
      let endTimeStamp = moment(`${currentDay} ${this.endTime}`, 'YYYY-MM-DD HH:mm:ss').valueOf();
      if(startTimeStamp >= endTimeStamp){
        endTimeStamp = endTimeStamp + 24 * 60 * 60 * 1000;
      }

      return this.RandomSessionsList.filter((ss, index) => {
        index;
        let ssTime = ss.time;
        return (ssTime >=  startTimeStamp) && (ssTime <= endTimeStamp);
      });
    },

    RandomSessionsPage(){
      let from = (this.currentRandomPage - 1) * 10;
      return this.RandomSessionsShow.slice(from, from + 10);
    },

    totalRandomPage(){
      const length  = this.RandomSessionsShow.length;
      return Math.floor(length / 10) + (length % 10 ? 1 : 0);
    },
  },
  watch: {},
  methods: {

     toggleRandomSession(){
      const newEnableRandomSession = !this.enableRandomSession;
      this.enableRandomSession = newEnableRandomSession;
      this.sendMessage({type: 'editGL', data: {type: 'TOGGLE_ENABLE_SESSION', val: newEnableRandomSession}})
      return this.$vs.notify({
        text: `${newEnableRandomSession ? 'Bật' : 'Tắt'} sinh phiên ngẫu nhiên`,
        color:'success',
        position:'top-center',
        iconPack: 'feather',
        icon:'icon-message-square'});
    },

    clearFilter(){
     this.startTime = "00:00:00";
     this.endTime = "00:00:00";

    },

    changeRandomPage(){

    },
    openPage() {
      this.$vs.loading({
        container: ".loading-btn",
        scale: 0.45,
      });
      AuthenticationService.check2fa({ t: this.code_2fa })
        .then((res) => {
          if (res.data.success == 1) {
            this.active2fa = false;
            return;
          } else if (res.data.success == 2) {
            return this.$vs.notify({
              text: "Mã xác 2FA không chính xác",
              color: "danger",
              position: "top-right",
              iconPack: "feather",
              icon: "icon-message-square",
            });
          }
          else if(res.data.success == 4){
            this.$router.push({name: "page-login"});
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setTimeout(
            ()=>{
              this.$vs.loading.close(".loading-btn > .con-vs-loading")
            },
            1000
          );
        });
    },
    sbAmountBeCauMin() {
      this.sendMessage({
        type: "editGL",
        data: {
          type: "WRITE_AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE",
          AMOUNT: this.AMOUNTBECAU_MIN,
        },
      });
      return this.$vs.notify({
        text: "Đã thay đổi thành " + this.AMOUNTBECAU_MIN,
        color: "success",
        position: "top-center",
        iconPack: "feather",
        icon: "icon-message-square",
      });
    },

    sbAmountBeCauMax() {
      this.sendMessage({
        type: "editGL",
        data: {
          type: "WRITE_AMOUNT_MAX_BREAK_BRIDGE",
          AMOUNT: this.AMOUNTBECAU_MAX,
        },
      });
      return this.$vs.notify({
        text: "Đã thay đổi thành " + this.AMOUNTBECAU_MAX,
        color: "success",
        position: "top-center",
        iconPack: "feather",
        icon: "icon-message-square",
      });
    },

    changeBOTOnOff() {
      this.sendMessage({ type: "editGL", data: { type: "BOT" } });

      if (this.checkOnOffBOT) {
        return this.$vs.notify({
          text: "BOT đã được TẮT",
          color: "success",
          position: "top-center",
          iconPack: "feather",
          icon: "icon-message-square",
        });
      } else {
        return this.$vs.notify({
          text: "BOT đã được BẬT",
          color: "success",
          position: "top-center",
          iconPack: "feather",
          icon: "icon-message-square",
        });
      }
    },

    changeBetOnOff() {
      this.radioBC = "off";

      this.checkOnOffBOTGoTien = false;

      if (this.checkOnOffAnGian) {
        this.sendMessage({ type: "editGL", data: { type: "BTC_OFF" } });

        return this.$vs.notify({
          text: "Đã thay đổi thành TẮT",
          color: "success",
          position: "top-center",
          iconPack: "feather",
          icon: "icon-message-square",
        });
      } else {
        this.sendMessage({ type: "editGL", data: { type: "BTC_LESS" } });

        return this.$vs.notify({
          text: "Đã thay đổi thành BẬT",
          color: "success",
          position: "top-center",
          iconPack: "feather",
          icon: "icon-message-square",
        });
      }
    },

    reloadAmTien() {
      this.sendMessage({ type: "editGL", data: { type: "GO_TIEN_OFF" } });
    },

    changeMode(val) {
      this.checkOnOffAnGian = false;

      if (val == "buy") {
        this.sendMessage({ type: "editGL", data: { type: "BTC_BUY" } });
        val = "MUA";
      }
      if (val == "sell") {
        this.sendMessage({ type: "editGL", data: { type: "BTC_SELL" } });
        val = "BÁN";
      }
      if (val == "off") {
        this.sendMessage({ type: "editGL", data: { type: "BTC_OFF" } });
        val = "TẮT";
      }

      return this.$vs.notify({
        text: "Đã thay đổi thành " + val,
        color: "success",
        position: "top-center",
        iconPack: "feather",
        icon: "icon-message-square",
      });
    },

    formatPrice(value, minimum) {
      var formatter = new Intl.NumberFormat("en-US", {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum,
      });
      return formatter.format(value);
    },

    // getAmountDecimal(type, money){
    //   let cur = '$'
    //   let coin = type.toUpperCase()
    //   if(coin == 'BTC') return cur+money.toFixed(6)
    //   if(coin == 'ETH') return cur+money.toFixed(4)
    //   return cur+money.toFixed(2)
    // },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },

    sendMessage(message) {
      this.connection.send(JSON.stringify(message));
    },

    changeRadioGetSV(dl) {
      this.radioBC = "";

      if (dl.BTC.BUY) {
        this.radioBC = "buy";
      } else if (dl.BTC.SELL) {
        this.radioBC = "sell";
      } else if (!dl.BTC.BUY && !dl.BTC.SELL) {
        this.radioBC = "off";
      }

      if (dl.ENABLE_SESSION) {
        this.enableRandomSession = dl.ENABLE_SESSION;
      }

      if (dl.LESS_WIN) {
        this.checkOnOffAnGian = true;
      } else {
        this.checkOnOffAnGian = false;
      }

      if (dl.PRICE_FUND_ON_OFF) {
        this.checkOnOffBOTGoTien = true;
      } else {
        this.checkOnOffBOTGoTien = false;
      }

      if (dl.BOT) {
        this.checkOnOffBOT = true;
      } else {
        this.checkOnOffBOT = false;
      }
    },

    changeBOTGoTienOnOff() {
      this.checkOnOffAnGian = false;
      this.radioBC = "off";

      this.sendMessage({ type: "editGL", data: { type: "BOT_GO_TIEN" } });

      if (this.checkOnOffBOTGoTien) {
        return this.$vs.notify({
          text: "BOT gỡ tiền đã được TẮT",
          color: "success",
          position: "top-center",
          iconPack: "feather",
          icon: "icon-message-square",
        });
      } else {
        return this.$vs.notify({
          text: "BOT gỡ tiền đã được BẬT",
          color: "success",
          position: "top-center",
          iconPack: "feather",
          icon: "icon-message-square",
        });
      }
    },

    sendInfoAdmin() {
      this.sendMessage({
        type: "accountDetail",
        data: { uid: "ADMIN_BO", email: "ad999999@gmail.com" },
      });
    },
  },
  created() {
    // if(!moduleDataList.isRegistered) {
    //   this.$store.registerModule('dataList', moduleDataList)
    //   moduleDataList.isRegistered = true
    // }

    //this.$store.registerModule('dataList', this.productsFake);

    //this.$store.dispatch("dataList/fetchDataListItems")
    //console.log(this.productsFake);
    //console.log(this.$store.state.dataList);
    var _this = this;
    this.connection = new WebSocket(config.BASE_URL_SOCKET + `?token=${localStorage.getItem('token')}`);

    this.connection.onopen = function () {
      _this.sendInfoAdmin();
      console.log("Successfully connected to the echo websocket server...");
    };

    this.connection.onmessage = function (event) {
      let data = JSON.parse(event.data);
      let dl = data.data;

      if (data.type === "get_config") {
        _this.countDown = dl.time;
        _this.typeOder = dl.time < 10 ? "PENDING" : "OPEN";
        _this.currentTime = dl.gameTime
        // reset lại số tiền = 0 khi thời gian = 0;
        if (dl.candleClose == 0) {
          _this.price_buy = 0;
          _this.price_sell = 0;
        }
      }

      if (data.type === "getTruck") {
        _this.changeRadioGetSV(dl);
        _this.AMOUNTBECAU_MIN = data.min_am_go;
        _this.AMOUNTBECAU_MAX = data.max_amount_be;
      }

      if (data.type === "truck") {
        _this.productsFake = dl;
        _this.price_buy = _this.formatPrice(data.price_buy, 2);
        _this.price_sell = _this.formatPrice(data.price_sell, 2);
        _this.price_buy_mkt = _this.formatPrice(data.mktBUY, 2);
        _this.price_sell_mkt = _this.formatPrice(data.mktSELL, 2);
        _this.price_total_mkt = _this.formatPrice(
          data.mktBUY + data.mktSELL,
          2
        );

        let tt =
          data.price_buy + data.price_sell - (data.mktBUY + data.mktSELL);

        _this.price_play_buy = _this.formatPrice(
          data.price_buy - data.mktBUY,
          2
        );
        _this.price_play_sell = _this.formatPrice(
          data.price_sell - data.mktSELL,
          2
        );
        _this.price_total = _this.formatPrice(tt, 2);
      }

      if(data.type === 'static'){
        _this.sessionID = data.data.ss;
      }

      if(data.type === 'random'){
        _this.RANDOM_SESSION = data.RANDOM_SESSION;
      }
    };

    // AuthenticationService.checkOn2fa()
    //   .then((res) => {
    //     if (res.data.success == 1) {
    //       this.active2fa = res.data.on_2fa;
    //     } else {
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss">
#list-edit-result {
  .vue__time-picker .dropdown ul li:not([disabled]).active{
    // background: rgb(var(--vs-primary));
  }

  .vue__time-picker .dropdown{
    z-index: 1000;
  }
  .vs-switch {
    border: 1px solid #fff;
  }
  .vs-con-table {
    /*
      Below media-queries is fix for responsiveness of action buttons
      Note: If you change action buttons or layout of this page, Please remove below style
    */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>
<style scoped>
.tbv {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  color: #000;
}
.tbv tr {
  background-color: #f6f6f6;
}
.tbv td,
.tbv th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
.tbv tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
