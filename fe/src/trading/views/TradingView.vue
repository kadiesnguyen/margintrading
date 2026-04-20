<template>
  <div style="padding-top: 44px;">
    <!-- TRADE CONTAINER -->
    <div class="trade-container">
      <div class="wrapper">
        <!-- TRADE HEADER (currency + stats) -->
        <div class="container trade_header !mt-[1px]">
          <!-- Currency Selector -->
          <div class="trade_header_item_select">
            <div class="select_element" @click="toggleCurrencyMenu">
              <div class="select_element_name">
                <p>{{ currentSymbol }}</p>
                <div class="Iconrowdown">
                  <i class="fa fa-chevron-down" style="color:#fff;font-size:12px;"></i>
                </div>
              </div>
              <div class="select_element_option_wrapper" :class="{ select_element_option_wrapper_active: showCurrencyMenu }">
                <div
                  v-for="sym in symbols"
                  :key="sym"
                  class="select_element_option"
                  @click.stop="selectSymbol(sym)"
                >{{ sym }}</div>
              </div>
            </div>
          </div>

          <!-- Price on mobile -->
          <div class="trade_header_item trade_header_item_price_sp">
            <div class="price" :style="{ color: priceColor }">{{ prevDayPrice.lastPrice }}</div>
            <div class="sub-price" :style="{ color: priceColor }">{{ prevDayPrice.priceChangePercent }}%</div>
          </div>

          <!-- Price on desktop -->
          <div class="trade_header_item trade_header_item_price_pc">
            <p class="trade_header_item_title">Price</p>
            <div class="trade_header_item_content" :style="{ color: priceColor }">
              {{ prevDayPrice.lastPrice }}
            </div>
          </div>

          <div class="trade_header_item">
            <p class="trade_header_item_title">24h Change</p>
            <div class="trade_header_item_content" :style="{ color: priceColor }">
              {{ prevDayPrice.priceChange }} {{ prevDayPrice.priceChangePercent }}%
            </div>
          </div>
          <div class="trade_header_item">
            <p class="trade_header_item_title">24h High</p>
            <div class="trade_header_item_content">{{ prevDayPrice.highPrice }}</div>
          </div>
          <div class="trade_header_item">
            <p class="trade_header_item_title">24h Low</p>
            <div class="trade_header_item_content">{{ prevDayPrice.lowPrice }}</div>
          </div>
          <div class="trade_header_item">
            <p class="trade_header_item_title">24h Vol(BTC)</p>
            <div class="trade_header_item_content">{{ prevDayPrice.volume }}</div>
          </div>
          <div class="trade_header_item">
            <p class="trade_header_item_title">24h Vol(USDT)</p>
            <div class="trade_header_item_content">{{ prevDayPrice.quoteVolume }}</div>
          </div>
        </div>

      </div>

      <!-- MAIN CONTENT -->
      <div class="container trade_ctncontent">
        <div class="trade_stock_wrapper">
          <!-- CHART AREA -->
          <div class="chart-wrapper" v-show="menuTopHeader === 0">
            <draw-tool />
            <div class="chartBox">
              <div class="wap-chart" ref="chartContainer"></div>
            </div>
          </div>

          <!-- RIGHT PANEL: Order book + Betting -->
          <div class="trade_ctncontent_right_top">
            <!-- Order Book -->
            <div class="trada_parameter" :class="menuTopHeader === 0 ? 'trada_parameter_hidden_sp' : ''">
              <!-- Asks (sell orders) -->
              <div v-show="!isMobile || menuTopHeader === 1" class="trada_parameter_left">
                <div class="parameter_left_row">
                  <div class="parameter_title_wrapper">
                    <div class="top_colum_title">Price(USDT)</div>
                    <div class="text-right top_colum_title">Amt(BTC)</div>
                    <div class="text-right top_colum_title">Total</div>
                  </div>
                  <div
                    v-for="(ask, i) in depthPrice.asks"
                    :key="'ask-'+i"
                    class="parameter_content"
                  >
                    <div class="colum_number colum_number_red">{{ ask.price }}</div>
                    <div class="text-right colum_number">{{ ask.amout }}</div>
                    <div class="text-right colum_number">{{ formatNumber(ask.price * ask.amout, 2, 2) }}</div>
                  </div>
                </div>
                <div class="parameter_left_body">
                  <p :style="{ color: depthPrice.best.type === 'sell' ? '#f13a3a' : '#5be584' }">
                    {{ depthPrice.best.price }}
                  </p>
                </div>
                <div class="parameter_left_row">
                  <div
                    v-for="(bid, i) in depthPrice.bids"
                    :key="'bid-'+i"
                    class="parameter_content"
                  >
                    <div class="colum_number colum_number_green">{{ bid.price }}</div>
                    <div class="text-right colum_number">{{ bid.amout }}</div>
                    <div class="text-right colum_number">{{ formatNumber(bid.price * bid.amout, 2, 2) }}</div>
                  </div>
                </div>
              </div>

              <!-- Giao dịch tab (history for mobile) -->
              <div v-show="!isMobile || menuTopHeader === 2" class="trada_parameter_right">
                <div class="parameter_left_row">
                  <div class="parameter_title_wrapper">
                    <div class="top_colum_title">Price(USDT)</div>
                    <div class="text-right top_colum_title">Amt(BTC)</div>
                    <div class="text-right top_colum_title">Time (UTC)</div>
                  </div>
                  <transition-group name="trade-row" tag="div" style="display:block;width:100%;">
                    <div
                      v-for="item in depthPrice.total"
                      :key="item.id"
                      style="display:flex;width:100%;padding:2px 12px;"
                    >
                      <span style="flex:0 0 34%;overflow:hidden;font-size:11px;font-weight:510;line-height:12px;" :style="{ color: item.isBuy ? '#5be584' : '#f13a3a' }">{{ item.price }}</span>
                      <span style="flex:0 0 36%;overflow:hidden;font-size:11px;font-weight:510;line-height:12px;color:#f4f6f8;">{{ item.amout }}</span>
                      <span style="flex:0 0 30%;overflow:hidden;font-size:11px;font-weight:510;line-height:12px;color:#f4f6f8;text-align:right;display:block;">{{ item.time }}</span>
                    </div>
                  </transition-group>
                </div>
              </div>
            </div>

            <!-- Betting Controls -->
            <div class="trande_levels">
              <!-- Session info -->
              <div class="trande_levels_groupbutton">
                <div class="info-trade-area">
                  <div class="info-user">
                    <p>Thời gian: {{ timeNow }}</p>
                    <p class="text-right">Phiên giao dịch: {{ session }}</p>
                  </div>
                  <div class="session-wrapper">
                    <p class="text-yellow">{{ textTimeDown }}: {{ seconDown }}s</p>
                  </div>
                </div>
              </div>

              <!-- Amount buttons -->
              <div class="trande_levels_groupbutton" style="padding-top:10px;">
                <div
                  v-for="(opt, i) in optionDatLenh"
                  :key="'opt-'+i"
                  class="levels_button"
                  :class="{ levels_button_active: betAmount === opt.value }"
                  @click="betAmount = opt.value"
                >
                  <div class="levels_button_secon">{{ opt.label }}</div>
                </div>
              </div>

              <!-- Buy/Sell buttons -->
              <div class="trande_levels_groupupdown">
                <div class="groupupdown_columm">
                  <div
                    class="groupupdown_columm_button button_green"
                    :class="{ disabled: seconDown <= 10 }"
                    @click="BetBuySell('buy')"
                  >
                    <p class="columm_button_text">Tăng (90%)</p>
                  </div>
                </div>
                <div class="groupupdown_columm">
                  <div class="groupupdown_columm_button">
                    <input
                      v-model="betAmount"
                      class="column_number_input"
                      placeholder="Amount"
                      type="number"
                    />
                  </div>
                </div>
                <div class="groupupdown_columm">
                  <div
                    class="groupupdown_columm_button button_red"
                    :class="{ disabled: seconDown <= 10 }"
                    @click="BetBuySell('sell')"
                  >
                    <p class="columm_button_text">Giảm (90%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- HISTORY SECTION -->
        <div class="trade_history_wrapper">
          <div class="trade_hitory_switch">
            <div class="switch_button" :class="{ active: toggleHistory === 0 }" @click="toggleHistory = 0">Lịch sử</div>
            <div class="switch_button" :class="{ active: toggleHistory === 1 }" @click="toggleHistory = 1">Thống kê</div>
          </div>

          <!-- Lịch sử -->
          <div v-show="toggleHistory === 0" class="trader_history">
            <h2 class="trader_history_title">Lịch sử</h2>
            <div class="trader_history_scroll">
              <div
                v-for="(item, i) in orderHistoryData"
                :key="'hist-'+i"
                class="trader_history_items"
              >
                <div class="history_item">
                  <p class="history_item_title">{{ item.oss }}</p>
                  <div class="history_item_content">
                    <h3 class="history_item_content_title">{{ item.cu }}</h3>
                  </div>
                </div>
                <div class="history_item">
                  <p class="history_item_title">{{ formatDate(item.d) }}</p>
                  <div class="history_item_content">
                    <h3
                      class="history_item_content_title"
                      :class="item.kq === 'sell' ? 'ctdcl_red' : 'ctdcl_green'"
                    >{{ item.kq === 'sell' ? 'Giảm' : 'Tăng' }}</h3>
                  </div>
                </div>
                <div class="history_item">
                  <p class="history_item_title">Giá trị</p>
                  <div class="history_item_content">
                    <h3 class="history_item_content_title">{{ formatPrice(item.betAmount, 0) }}</h3>
                  </div>
                </div>
                <div class="history_item">
                  <p class="history_item_title">Kết quả</p>
                  <div class="history_item_content">
                    <h3
                      class="history_item_content_title"
                      :class="item.result === 'win' ? 'ctdcl_green' : item.result === 'lose' ? 'ctdcl_red' : 'ctdcl_yellow'"
                    >{{ item.result === 'win' ? 'Thắng' : item.result === 'lose' ? 'Thua' : 'Chờ' }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thống kê -->
          <div v-show="toggleHistory === 1" class="trade_ctncontent_right_bottom">
            <h2 class="trader_ctncontent_title">Thống kê</h2>
            <table>
              <tr>
                <th><div class="th_title" style="padding-left:0">Phiên</div></th>
                <th><div class="th_title">Giá đóng</div></th>
                <th><div class="th_title" style="padding-right:0">Kết quả</div></th>
              </tr>
              <tr v-for="(item, i) in staticData" :key="'stat-'+i">
                <td>
                  <div class="td_content">
                    <span class="td_text" style="text-align:left">{{ item.session }}</span>
                  </div>
                </td>
                <td>
                  <div class="td_content">
                    <span class="td_text">{{ item.price }}</span>
                  </div>
                </td>
                <td>
                  <div class="td_content">
                    <span class="td_text" :class="item.kq === 'sell' ? 'td_text_red' : 'td_text_green'" style="text-align:right">
                      {{ item.kq === 'sell' ? 'Giảm' : 'Tăng' }}
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DrawTool from '../components/DrawTool.vue'
import ReconnectingWebSocket from 'reconnecting-websocket'
import serverConfig from '@/config.json'
import { getUserInfo } from '@/client/api/userApi'
import store from '@/client/store'
import helper from '@/client/helper'
import Highcharts from 'highcharts'
import HighchartsStock from 'highcharts/modules/stock'
import HighchartsIndicators from 'highcharts/indicators/indicators-all'
import HighchartsMore from 'highcharts/highcharts-more'

HighchartsStock(Highcharts)
HighchartsIndicators(Highcharts)
HighchartsMore(Highcharts)

export default {
  name: 'TradingView',
  components: { DrawTool },

  data() {
    const isMobile = window.innerWidth <= 768
    return {
      isShowRightMenu: false,
      menuTopHeader: 0,
      toggleHistory: 0,
      showCurrencyMenu: false,
      currentSymbol: 'ETHUSDT',
      symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'NEARUSDT', 'DOTUSDT'],
      betAmount: 50000,
      session: 0,
      seconDown: 60,
      textTimeDown: 'Đếm ngược',
      timeNow: new Date().toLocaleDateString('vi-VN'),
      isMobile,
      prevDayPrice: {
        lastPrice: '0',
        openPrice: '0',
        priceChange: '0',
        priceChangePercent: '0',
        highPrice: '0',
        lowPrice: '0',
        volume: '0',
        quoteVolume: '0',
      },
      depthPrice: {
        asks: [],
        bids: [],
        best: { price: 0, type: '' },
        total: [],
      },
      orderHistoryData: [],
      staticData: [],
      optionDatLenh: [
        { label: '50K', value: 50000 },
        { label: '100K', value: 100000 },
        { label: '500K', value: 500000 },
        { label: '1M', value: 1000000 },
        { label: '2M', value: 2000000 },
        { label: '5M', value: 5000000 },
        { label: '10M', value: 10000000 },
        { label: '20M', value: 20000000 },
        { label: '50M', value: 50000000 },
        { label: '100M', value: 100000000 },
        { label: '200M', value: 200000000 },
        { label: '500M', value: 500000000 },
      ],
      // Chart data
      candleData: [],
      volumeData: [],
      chart: null,
      wsReady: false,
      connection: null,
      binanceWs: null,
      binanceWs2: null,
      tradeSeq: 0,
      tmp: {},
      nowTime: 0,
      gameTime: 0,
      startTime: 0,
    }
  },

  computed: {
    userInfo() {
      const u = store.getters.userInfo || {}
      return { ...u, balance: u.balance || 0, username: u.username || '' }
    },
    priceColor() {
      const change = parseFloat(this.prevDayPrice.priceChange)
      return change >= 0 ? '#5be584' : '#f13a3a'
    },
  },

  mounted() {
    this.initChart()
    this.initWebSocket()
    this.initBinanceWebSocket()
    this.fetchUserInfo()
    setInterval(() => {
      this.timeNow = new Date().toLocaleDateString('vi-VN')
    }, 1000)
  },

  beforeDestroy() {
    if (this.connection) this.connection.close()
    if (this.binanceWs) this.binanceWs.close()
    if (this.binanceWs2) this.binanceWs2.close()
    if (this.chart) this.chart.destroy()
  },

  methods: {
    initChart() {
      const el = this.$refs.chartContainer
      if (!el) return

      const isMobile = this.isMobile
      const colorDown = '#e54150'
      const colorUp = '#23a776'

      this.chart = Highcharts.stockChart(el, {
        chart: {
          panning: false,
          followTouchMove: false,
          width: null,
          height: isMobile ? '100%' : '56.25%',
          zoomType: '',
          backgroundColor: 'transparent',
          marginLeft: 0,
          marginRight: isMobile ? 60 : 80,
          marginBottom: isMobile ? 20 : 30,
          events: {},
        },
        rangeSelector: { enabled: false },
        credits: { enabled: false },
        scrollbar: { enabled: false },
        navigator: { enabled: false },
        stockTools: { gui: { enabled: false } },
        exporting: { enabled: false },
        plotOptions: {
          candlestick: {
            lineColor: colorDown,
            upLineColor: colorUp,
            color: colorDown,
            upColor: colorUp,
            pointWidth: isMobile ? 7 : 8,
            maxPointWidth: isMobile ? 7 : 8,
          },
          column: {
            minPointLength: 2,
            pointWidth: isMobile ? 7 : 8,
            maxPointWidth: isMobile ? 7 : 8,
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0,
          },
          series: {
            zIndex: 2,
            states: { inactive: { opacity: 1 } },
            allowPointSelect: false,
          },
        },
        tooltip: {
          split: false,
          enabled: true,
          animation: false,
          backgroundColor: 'rgba(8,26,52,0.5)',
          borderColor: 'transparent',
          borderWidth: 0,
          shadow: false,
          useHTML: true,
          style: { color: '#fff', fontSize: '10px' },
          formatter: function () {
            if (this.series.name === 'ETH/USDT') {
              return `<span style="margin-right:10px"><b>O</b>: ${this.point.open}</span>
                      <span style="margin-right:10px"><b>C</b>: ${this.point.close}</span><br/>
                      <span style="margin-right:10px"><b>H</b>: ${this.point.high}</span>
                      <span style="margin-right:10px"><b>L</b>: ${this.point.low}</span>`
            }
            return this.y ? `<b>Vol</b>: ${this.y}` : ''
          },
          positioner: function () { return { x: 20, y: isMobile ? 50 : 60 } },
        },
        xAxis: {
          type: 'datetime',
          labels: {
            enabled: true,
            formatter: function () { return Highcharts.dateFormat('%M:%S', this.value) },
            style: { fontSize: 10, color: '#707070' },
          },
          plotLines: [{ value: 0, color: '#ffffff', width: 0.75, id: 'current-pricex', zIndex: 1000, dashStyle: 'LongDash' }],
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: 'transparent',
          tickLength: 0,
        },
        yAxis: [
          {
            gridLineColor: '#243140',
            gridLineDashStyle: 'Dash',
            labels: {
              align: 'right',
              x: isMobile ? 45 : 50,
              style: { color: '#fff', fontSize: '11px' },
            },
            height: '83%',
            top: 0,
            plotLines: [{
              value: 0,
              color: '#ffffff',
              width: 0.75,
              id: 'current-price',
              zIndex: 100,
              label: {
                useHTML: true,
                text: '0',
                x: isMobile ? 60 : 70,
                align: 'right',
                style: { color: '#fff', fontSize: '11px', background: 'transparent', borderRadius: '4px' },
              },
            }],
            lineWidth: 0,
            resize: {
              enabled: true,
              lineColor: 'rgba(255,255,255,0.12)',
              lineWidth: 1,
            },
          },
          {
            gridLineColor: '',
            visible: false,
            top: isMobile ? '85%' : '85%',
            height: '15%',
            lineWidth: 0,
            offset: 0,
          },
        ],
        series: [
          {
            id: 'main',
            type: 'candlestick',
            name: 'ETH/USDT',
            color: colorDown,
            upColor: colorUp,
            data: this.candleData,
          },
          {
            type: 'column',
            name: 'Volume',
            data: this.volumeData,
            yAxis: 1,
          },
          {
            name: 'sma1',
            id: 'sma1',
            type: 'sma',
            linkedTo: 'main',
            color: '#2177FF',
            lineWidth: 2,
            marker: { enabled: false },
            zIndex: 3,
            enableMouseTracking: false,
            params: { index: 3, period: 10 },
          },
          {
            name: 'sma2',
            id: 'sma2',
            type: 'sma',
            linkedTo: 'main',
            color: '#E22A67',
            lineWidth: 2,
            marker: { enabled: false },
            zIndex: 3,
            enableMouseTracking: false,
            params: { index: 3, period: 5 },
          },
        ],
      })
    },

    initWebSocket() {
      const token = localStorage.getItem('userToken')
      this.connection = new ReconnectingWebSocket(
        serverConfig.BASE_URL_SOCKET + `?token=${token}`,
        [],
        { WebSocket }
      )

      this.connection.onopen = () => {
        this.wsReady = true
      }

      this.connection.onmessage = (e) => {
        const info = JSON.parse(e.data)

        if (info.type === 'get_config_history') {
          this.tmp = info.data
          this.buildCandleFromHistory(info.data)
        }

        if (info.type === 'get_config') {
          this.session = info.data.session
          this.nowTime = info.data.nowTime
          this.gameTime = info.data.gameTime
          this.startTime = info.data.gameTime + 60000
          this.seconDown = info.data.time
          this.tmp[info.data.nowTime] = info.data.price

          this.updateCurrentPrice(info.data.price)
          this.updateChartCurrentBar(info.data)
        }

        if (info.type === 'get_config_gui') {
          this.updateMarketStats(info.data)
        }

        if (info.type === 'hist_results') {
          this.staticData = info.data.slice().reverse()
        }

        if (info.type === 'checkBet') {
          this.showAlert('Thành công', 'Đã đặt lệnh thành công.', 'success', 2)
          const balance = this.userInfo.balance
          store.dispatch('updateUserInfo', { balance: balance - this.betAmount })
        }

        if (info.type === 'kq') {
          if (info.data.kq === 'win') {
            this.showAlert(`+ ${helper.formatPrice(info.data.money, 0)}`, '', 'success', 2)
            const balance = this.userInfo.balance
            store.dispatch('updateUserInfo', { balance: balance + info.data.money })
          }
          // Update history
          this.fetchOrderHistory()
        }

        if (info.type === 'mess' && info.data.type === 'bet') {
          this.showAlert('Tạm ngừng giao dịch', 'Giao dịch đã tạm ngừng', 'error', 5)
        }
      }

      this.connection.onclose = () => {
        this.wsReady = false
      }
    },

    buildCandleFromHistory(histData) {
      if (!this.chart) return
      const keys = Object.keys(histData).map(Number).sort((a, b) => a - b)
      if (keys.length < 2) return

      // Group into 1-minute OHLC bars
      const minuteMap = {}
      for (const ts of keys) {
        const minuteTs = Math.floor(ts / 60000) * 60000
        const price = parseFloat(histData[ts])
        if (!minuteMap[minuteTs]) {
          minuteMap[minuteTs] = { open: price, high: price, low: price, close: price, vol: 0 }
        } else {
          minuteMap[minuteTs].high = Math.max(minuteMap[minuteTs].high, price)
          minuteMap[minuteTs].low = Math.min(minuteMap[minuteTs].low, price)
          minuteMap[minuteTs].close = price
          minuteMap[minuteTs].vol += Math.abs(price - minuteMap[minuteTs].open)
        }
      }

      const minuteKeys = Object.keys(minuteMap).map(Number).sort((a, b) => a - b)
      const candles = minuteKeys.map(t => {
        const b = minuteMap[t]
        return [t, b.open, b.high, b.low, b.close]
      })
      const volumes = minuteKeys.map(t => [t, minuteMap[t].vol * 100 || 10])

      this.candleData = candles
      this.volumeData = volumes

      if (this.chart.series[0]) {
        this.chart.series[0].setData(candles, false)
        this.chart.series[1].setData(volumes, false)
        this.chart.redraw()
      }
    },


    updateChartCurrentBar(data) {
      if (!this.chart) return
      const price = parseFloat(data.price)
      const nowTime = data.nowTime
      const series = this.chart.series[0]
      if (!series) return

      const pts = series.points
      const lastPt = pts && pts[pts.length - 1]
      const barTime = Math.floor(nowTime / 60000) * 60000

      if (lastPt && lastPt.x === barTime) {
        const newHigh = Math.max(lastPt.high, price)
        const newLow = Math.min(lastPt.low, price)
        lastPt.update([barTime, lastPt.open, newHigh, newLow, price], true)
      } else if (!lastPt || barTime > lastPt.x) {
        const prevClose = lastPt ? lastPt.close : price
        series.addPoint([barTime, prevClose, price, price, price], true, pts && pts.length > 300)
      }

      // Update current price line
      try {
        this.chart.yAxis[0].removePlotLine('current-price')
        this.chart.yAxis[0].addPlotLine({
          value: price,
          color: '#ffffff',
          width: 0.75,
          id: 'current-price',
          zIndex: 100,
          label: {
            useHTML: true,
            text: String(price),
            x: this.isMobile ? 60 : 70,
            align: 'right',
            style: { color: '#fff', fontSize: '11px' },
          },
        })
      } catch (e) {}
    },

    updateCurrentPrice(price) {
      this.prevDayPrice.lastPrice = parseFloat(price).toFixed(2)
    },

    updateMarketStats(data) {
      const sym = data[this.currentSymbol] || data.ETHUSDT || data.BTCUSDT
      if (sym) {
        const fmt2 = (v) => v ? parseFloat(v).toFixed(2) : '0'
        const fmtComma = (v) => v ? Number(parseFloat(v).toFixed(2)).toLocaleString('en-US') : '0'
        this.prevDayPrice = {
          lastPrice: fmt2(sym.close),
          priceChange: fmt2(sym.priceChange),
          priceChangePercent: fmt2(sym.priceChangePercent),
          highPrice: fmtComma(sym.high),
          lowPrice: fmtComma(sym.low),
          volume: fmtComma(sym.volume),
          quoteVolume: fmtComma(sym.quoteVolume),
        }
      }
    },

    fetchUserInfo() {
      getUserInfo()
        .then((res) => {
          if (res.success === 1) {
            store.dispatch('setUserInfo', res.data)
          } else {
            localStorage.removeItem('userToken')
            window.location.href = window.location.origin + '/logout'
          }
        })
        .catch((error) => {
          if (error.status === 401 || error.status === 403) {
            window.open('/login', '_self')
          }
        })
    },

    fetchOrderHistory() {
      // Will be populated from WebSocket hist_results
    },

    BetBuySell(type) {
      if (!this.wsReady) {
        return this.showAlert('Không thể kết nối server', 'network: 1100', 'error')
      }
      if (this.seconDown <= 10) {
        return this.showAlert('Tạm ngừng giao dịch', 'Giao dịch đã tạm ngừng', 'error', 5)
      }
      if (this.betAmount > (this.userInfo.balance || 0)) {
        return this.showAlert('Lỗi', 'Số dư không đủ', 'error', 5)
      }

      const userData = this.userInfo
      this.connection.send(JSON.stringify({
        type: 'bet',
        data: {
          email: userData.username,
          uid: userData.uid,
          ref: userData.ref,
          UpId: userData.upid,
          typeAccount: 1,
          betAmount: this.betAmount,
          type,
          mkt: userData.mkt,
        },
      }))
    },

    initBinanceWebSocket() {
      const symbol = this.currentSymbol.toLowerCase()

      // Connection 1: depth (order book) + 24hr ticker stats
      const ws1 = new WebSocket(
        `wss://stream.binance.com/stream?streams=${symbol}@depth20@100ms/${symbol}@ticker`
      )
      ws1.onmessage = (e) => {
        const msg = JSON.parse(e.data)
        if (!msg.stream) return
        if (msg.stream.includes('@depth20')) {
          const d = msg.data
          const asks = (d.asks || []).slice(0, 5)
          const bids = (d.bids || []).slice(0, 5)
          this.depthPrice.asks = asks.slice().reverse().map(a => ({
            price: parseFloat(a[0]).toFixed(2),
            amout: parseFloat(a[1]).toFixed(4),
          }))
          this.depthPrice.bids = bids.map(b => ({
            price: parseFloat(b[0]).toFixed(2),
            amout: parseFloat(b[1]).toFixed(4),
          }))
          const bestPrice = bids.length ? parseFloat(bids[0][0]).toFixed(2) : this.prevDayPrice.lastPrice
          this.depthPrice.best = { price: bestPrice, type: 'sell' }
        }
        if (msg.stream.includes('@ticker')) {
          const t = msg.data
          const fmtComma = v => Number(parseFloat(v).toFixed(2)).toLocaleString('en-US')
          const fmt2 = v => parseFloat(v).toFixed(2)
          this.prevDayPrice.highPrice = fmtComma(t.h)
          this.prevDayPrice.lowPrice = fmtComma(t.l)
          this.prevDayPrice.volume = fmtComma(t.v)
          this.prevDayPrice.quoteVolume = fmtComma(t.q)
          this.prevDayPrice.priceChange = fmt2(t.p)
          this.prevDayPrice.priceChangePercent = fmt2(t.P)
        }
      }
      ws1.onerror = () => {}
      this.binanceWs = ws1

      // Connection 2: aggTrade for trades list
      const ws2 = new WebSocket(`wss://stream.binance.com/ws/${symbol}@aggTrade`)
      ws2.onmessage = (e) => {
        const t = JSON.parse(e.data)
        const d = new Date(t.T)
        const hh = String(d.getUTCHours()).padStart(2, '0')
        const mm = String(d.getUTCMinutes()).padStart(2, '0')
        const ss = String(d.getUTCSeconds()).padStart(2, '0')
        const entry = {
          id: ++this.tradeSeq,
          price: parseFloat(t.p).toFixed(2),
          amout: parseFloat(t.q).toFixed(8),
          time: `${hh}:${mm}:${ss}`,
          isBuy: !t.m,
        }
        if (this.depthPrice.total.length >= 30) {
          this.depthPrice.total.splice(29, 1)
        }
        this.depthPrice.total.unshift(entry)
      }
      ws2.onerror = () => {}
      this.binanceWs2 = ws2
    },

    toggleCurrencyMenu() {
      this.showCurrencyMenu = !this.showCurrencyMenu
    },

    selectSymbol(sym) {
      this.currentSymbol = sym
      this.showCurrencyMenu = false
    },

    logout() {
      localStorage.removeItem('userToken')
      window.location.href = '/login'
    },

    formatPrice: helper.formatPrice,
    formatDate: helper.formatDate,

    formatNumber(val, min, max) {
      return Number(val).toLocaleString('en-US', { minimumFractionDigits: min, maximumFractionDigits: max })
    },

    showAlert(title, text, type, seconds = 5) {
      if (typeof swal !== 'undefined') {
        swal({ title, text, type, confirmButtonText: `Xác nhận (${seconds}s)`, html: true })
      }
    },
  },
}
</script>

<style>
body { overflow-y: auto; background: #010101; }

/* Order book left panel — match reference 11px */
.trada_parameter_left .parameter_content .colum_number {
  font-size: 11px !important;
  line-height: 12px !important;
  font-weight: 510 !important;
}
.trada_parameter_left .parameter_left_body p {
  font-size: 18px !important;
  font-weight: 600 !important;
}

/* Trades tape — global overrides */
.trada_parameter_right .parameter_left_row { width: 100% !important; }
.trada_parameter_right .parameter_content { width: 100% !important; }
.trada_parameter_right .trade-price {
  width: 34% !important;
  flex-shrink: 0 !important;
}
.trada_parameter_right .trade-amt {
  width: 36% !important;
  flex-shrink: 0 !important;
  color: #e2e8f0 !important;
}
.trada_parameter_right .trade-time {
  width: 30% !important;
  flex-shrink: 0 !important;
  color: #c0cad4 !important;
  text-align: right;
}
</style>

<style scoped>
/* Drawing toolbar */
.drawing-toolbar { width: 35px; display: flex; }

/* Chart wrapper */
.chart-wrapper { display: flex; width: 100%; }
@media (min-width: 1200px) { .chart-wrapper { width: calc(100% - 610px); } }

.chartBox { width: calc(100% - 35px); }
@media (min-width: 1200px) { .chartBox { border-left: 1px solid rgba(255,255,255,0.12); height: 565px; display: block !important; } }
@media (min-width: 768px) and (max-width: 1200px) { .chartBox { height: 512px; display: block !important; } }
@media (max-width: 768px) { .chartBox { height: 375px; } }

.wap-chart { width: 100%; height: 100%; min-height: 375px; }

/* ── Right panel: Trades tape ──────────────────────── */
.trada_parameter_right {
  background: #060c12 !important;
  flex-direction: column !important;
  padding: 0 !important;
  overflow: hidden;
  height: 100%;
}
.trada_parameter_right .parameter_left_row {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}
.trada_parameter_right .parameter_title_wrapper {
  display: flex;
  width: 100%;
  padding: 4px 12px;
  background: #0d1520;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  flex-shrink: 0;
}
.trada_parameter_right .top_colum_title {
  color: #637381 !important;
  font-size: 11px !important;
  font-weight: 400;
  line-height: 12px !important;
  width: 33.3%;
  padding-bottom: 4px;
}
.trada_parameter_right .parameter_content {
  display: flex;
  width: 100%;
  padding: 2px 12px !important;
  align-items: center;
  background: #060c12;
}
.trada_parameter_right .parameter_content .colum_number {
  font-size: 11px !important;
  line-height: 12px !important;
  font-weight: 510;
  font-family: 'SF Pro', -apple-system, 'Segoe UI', monospace !important;
}

/* Slide-in from top animation */
.trade-row-enter-active {
  transition: transform 0.14s ease-out, opacity 0.14s ease-out;
}
.trade-row-enter {
  opacity: 0;
  transform: translateY(-22px);
}
</style>
