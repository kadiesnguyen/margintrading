<template>
  <div id="tradePage" class="trade-container">
      <div
      class="tradingview-widget-container"
    >
      <iframe
        scrolling="no"
        allowtransparency="true"
        frameborder="0"
        src="https://s.tradingview.com/embed-widget/ticker-tape/?locale=uk#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22title%22%3A%22Nasdaq%20100%22%7D%2C%7B%22description%22%3A%22BIT%2FJPY%22%2C%22proName%22%3A%22BITFINEX%3ABTCJPY%22%7D%2C%7B%22description%22%3A%22ASXGOLD%22%2C%22proName%22%3A%22ASX%3AGOLD%22%7D%2C%7B%22description%22%3A%22AUDSILVER%22%2C%22proName%22%3A%22FX_IDC%3AXAGAUD%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A44%2C%22utm_source%22%3A%22xgame.gd11.sunbur77.club%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22ticker-tape%22%7D"
        style="box-sizing: border-box; height: 72px; width: 100%"
        data-dashlane-frameid="3170"
      ></iframe>
    </div>
    <div class="vx-row m-0 wrapper relative">
        <div class="drawing-toolbar">
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw1.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="~@/assets/images/nunu/svgs/draw2.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw3.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw4.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw5.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw6.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw7.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__line"></div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw8.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw9.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__line"></div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw10.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw11.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw12.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw13.svg"
              style="cursor: pointer"
            />
          </div>
          <div class="drawing-toolbar__line"></div>
          <div class="drawing-toolbar__content" @click="isOpenToolbar = true">
            <img
              src="@/assets/images/nunu/svgs/draw14.svg"
              style="cursor: pointer"
            />
          </div>
        </div>
        <div class="wrapper-right-mobile">
          <div :class="['vx-col w-full relative trans']" id="left-content">
              <div class="h-full">
                  <div class="relative chartBox" ref="chart-wrapper">
                      <!-- <highcharts ref="chartStock" class="wap-chart trans" :constructor-type="'stockChart'" :options="chartOptionsStock"></highcharts> -->
                      <trading-vue
                          :width="width"
                          :height="height"
                          ref="main-chart"
                          title-txt=""
                          :overlays="overlays"
                          :data="dc"
                          :toolbar="false"
                          :color-back="colors.colorBack"
                          :color-grid="colors.colorGrid"
                          :color-text="colors.colorText"
                          :color-vol-up="colors.colorVolUp"
                          :color-vol-dw="colors.colorVolDw"
                          :timezone="7"
                      />
                      <div class="titleChartCandle flex items-center">
                          <span class="iconBTC"></span>
                          <span class="textPrice">USDT</span>
                      </div>
                      <div class="slider sidebarMobile" style="height: 180px;">
                          <div class="slidercontent">
                              <div class="backgroundOverlay" :style="`background-image: url(${require('@/assets/images/sky/overlay_left.svg')});`"></div>
                              <div class="flex flex-col justify-between " style="height: 172px; margin-left: 10px;">
                              <span class="font-12 zIndex99" style="color: #e54150">{{ CSSELL }}%</span>
                                  <vs-progress style="width: 130px;" class="bg-red progress" :height="4" :percent="CSBUY" color="#23a776"></vs-progress>
                                  <span class="font-12 zIndex99" style="color: #23a776">{{ CSBUY }}%</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div id="analysis-wrapper" class="analysis-wrapper relative">
                      <vs-tabs>
                          <vs-tab label="INDICATORS" @click="activeGau= true, activeHis=true">
                          </vs-tab>
                          <vs-tab label="LAST RESULTS" @click="activeGau=true, activeHis=false">
                          </vs-tab>
                      </vs-tabs>

                      <div class="wrap-gauge-meter" :class="{active:activeGau, hidden: !activeHis}">
                          <div class="wrap-gauge-meter-inner">
                              <div class="gauge-meter">
                                  <div class="gauge-meter-sub gauge-meter--os">
                                      <div class="v-popover gauge-meter-popover">
                                          <div class="trigger inline-block">
                                              <h3 class="gauge-meter-title">Oscillators
                                                  <span class="gauge-meter-title-icon">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><g id="c-question" transform="translate(3.068 -8.774)"><g id="Ellipse_1825" data-name="Ellipse 1825" transform="translate(-2.068 9.774)" fill="none" stroke="#fefefe" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"><circle cx="10" cy="10" r="10" stroke="none"></circle> <circle cx="10" cy="10" r="10.5" fill="none"></circle></g> <g id="question" transform="translate(3.497 13.43)"><path id="Path_30768" data-name="Path 30768" d="M8.359,10.774a4.349,4.349,0,0,1,.4-2.323,5.026,5.026,0,0,1,1.4-1.421c1.317-.981,1.876-1.491,1.876-2.54,0-1.166-.924-1.637-2.166-1.637a7.306,7.306,0,0,0-3.334.866L5.694,2.063A9.2,9.2,0,0,1,10.035,1a4.89,4.89,0,0,1,3.1.9A3,3,0,0,1,14.287,4.4,3.24,3.24,0,0,1,13.4,6.7,10.58,10.58,0,0,1,11.872,8,5.71,5.71,0,0,0,10.63,9.137a2.68,2.68,0,0,0-.315,1.637H8.359Z" transform="translate(-5.694 -1)" fill="#fefefe"></path> <ellipse id="Ellipse_1827" data-name="Ellipse 1827" cx="1.363" cy="1.284" rx="1.363" ry="1.284" transform="translate(2.252 11.56)" fill="#fefefe"></ellipse></g></g></svg>
                                                  </span>
                                              </h3>
                                          </div>
                                      </div>
                                      <h4 class="gauge-meter-sub-title">{{ textTitleOs }}</h4>
                                      <div class="gauge-meter-border">
                                          <div class="gauge-meter-background rank-2"></div>
                                          <ul class="gauge-meter-label-list">
                                              <li class="gauge-meter-label-item gauge-meter-label-item--strong-sell">
                                              strong<br>sell
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--sell active">
                                              sell
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--neutral">
                                              neutral
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--buy">
                                              buy
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--strong-buy">
                                                  strong<br>buy
                                              </li>
                                          </ul>
                                          <ul class="gauge-meter-status-list">
                                              <li class="gauge-meter-status-item">
                                                  <span class="gauge-meter-status-value gauge-meter-status-value--sell">{{ NumOscSELL }}</span>
                                                  <span class="gauge-meter-status-text">Sell</span>
                                              </li>
                                              <li class="gauge-meter-status-item">
                                                  <span class="gauge-meter-status-value gauge-meter-status-value--neutral">{{ NumOscNeutral }}</span>
                                                  <span class="gauge-meter-status-text">Neutral</span>
                                              </li>
                                              <li class="gauge-meter-status-item">
                                                  <span class="gauge-meter-status-value gauge-meter-status-value--buy">{{ NumOscBUY }}</span>
                                                  <span class="gauge-meter-status-text">Buy</span>
                                              </li>
                                          </ul>
                                          <highcharts ref="chartOs" class="gauge-meter-pane" :options="optionsOs"></highcharts>
                                      </div>
                                  </div>
                                  <div class="gauge-meter-sub gauge-meter--su">
                                      <div class="v-popover gauge-meter-popover">
                                          <div class="trigger" style="display: inline-block;">
                                              <h3 class="gauge-meter-title">
                                                          Summary
                                                          <span class="gauge-meter-title-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><g id="c-question" transform="translate(3.068 -8.774)"><g id="Ellipse_1825" data-name="Ellipse 1825" transform="translate(-2.068 9.774)" fill="none" stroke="#fefefe" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"><circle cx="10" cy="10" r="10" stroke="none"></circle> <circle cx="10" cy="10" r="10.5" fill="none"></circle></g> <g id="question" transform="translate(3.497 13.43)"><path id="Path_30768" data-name="Path 30768" d="M8.359,10.774a4.349,4.349,0,0,1,.4-2.323,5.026,5.026,0,0,1,1.4-1.421c1.317-.981,1.876-1.491,1.876-2.54,0-1.166-.924-1.637-2.166-1.637a7.306,7.306,0,0,0-3.334.866L5.694,2.063A9.2,9.2,0,0,1,10.035,1a4.89,4.89,0,0,1,3.1.9A3,3,0,0,1,14.287,4.4,3.24,3.24,0,0,1,13.4,6.7,10.58,10.58,0,0,1,11.872,8,5.71,5.71,0,0,0,10.63,9.137a2.68,2.68,0,0,0-.315,1.637H8.359Z" transform="translate(-5.694 -1)" fill="#fefefe"></path> <ellipse id="Ellipse_1827" data-name="Ellipse 1827" cx="1.363" cy="1.284" rx="1.363" ry="1.284" transform="translate(2.252 11.56)" fill="#fefefe"></ellipse></g></g></svg></span></h3> </div>
                                      </div>
                                      <h4 class="gauge-meter-sub-title">{{ textTitleSu }}</h4>
                                      <div class="gauge-meter-border">
                                          <div class="gauge-meter-background rank-3"></div>
                                          <ul class="gauge-meter-label-list">
                                              <li class="gauge-meter-label-item gauge-meter-label-item--strong-sell">
                                                  strong
                                                  <br>sell
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--sell">
                                                  sell
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--neutral active">
                                                  neutral
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--buy">
                                                  buy
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--strong-buy">
                                                  strong
                                                  <br>buy
                                              </li>
                                          </ul>
                                          <ul class="gauge-meter-status-list">
                                              <li class="gauge-meter-status-item">
                                              <span class="gauge-meter-status-value gauge-meter-status-value--sell">{{ NumSumSELL }}</span>
                                              <span class="gauge-meter-status-text">Sell</span>
                                              </li>
                                              <li class="gauge-meter-status-item">
                                              <span class="gauge-meter-status-value gauge-meter-status-value--neutral">{{ NumSumNeutral }}</span>
                                              <span class="gauge-meter-status-text">Neutral</span>
                                              </li>
                                              <li class="gauge-meter-status-item">
                                              <span class="gauge-meter-status-value gauge-meter-status-value--buy">{{ NumSumBUY }}</span>
                                              <span class="gauge-meter-status-text">Buy</span>
                                              </li>
                                          </ul>
                                          <!--  -->
                                          <highcharts class="gauge-meter-pane" :options="optionsSu" ref="chartSu"></highcharts>
                                          <!--  -->
                                      </div>
                                  </div>
                                  <div class="gauge-meter-sub gauge-meter--ma">
                                      <div class="v-popover gauge-meter-popover">
                                          <div class="trigger" style="display: inline-block;">
                                              <h3 class="gauge-meter-title">
                                                          Moving Averages
                                                          <span class="gauge-meter-title-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><g id="c-question" transform="translate(3.068 -8.774)"><g id="Ellipse_1825" data-name="Ellipse 1825" transform="translate(-2.068 9.774)" fill="none" stroke="#fefefe" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"><circle cx="10" cy="10" r="10" stroke="none"></circle> <circle cx="10" cy="10" r="10.5" fill="none"></circle></g> <g id="question" transform="translate(3.497 13.43)"><path id="Path_30768" data-name="Path 30768" d="M8.359,10.774a4.349,4.349,0,0,1,.4-2.323,5.026,5.026,0,0,1,1.4-1.421c1.317-.981,1.876-1.491,1.876-2.54,0-1.166-.924-1.637-2.166-1.637a7.306,7.306,0,0,0-3.334.866L5.694,2.063A9.2,9.2,0,0,1,10.035,1a4.89,4.89,0,0,1,3.1.9A3,3,0,0,1,14.287,4.4,3.24,3.24,0,0,1,13.4,6.7,10.58,10.58,0,0,1,11.872,8,5.71,5.71,0,0,0,10.63,9.137a2.68,2.68,0,0,0-.315,1.637H8.359Z" transform="translate(-5.694 -1)" fill="#fefefe"></path> <ellipse id="Ellipse_1827" data-name="Ellipse 1827" cx="1.363" cy="1.284" rx="1.363" ry="1.284" transform="translate(2.252 11.56)" fill="#fefefe"></ellipse></g></g></svg></span></h3> </div>
                                      </div>
                                      <h4 class="gauge-meter-sub-title">{{ textTitleMa }}</h4>
                                      <div class="gauge-meter-border">
                                          <div class="gauge-meter-background rank-3"></div>
                                          <ul class="gauge-meter-label-list">
                                              <li class="gauge-meter-label-item gauge-meter-label-item--strong-sell">
                                                  strong
                                                  <br>sell
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--sell">
                                                  sell
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--neutral active">
                                                  neutral
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--buy">
                                                  buy
                                              </li>
                                              <li class="gauge-meter-label-item gauge-meter-label-item--strong-buy">
                                                  strong
                                                  <br>buy
                                              </li>
                                          </ul>
                                          <ul class="gauge-meter-status-list">
                                              <li class="gauge-meter-status-item">
                                              <span class="gauge-meter-status-value gauge-meter-status-value--sell">{{ NumMovSELL }}</span>
                                              <span class="gauge-meter-status-text">Sell</span>
                                              </li>
                                              <li class="gauge-meter-status-item">
                                              <span class="gauge-meter-status-value gauge-meter-status-value--neutral">{{ NumMovNeutral }}</span> <span class="gauge-meter-status-text">Neutral</span>
                                              </li>
                                              <li class="gauge-meter-status-item">
                                              <span class="gauge-meter-status-value gauge-meter-status-value--buy">{{ NumMovBUY }}</span>
                                              <span class="gauge-meter-status-text">Buy</span>
                                              </li>
                                          </ul>
                                          <highcharts class="gauge-meter-pane" :options="optionsMa" ref="chartMa"></highcharts>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="historyBox" :class="{active: !activeGau, hidden: activeHis}">
                          <div class="overviewInfo flex items-center">
                              <span class="badgeItem">
                                  <span class="color-green uppercase font-bold">Tăng</span>
                                  <span> {{ totalBuyStatic }}</span>
                              </span>
                              <span class="badgeItem ml-2">
                                  <span class="color-red uppercase font-bold">Giảm</span>
                                  <span> {{ totalSellStatic }}</span>
                              </span>
                          </div>
                          <div class="ct flex justify-center">
                              <div class="vx-row">
                                  <div class="vx-col w-18 list1">
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                  </div>
                                  <div class="vx-col w-18 list2">
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                  </div>
                                  <div class="vx-col w-18 list3">
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                  </div>
                                  <div class="vx-col w-18 list4">
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                  </div>
                                  <div class="vx-col w-18 list5">
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-1 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-2 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-3 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-4 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                      <span class="gridcs-5 inline-flex m-1 item rounded-full empty"></span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
          <div class="vx-col w-full rightBar c-desktop trans" id="right-content">
              <div class="pc block">
                  <div class="mb-6">
                      <div class="wrapper-phien-cuoc">
                          <div class="session">
                              <div class="title">Phiên</div>
                              <div class="ss">{{ sessionID }}</div>
                          </div>

                          <!-- <div class="wrapper-time">
                              <div class="text">{{ textTimeDown }}</div>
                              <div class="time">{{ seconDown }}</div>
                          </div> -->
                      </div>
                      <div class="vx-row m-0 mt-3">
                          <div class="price-center">Ví tiền: {{formatPrice(blObj.balance, 0)}}</div>
                          <!-- <div>Ví tiền</div>
                          <div class="select-custom">
                              <select v-model="selectVi">
                                  <option value="0">TK Demo: {{nFormatter(blObj.blDemo, 2)}}</option>
                                  <option value="1">TK Live: {{nFormatter(blObj.blLive, 2)}}</option>
                              </select>
                          </div>
                          <div v-if="selectVi == 0" class="reset-demo mt-3" @click="reloadBalance">
                            <span>Reset tiền</span>
                            <svg ref="reload" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                          </div> -->
                      </div>
                      <div class="vx-row m-0 mt-3">
                          <div>Số tiền</div>
                          <div class="select-custom">
                              <select v-model="betAmount">
                                  <option :key="item.value" :value="item.value" v-for="item in optionDatLenh">{{item.label}}</option>
                              </select>
                          </div>
                      </div>
                  </div>
                  <div class="lg:relative mb-10">
                      <div class="text-center">
                          <div class="profitPercent color-light-blue mb-2">Lợi nhuận <span>90%</span></div>
                          <div class="profitValue color-green text-3xl font-bold">+{{ loiNhuan }}</div>
                      </div>
                  </div>
                  <div class="lg:relative mb-10 text-center">
                      <div class="text-left">
                          Chỉ báo tâm lý
                      </div>
                      <vs-progress class="bg-red" :height="4" :percent="CSBUY" color="#23a776"></vs-progress>
                      <div class="block">
                          <span class="color-green float-left">
                              {{ CSBUY }}%
                          </span>
                          <span class="color-red float-right">
                              {{ CSSELL }}%
                          </span>
                      </div>
                  </div>

                  <div class="lg:relative mb-5 mt-10 wrapper-btn-dat-lenh">
                      <vs-button size="large" @click="PreBetBuySell('buy')" :disabled="!isBet" class="w-full font-bold py-6" color="#23a776">
                      TĂNG
                          <feather-icon style="top: 5px;" icon="TrendingUpIcon" svgClasses="w-6 h-5"></feather-icon>
                      </vs-button>

                        <vs-button class="font-bold w-full my-2" color="warning" type="dark">
                            <div>{{ textTimeDown }}</div>
                            <div class="display-remain-time timer_counter second text-lg">{{ seconDown }}</div>
                        </vs-button>
                    
                      <vs-button size="large" @click="PreBetBuySell('sell')" :disabled="!isBet" class="w-full font-bold py-6" color="#e54150">
                      GIẢM
                          <feather-icon style="top: 5px;" icon="TrendingDownIcon" svgClasses="w-6 h-5"></feather-icon>
                      </vs-button>
                  </div>
              </div>
              <div class="mobile hidden">
                  <div class="sidebarPC relative">
                      <vs-progress class="bg-red" :height="4" :percent="CSBUY" color="success"></vs-progress>
                      <div class="block">
                          <span class="color-green float-left">
                              {{ CSBUY }}%
                          </span>
                          <span class="color-red float-right">
                              {{ CSSELL }}%
                          </span>
                      </div>
                  </div>
                  <div class="relative">
                      <div class="mt-1 text-center c-loinhuan">
                          Lợi nhuận
                          <span class="profitPercent color-light-blue mb-2">90%</span>
                          <span class="profitValue color-green text-2xl font-bold">+{{ loiNhuan }}</span>
                      </div>
                  </div>
                  <div class="wrapper-cuoc-mobile">
                      <div class="select-custom">
                          <select v-model="betAmount">
                              <option :key="item.value" :value="item.value" v-for="item in optionDatLenh">{{item.label}}</option>
                          </select>
                      </div>
                      <div class="session_mobile">
                          <div>Phiên</div>
                          <div class="ss">{{ sessionID }}</div>
                      </div>
                  </div>
                  <div class="relative mb-5 mt-3">
                      <div style="display: flex; align-items: center;" class="btn-mobile_1">
                          <vs-button style="flex-grow: 1" @click="PreBetBuySell('sell')" :disabled="!isBet" class="font-bold" color="#e54150">
                          GIẢM
                          </vs-button>
                          <vs-button size="small" class="font-bold" color="warning" type="dark">
                              <div>{{ textTimeDown }}</div>
                              <div class="display-remain-time timer_counter second">{{ seconDown }}</div>
                          </vs-button>
                          <vs-button style="flex-grow: 1" @click="PreBetBuySell('buy')" :disabled="!isBet" class="font-bold" color="#23a776">
                          TĂNG
                          </vs-button>
                      </div>
                  </div>
              </div>
          </div>
          <div :class="['c-body trans']" :style="`${ (isOpenSideBar && !isTablet) ? 'width: 230px' : '' }`"></div>
        </div>
    </div>

    <div class="popupCongratulation" :class="{'block': isWinPop}">
        <div class="mask"></div>
        <div class="popupCongratulationContent">
            <div class="winLive flex justify-center">
                <div class="wrapNotify congratulation h-100 ">
                    <div class="boxNotify">
                        <img :src="require('@/assets/images/sky/icon_win_live.svg')" alt="" class="iconWin">
                        <div class="badgeDemo">{{ blObj.isAccount ? 'LIVE' : 'DEMO' }}</div>
                        <div class="boxContent flex justify-center items-center flex-col">
                            <div class="flex items-center">
                                <!---->
                            </div>
                            <p class="titleWin">Xin chúc mừng!</p> <span class="message_money text-4xl font-bold">{{ moneyWin }}</span>
                        </div>
                        <span class="cursor-pointer pointer"><i class="iconClose" data-feather='x'></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <vs-popup background-color="rgba(255,255,255,.6)" class="" title="Thông báo" :active.sync="isOpenToolbar">
      <p> Tính năng chỉ dùng cho tài khoản VIP</p>
      <vs-button type="gradient" @click.stop="isOpenToolbar = false">Đồng ý</vs-button>
    </vs-popup>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import More from 'highcharts/highcharts-more'
import stockInit from 'highcharts/modules/stock'
import loadIndicatorsAll from 'highcharts/indicators/indicators'
import { isMobile, isTablet } from 'mobile-device-detect'
import getData from '@/pages/trade/navbar/components/data.json'
import config from '@/config.json'
import AuthenticationService from '@/services/AuthenticationService'

import { DataCube, TradingVue } from "trading-vue-js";
import Overlays from "tvjs-overlays";

More(Highcharts)
stockInit(Highcharts)
loadIndicatorsAll(Highcharts)

const oneDolarEqualVnd = 23710;


let timer = null

function convertTextValueMeter(t) {
    return t >= -90 && t <= -54 ? {cl: 'rank-1', text: "Strong sell", index: 1} : t > -54 && t <= -18 ? {cl: 'rank-2', text: "Sell", index: 2} : t > -18 && t <= 17 ? {cl: 'rank-3', text: "Neutral", index: 3} : t > 17 && t <= 53 ? {cl: 'rank-4', text: "Buy", index: 4} : t > 53 ? {cl: 'rank-5', text: "Strong Buy", index: 5} : void 0
}

var UP_COLOR = "#23a776",  DOWN_COLOR = "#e54150", deviceVersion = 'pc'

var progressBar = $('.e-c-progress')
var lengthp = Math.PI * 2 * 100;
progressBar.css('stroke-dasharray', lengthp)

//circle ends
//let wholeTime = 30; // manage this to set the whole time


if(isMobile){
    deviceVersion = 'mobile'
}else if(isTablet){
    deviceVersion = 'tablet';
}

var listData = [];

var chartGet = '', connected = false;


const gaugeMeterOs = {
  chart: {
        type: "gauge",
        plotBorderWidth: null,
        backgroundColor: "rgba(0,0,0,0)",
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        height: 70,
        spacingBottom: 0,
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0,
        events: {
            render(t) {
                let td = t.target.series[0].points[0].y
                let n = convertTextValueMeter(td)
                $(".gauge-meter--os .gauge-meter-background").removeClass("rank-1 rank-2 rank-3 rank-4 rank-5").addClass(n.cl)
                $(".gauge-meter--os .gauge-meter-label-item").removeClass("active")
                $(".gauge-meter--os .gauge-meter-label-item:nth-child(" + n.index + ")").addClass("active")
            }
        },
        animation: {
            duration: 1500,
            easing: "easeOutBounce"
        },

    },

    title: {
        text: ''
    },

    pane: [{
        startAngle: -90,
        endAngle: 90,
        background: null,
        center: ["50%", "105%"],
        size: 140
    }],

    credits: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    yAxis: [{
        min: -90,
        max: 90,
        minorTickPosition: "outside",
        tickPosition: "outside",
        labels: {
            rotation: "auto",
            distance: 0,
            style: {
                color: "rgba(0,0,0,0)"
            }
        },
        pane: 0,
        title: "",
        minorTickColor: "rgba(0,0,0,0)",
        lineColor: "rgba(0,0,0,0)",
        tickColor: "rgba(0,0,0,0)"
    }],


    plotOptions: {
        gauge: {
            dataLabels: {
                enabled: false
            },
            dial: {
                radius: "85%",
                baseLength: "1%",
                rearLength: 0,
                backgroundColor: {
                    linearGradient: {
                        x1: 1,
                        y1: 0,
                        x2: 0,
                        y2: 0
                    },
                    stops: [
                        [0, "#fff"],
                        [1, "#000"]
                    ]
                },
                baseWidth: 6,
                topWidth: 3
            }
        }
    },

    series: [{
        name: "Oscillator",
        data: [10],
        yAxis: 0
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 71
            },
            chartOptions: {
                chart: {
                    height: 35
                },
                pane: [{
                    size: 70
                }]
            }
        }]
    }
}

const gaugeMeterSu = {
  chart: {
        type: "gauge",
        plotBorderWidth: null,
        backgroundColor: "rgba(0,0,0,0)",
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        height: 88,
        spacingBottom: 0,
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0,
        events: {
            render(t) {
                let td = t.target.series[0].points[0].y
                let n = convertTextValueMeter(td)
                $(".gauge-meter--su .gauge-meter-background").removeClass("rank-1 rank-2 rank-3 rank-4 rank-5").addClass(n.cl)
                $(".gauge-meter--su .gauge-meter-label-item").removeClass("active")
                $(".gauge-meter--su .gauge-meter-label-item:nth-child(" + n.index + ")").addClass("active")

            }
        },
        animation: {
            duration: 1500,
            easing: "easeOutBounce"
        },

    },

    title: {
        text: ''
    },

    pane: [{
        startAngle: -90,
        endAngle: 90,
        background: null,
        center: ["50%", "105%"],
        size: 176
    }],

    credits: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    yAxis: [{
        min: -90,
        max: 90,
        minorTickPosition: "outside",
        tickPosition: "outside",
        labels: {
            rotation: "auto",
            distance: 0,
            style: {
                color: "rgba(0,0,0,0)"
            }
        },
        pane: 0,
        title: "",
        minorTickColor: "rgba(0,0,0,0)",
        lineColor: "rgba(0,0,0,0)",
        tickColor: "rgba(0,0,0,0)"
    }],


    plotOptions: {
        gauge: {
            dataLabels: {
                enabled: false
            },
            dial: {
                radius: "85%",
                baseLength: "1%",
                rearLength: 0,
                backgroundColor: {
                    linearGradient: {
                        x1: 1,
                        y1: 0,
                        x2: 0,
                        y2: 0
                    },
                    stops: [
                        [0, "#fff"],
                        [1, "#000"]
                    ]
                },
                baseWidth: 6,
                topWidth: 3
            }
        }
    },

    series: [{
        name: "Summary",
        data: [10],
        yAxis: 0
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 89
            },
            chartOptions: {
                chart: {
                    height: 44
                },
                pane: [{
                    size: 88
                }]
            }
        }]
    }
}

const gaugeMeterMa = {
  chart: {
        type: "gauge",
        plotBorderWidth: null,
        backgroundColor: "rgba(0,0,0,0)",
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        height: 70,
        spacingBottom: 0,
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0,
        events: {
            render(t) {
                let td = t.target.series[0].points[0].y
                let n = convertTextValueMeter(td)
                $(".gauge-meter--ma .gauge-meter-background").removeClass("rank-1 rank-2 rank-3 rank-4 rank-5").addClass(n.cl)
                $(".gauge-meter--ma .gauge-meter-label-item").removeClass("active")
                $(".gauge-meter--ma .gauge-meter-label-item:nth-child(" + n.index + ")").addClass("active")
            }
        },
        animation: {
            duration: 1500,
            easing: "easeOutBounce"
        },

    },

    title: {
        text: ''
    },

    pane: [{
        startAngle: -90,
        endAngle: 90,
        background: null,
        center: ["50%", "105%"],
        size: 140
    }],

    credits: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    yAxis: [{
        min: -90,
        max: 90,
        minorTickPosition: "outside",
        tickPosition: "outside",
        labels: {
            rotation: "auto",
            distance: 0,
            style: {
                color: "rgba(0,0,0,0)"
            }
        },
        pane: 0,
        title: "",
        minorTickColor: "rgba(0,0,0,0)",
        lineColor: "rgba(0,0,0,0)",
        tickColor: "rgba(0,0,0,0)"
    }],


    plotOptions: {
        gauge: {
            dataLabels: {
                enabled: false
            },
            dial: {
                radius: "85%",
                baseLength: "1%",
                rearLength: 0,
                backgroundColor: {
                    linearGradient: {
                        x1: 1,
                        y1: 0,
                        x2: 0,
                        y2: 0
                    },
                    stops: [
                        [0, "#fff"],
                        [1, "#000"]
                    ]
                },
                baseWidth: 6,
                topWidth: 3
            }
        }
    },

    series: [{
        name: "ma",
        data: [10],
        yAxis: 0
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 71
            },
            chartOptions: {
                chart: {
                    height: 35
                },
                pane: [{
                    size: 70
                }]
            }
        }]
    }
}

export default {
  components: {
    highcharts: Chart,
    TradingVue,
  },
  data() {
    return {
        overlays: [...Object.values(Overlays)],
        width: 0,
        height: 0,
        dc: new DataCube({
            chart: {
            data: [],
            settings: {
                dataIndex: 4,
            },
            indexBased: true,
            },
            onchart: [
                {
                    name: "SMA, 10",
                    type: "SMA",
                    data: [],
                    settings: {
                        length: 10
                    }
                },
                {
                    name: "SMA, 20",
                    type: "SMA",
                    data: [],
                    settings: {
                        length: 20
                    }
                },
            ],
        }),
        online: true,
        candleData: {},
        colors: {
            colorBack: "#0e0e0e",
            colorGrid: "#0e0e0e",
            colorVolDw: "#e54150",
            colorVolUp: "#23a776"
        },

      //
        thisIDPlayer: 0,
        totalBuyStatic: 0,
        totalSellStatic: 0,

        //Moving
        NumMovBUY: 0,
        NumMovSELL: 0,
        NumMovNeutral: 0,
        textTitleMa: 'NEUTRAL',

        //Oscillators
        NumOscBUY: 0,
        NumOscSELL: 0,
        NumOscNeutral: 0,
        textTitleOs: 'NEUTRAL',

        //Summary
        NumSumBUY: 0,
        NumSumSELL: 0,
        NumSumNeutral: 0,
        textTitleSu: 'NEUTRAL',

        moneyWin: 0,
        isWinPop: false,
        blObj: getData,
        isBet: true,
        CSBUY: 0,
        CSSELL: 0,
        isOrder: true,
        activeGau: false,
        activeHis: true,
        showMobileMenu: false,
        betAmount: 100000,
        optionsOs: gaugeMeterOs,
        optionsSu: gaugeMeterSu,
        optionsMa: gaugeMeterMa,
        sessionID: 0, // Mã phiên
        // chartOptions: {
        //     series: [{
        //         data: [1,2,3] // sample data
        //         }]
        // }

        betOpen: {
            "s": 0,
            "l": {
                "bet": [
                    {
                        "items": []
                    }
                ]
            },
        },
        isTablet,
        optionDatLenh: [
            { label: '100K', value: 100000 },
            { label: '250K', value: 250000 },
            { label: '500K', value: 500000 },
            { label: '1000K', value: 1000000 },
            { label: '2000K', value: 2000000 },
            { label: '3000K', value: 3000000 },
            { label: '5000K', value: 5000000 },
            { label: '10M', value: 10000000 },
            { label: '20M', value: 20000000 },
            { label: '30M', value: 30000000 },
            { label: '50M', value: 50000000 },
            { label: '100M', value: 100000000 },
            { label: '200M', value: 200000000 },
            { label: '300M', value: 300000000 },
            { label: '500M', value: 500000000 },
        ],
        selectVi: 0,
        isOpenToolbar: false,
    }
  },
  computed: {
      seconDown(){
          return getData.countDown;
      },
      textTimeDown(){
          return getData.textTimeDown;
      },
      isOpenSideBar() {
          const isOpenSideBarStore = this.$store.state.isOpenSideBar;
          return isOpenSideBarStore;
      },

      loiNhuan(){
       return this.nFormatter(this.betAmount * 1.9, 2);
    },
  },
  watch: {
    "oscillators.meter.numberValue": function() {
        this.redrawGaugeMeter("oscillators"), this.redrawGaugeMeter("summary")
    },
    "movingAverages.meter.numberValue": function() {
        this.redrawGaugeMeter("movingAverages"), this.redrawGaugeMeter("summary")
    },
    "isOpenSideBar": function (isOpenSideBarStore) {
        const tradeView = document.querySelector('.highcharts-container');
        const cDesktop = document.querySelector('.c-desktop');
        if (isTablet || isMobile) return isOpenSideBarStore;
        // if (isOpenSideBarStore) {
        //     if (tradeView) {
        //         tradeView.style.transform = `translateX(-230px)`;
        //     }
        //     if (cDesktop) {
        //         cDesktop.style.transform = `translateX(-230px)`;
        //     }
        // } else {
        //     if (tradeView) {
        //         tradeView.style.transform = `translateX(0px)`;
        //     }
        //     if (cDesktop) {
        //         cDesktop.style.transform = `translateX(0px)`;
        //     }
        // }
    },

    "selectVi": function(newVi) {
        if(newVi == 1){ // live
            localStorage.setItem('BO_BALANCE_TYPE', 'LIVE')
            getData.isAccount = 1
        }else{
            localStorage.setItem('BO_BALANCE_TYPE', 'DEMO')
            getData.isAccount = 0
        }
    }
},
  beforeDestroy() {
    this.$store.commit('TOGGLE_IS_OPEN_SIDEBAR', false);
    const tradeView = document.querySelector('.highcharts-container');
    if (tradeView) {
        tradeView.style.transform = `translateX(0px)`;
    }
  },
  methods: {

    setChartData(data) {
      let ohlcv = [];
      // let close = [];
      data.forEach((element) => {
        let time = element.date % 30000;
        // close.push(element.close);
        ohlcv.push([
          element.date - time,
          element.open,
          element.high,
          element.low,
          element.close,
          element.volume,
        ]);
      });
      this.dc.set("chart.data", ohlcv);
    },


    updateChartData(data) {
      let time = data.date % 30000;
      const ohlcv = [
        data.date - time,
        data.open,
        data.high,
        data.low,
        data.close,
        data.volume,
      ];
      this.dc.update({ candle: ohlcv });
      var counter = Number(data.candleClose)
      if(data.type === 'order'){
        this.isOrder = true
        this.isBet = true
            getData.textTimeDown = 'Hãy đặt lệnh'

        }else{
            this.isOrder = false
            this.isBet = false
            getData.textTimeDown = 'Chờ kết quả'

        }
        getData.countDown = (counter > 9 ? counter : "0" + counter)
    },

     onResize() {
        this.width = this.$refs["chart-wrapper"].offsetWidth;
        this.height = this.$refs["chart-wrapper"].offsetHeight;
        


    },
    reloadBalance() {
      this.$refs.reload.classList.add('rotate');
      AuthenticationService.reloadMoneyDemo()
      .then((res) => {
          if(res.data.success){
              this.$refs.reload.classList.remove('rotate');
              getData.blDemo = 10000000;
              this.$vs.notify({
                  text: 'Tài khoản Demo đã nạp.',
                  iconPack: 'feather',
                  icon: 'icon-check',
                  color: 'success'
              });
          }
      })
    },
    nFormatter(num, digits) {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
      });
      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    },

    disabledBet(){
        return this.isBet = !this.isBet ? true : false
    },
    // redrawGaugeMeter: function(t) {
    //     var e = void 0;
    //     (e = "oscillators" === t ? this.gaugeMeterOs : "movingAverages" === t ? this.gaugeMeterMa : this.gaugeMeterSu) && e.series && (e.series[0].points[0].update(this[t].meter.numberValue, !1), e.redraw())
    // },
    sendMessage(message) {
        this.connection.send(JSON.stringify(message));
    },

    // convertTextState(t) {
    //     switch (t) {
    //         case "buy":
    //             return h;
    //         case "sell":
    //             return u;
    //         case "neutral":
    //             return p
    //     }
    // },

    replaceAll(str, find, replace) {
        return Number(str.replace(new RegExp(find, 'g'), replace));
    },

    changeBlance(v){
        getData.balance = getData.balance - v;

    },

    checkBet(v){
        if(getData.balance < v) return true
    },

    PreBetBuySell(v) {
        this.$vs.dialog({
            color: 'success',
            title: `Bạn có chắc chắn muốn vào lệnh?`,
            text: 'Thao tác này không thể hoàn tác',
            acceptText: 'Đồng ý',
            accept: () => {
                this.BetBuySell(v);
            }
        })
    },

    BetBuySell(v){
        this.playAudio('order');

        if(getData.countDown <= 1){
            return this.$vs.notify({
                text:'Vui lòng đợi phiên sau!',
                color:'danger',
                position:'top-right',
                iconPack: 'feather',
                icon:'icon-x-circle'})
        }
        //this.isBet = false

        let gAmount = this.betAmount.toString()
        gAmount = this.replaceAll(gAmount, ',', '')

        if(this.checkBet(gAmount)){
            return this.$vs.notify({
                text:'Số dư của bạn không đủ',
                color:'danger',
                position:'top-right',
                iconPack: 'feather',
                icon:'icon-x-circle'})
        }


        let email = getData.email
        let typeAccount = 1;
        this.changeBlance(this.betAmount);
        let obj = {
            email: email,
            uid: getData.uid,
            ref: getData.ref,
            UpId: getData.upid,
            typeAccount: typeAccount, // 0: demo: 0 , 1: live
            betAmount: gAmount,
            type: v,
            mkt: getData.mkt,
            forceWin: this.$store.state.forceWin,
            //idPlayer: this.thisIDPlayer
        }


        this.sendMessage({type: 'bet', data: obj})


        let ss = this.sessionID;
        let timeGet = new Date().getTime();

        this.betOpen.s = ss
        let itp = {
                "ss": ss,
                "time": timeGet,
                "amt": gAmount,
                "type": v,
                "acc_type": typeAccount,
                "currencyType": "BTC/USD",
                "classIcon": "iconBitcoin"
            }

        this.betOpen.l.bet[0].items.push(itp);

        localStorage.setItem('stateOpen', JSON.stringify(this.betOpen));

        window.dispatchEvent(new CustomEvent('stateOpen-localstorage-changed', {
            detail: {
                storage: localStorage.getItem('stateOpen')
            }
        }));

        getData.Notify = this.betOpen.l.bet[0].items.length

        // this.clearBAmount();


        // if(v === 'buy'){

        // }else{


        //     return this.$vs.notify({
        //         text:'Đặt lệnh thành công',
        //         color:'success',
        //         position:'top-right',
        //         iconPack: 'feather',
        //         icon:'icon-check'});
        // }
    },

    deleteString(){
        let getAmount = this.betAmount.toString();
        let total  = getAmount.slice(0,-1);
        let sl = total.split(".")
        let check = sl.length-1
        if(check == 1){
            let g =  this.replaceAll(total, ',', '')
            //console.log(g)
            this.betAmount =  this.formatPrice(g, sl[1].length)
            this.tinhloinhuan(g)
            return
        }
        let g =  this.getOnlyNumberInString(total, ',', '')
        this.betAmount =  this.formatPrice(g, 0)
        this.tinhloinhuan(g)
    },

    writeBetAmountKey(v){

        let getAmount = this.betAmount.toString() + v
        let sl = getAmount.split(".")
        let check = sl.length-1
        if(v == '.'){
            this.betAmount =  getAmount
            return
        }
        if(check > 1) return
        if(check == 1){
            let g =  this.replaceAll(getAmount, ',', '')
            this.betAmount =  this.formatPrice(g, sl[1].length)
            this.tinhloinhuan(g)
            return
        }
        let a = this.getOnlyNumberInString(getAmount)
        this.betAmount =  this.formatPrice(a, 0)
        this.tinhloinhuan(a)
    },

    congBetAmount(){
        let getAmount = this.betAmount.toString()
        let sl = getAmount.split(".")
        let check = sl.length-1
        if(check > 1) return
        let tt = 0
        if(check == 1){
            tt =  this.replaceAll(getAmount, ',', '')
            let kq = tt * 2
            this.betAmount =  this.formatPrice(kq, sl[1].length)
            this.tinhloinhuan(kq)
            return
        }
        let a = this.getOnlyNumberInString(getAmount)
        tt = a * 2
        this.tinhloinhuan(tt)
        this.betAmount = this.formatPrice(tt, 0)
    },

    truBetAmount(){
        let getAmount = this.betAmount.toString()
        let sl = getAmount.split(".")
        let check = sl.length-1
        if(check > 1) return
        let tt = 0
        if(check == 1){
            tt =  this.replaceAll(getAmount, ',', '')
            let kq = tt / 2
            this.betAmount =  this.formatPrice(kq, sl[1].length)
            this.tinhloinhuan(kq)
            return
        }
        let a = this.getOnlyNumberInString(getAmount)
        tt = a / 2
        this.tinhloinhuan(tt)
        this.betAmount = this.formatPrice(tt, 0)
    },

    nhapBetAmount(e){
        let g = e.target.value
        let check = g.split(".").length-1
        if(check > 1) return

        if(check == 1){
            g = this.replaceAll(g, ',', '')
            this.tinhloinhuan(g)
            return
        }
        g = this.getOnlyNumberInString(g)
        this.betAmount = this.formatPrice(g, 0)
        this.tinhloinhuan(g)
    },

    formatPrice(value, minimum) {
        var formatter = new Intl.NumberFormat('en-US', {
            //style: 'currency',
            //currency: '',
            minimumFractionDigits: minimum
        });
        return formatter.format(value);
    },

	tinhloinhuan(m){
	    let lb = Number(m)
        lb = lb + (lb * 95 / 100)
	    // tính lợi nhuận 95%
	    this.loiNhuan = this.formatPrice(lb, 2)
	},

	getOnlyNumberInString(t) {

	    let e = t.match(/\d+/g)

	    return e ? Number(e.join("")) : 0
	},

    clearBAmount(){
        this.tinhloinhuan(10)
        this.betAmount = 10;
    },

    clickCT(amount){
        let getAmount = this.betAmount.toString();
        getAmount = this.betAmount.toString();

        if(amount == 0){
            getAmount = getData.isAccount ? getData.blLive.toString() : getData.blDemo.toString()
        }

        let check = getAmount.split(".").length-1
        if(check > 1) return

        if(check == 1){
            getAmount = this.replaceAll(getAmount, ',', '')
            let tt = getAmount + amount;
            this.tinhloinhuan(tt)
            this.betAmount = this.formatPrice(tt, 2);
            return
        }
        let aB = this.getOnlyNumberInString(getAmount);
        let tt = aB + amount;
        this.betAmount = this.formatPrice(tt, 0);
        this.tinhloinhuan(tt)

    },

    editUser() {

      //this.sidebarData = data
      this.toggleDataSidebar(true)

    },

    toggleDataSidebar(val=false) {
      this.addNewDataSidebar = val
    },

    updateBarChart(boPrice) {
        var chartInstance = chartGet;
        try{
            var lastCandle = chartInstance.series[1].points[chartInstance.series[1].points.length - 1]
            var color = this.getColor(boPrice.open, boPrice.close);
            if(lastCandle.x === boPrice.date) {
                lastCandle.update({
                    x: boPrice.date,
                    y: boPrice.volume * oneDolarEqualVnd,
                    color: color
                }, true);
            } else {
                chartInstance.series[1].addPoint({
                    x: boPrice.date,
                    y: boPrice.volume * oneDolarEqualVnd,
                    color: color
                }, true, true);
            }
        }
        catch(err) {
            console.log(err);
        } finally {
            //
        }

    },


    updateCandleStickChart(boPrice) {
                var chartInstance = chartGet;

                try{

                    var lastCandle = chartInstance.series[0].points[chartInstance.series[0].points.length - 1]
                    var color = this.getColor(boPrice.open, boPrice.close);

                    var counter = Number(boPrice.candleClose)

                    var o = {
                        x: boPrice.date,
                        open: boPrice.open.toFixed(2) * oneDolarEqualVnd,
                        high: boPrice.high.toFixed(2) * oneDolarEqualVnd,
                        low: boPrice.low.toFixed(2) * oneDolarEqualVnd,
                        close: boPrice.close.toFixed(2) * oneDolarEqualVnd,
                        vol: boPrice.volume.toFixed(2) * oneDolarEqualVnd,
                        color: color
                    };
                    if(lastCandle.x === boPrice.date) {
                        lastCandle.update(o, true);
                    } else {
                        chartInstance.series[0].addPoint(o, true, true);

                        // if(listData.length >= 200){
                        //     listData.shift();
                        // }
                        //console.log(boPrice);
                        listData.push(boPrice);
                        let begin = 0;
                        //console.log(listData);
                        const { dataMax } = chartInstance.xAxis[0].getExtremes();

                        if(deviceVersion !== 'pc') {
                            begin = this.setSizeStock(listData);
                            chartGet.xAxis[0].setExtremes(listData[begin+40]['date'], dataMax, false);
                            chartGet.redraw();
                        }else{
                            let c = listData.length;
                            chartGet.xAxis[0].setExtremes(listData[c-90]['date'], dataMax, false);
                            chartGet.redraw();
                        }

                    }
                    chartInstance.xAxis[0].options.plotLines[0].value = boPrice.date;
                    chartInstance.yAxis[0].options.plotLines[0].value = boPrice.close * oneDolarEqualVnd;

                    let f = chartInstance.yAxis[0].plotLinesAndBands[0];

                    f.label && f.label.attr({
                        text : '<div class="plotlineChart flex flex-col"><span class="price">' + this.nFormatter(boPrice.close * oneDolarEqualVnd, 3) + '</span><span class="time self-end">00:' + (counter > 9 ? counter : "0" + counter) + '</span></div>'
                    });

                    if(boPrice.type === 'order'){
                        this.isOrder = true
                        this.isBet = true
                        getData.textTimeDown = 'Hãy đặt lệnh'

                    }else{
                        this.isOrder = false
                        this.isBet = false
                        getData.textTimeDown = 'Chờ kết quả'

                    }

                    getData.countDown = (counter > 9 ? counter : "0" + counter)

                }
                catch{

                }

    },

    getColor(openPrice, closePrice) {
        return openPrice < closePrice ? UP_COLOR : DOWN_COLOR
    },

    onReceiveSocketData(boPrice) {
        this.updateCandleStickChart(boPrice);
        this.updateBarChart(boPrice);
    },

    StaOscillators(e){

        try{
            let chart = this.$refs.chartOs.chart

            let left = chart.series[0].points[0], leftVal
            //Oscillators
            this.NumOscBUY = e.b
            this.NumOscSELL = e.s
            this.NumOscNeutral = e.m

            if(e.m > e.s && e.m > e.b || e.m === e.s &&  e.m === e.b){
                this.textTitleOs = 'NEUTRAL'
                left.update(0, true);
                chart.redraw();
            }
            if(e.s > e.b){
                leftVal = -35
                this.textTitleOs = 'SELL'
                if(e.s >= 5) leftVal = -70, this.textTitleOs = 'STRONG SELL'
                left.update(leftVal, true);
                chart.redraw();
            }else if(e.s < e.b){
                leftVal = 35
                this.textTitleOs = 'BUY'
                if(e.b >= 5) leftVal = 70, this.textTitleOs = 'STRONG BUY'
                left.update(leftVal, true);
                chart.redraw();
            }
        }catch{}


    },

    StaSummary(e){

        try{
            let chart = this.$refs.chartSu.chart

            let left = chart.series[0].points[0], leftVal

            //Summary
            this.NumSumBUY = e.b
            this.NumSumSELL = e.s
            this.NumSumNeutral = e.m

            if(e.m > e.s && e.m > e.b || e.m === e.s &&  e.m === e.b){
                this.textTitleSu = 'NEUTRAL'
                left.update(0, true);
                chart.redraw();
                return
            }
            if(e.s > e.b){
                leftVal = -35
                this.textTitleSu = 'SELL'
                if(e.s >= 5) leftVal = -70, this.textTitleSu = 'STRONG SELL'
                left.update(leftVal, true);
                chart.redraw();
            }else if(e.s < e.b){
                leftVal = 35
                this.textTitleSu = 'BUY'
                if(e.b >= 5) leftVal = 70, this.textTitleSu = 'STRONG BUY'
                left.update(leftVal, true);
                chart.redraw();
            }
        }catch{}

    },

    StaMovingAverages(e){

        try
        {
            let chart = this.$refs.chartMa.chart
            let left = chart.series[0].points[0], leftVal
            //Moving

            this.NumMovBUY = e.b
            this.NumMovSELL = e.s
            this.NumMovNeutral = e.m

            if(e.m > e.s && e.m > e.b || e.m === e.s &&  e.m === e.b){
                this.textTitleMa = 'NEUTRAL'
                left.update(0, true);
                chart.redraw();
                return
            }
            if(e.s > e.b){
                leftVal = -35
                this.textTitleMa = 'SELL'
                if(e.s >= 5) leftVal = -70, this.textTitleMa = 'STRONG SELL'
                left.update(leftVal, true);
                chart.redraw();
            }else if(e.s < e.b){
                leftVal = 35
                this.textTitleMa = 'BUY'
                if(e.b >= 5) leftVal = 70, this.textTitleMa = 'STRONG BUY'
                left.update(leftVal, true);
                chart.redraw();
            }
        }catch{}

    },

    // setSizeStock(){
    setSizeStock(data){
        var chartWidth = parseInt($('.chartBox').width());

        let numBar = Math.floor((chartWidth - 90) / 19.44); //90 17.44 13.44
        if(numBar < data.length) {
            return data.length - numBar - 40;
        }

        // var chartWidth = parseInt($('.chartBox').width());
        // if (chartWidth < 400) {
        //     return 65;
        // }

        // if (chartWidth > 400 && chartWidth < 800) {
        //     return 95;
        // }
    },


    onWindowLoad(){

        let uidLive  = getData.uidLive
        let uidDemo = getData.uidDemo
        let uidAcc = 0

        let acc = localStorage.getItem('BO_BALANCE_TYPE')
        if(acc == 'LIVE'){
            getData.isAccount = 1
        }else{
            getData.isAccount = 0
        }

        getData.isAccount ? uidAcc = uidLive : uidAcc = uidDemo

        this.sendMessage({type: 'accountDetail', data: {uid: uidAcc, email: getData.email}});

        let notify = JSON.parse(localStorage.getItem('stateOpen'));
        if(notify){
             getData.Notify = notify.l.bet[0].items.length
        }

    },

    addSound(){
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.registerSounds([
            {
                id: "win",
                src: require('@/assets/sounds/win-n.mp3')
            }, {
                id: "lose",
                src: require('@/assets/sounds/lose-n.mp3')
            }, {
                id: "order",
                src: require('@/assets/sounds/order-n.mp3')
            }
        ]);
    },


    playAudio(v){
        let checkSound = localStorage.getItem('SOUND');
        if(checkSound === 'false') return;
        createjs.Sound.play(v);

        // let sound;
        // if(v == 'win'){
        //    // sound = require('@/assets/sounds/win-n.mp3');
        // }else if(v == 'lose'){
        //   //  sound = require('@/assets/sounds/lose-n.mp3');
        // }else if(v == 'order'){
        //    // sound = require('@/assets/sounds/order-n.mp3');
        // }
        // var audio = new Audio(sound);
        // audio.play();



    },

    getUserInfo(){

        AuthenticationService.getInfoUser()
        .then((res) => {
            //  console.log(balance);
            if(res.data.success == 1){
                let gData = res.data.data
                getData.uid= gData.u_id,
                getData.email= gData.email,
                getData.profile_image= gData.profile_image,
                getData.displayName= gData.name,
                getData.vip= gData.vip,
                getData.vip_lv= gData.level_vip,
                getData.pen_commiss= gData.pending_commission,
                getData.ref= gData.ref,
                getData.c2fa= gData.fa2,
                getData.id_front= gData.id_front,
                getData.id_back= gData.id_back,
                getData.first_name= gData.first_name,
                getData.last_name= gData.last_name,
                getData.verify= gData.verify,
                getData.num_secu= gData.num_secury,
                getData.country= gData.c,
                getData.mkt = gData.mkt
                getData.balance = gData.balance
                localStorage.setItem('INFO', JSON.stringify(gData))
            }else{
                window.location.href = window.location.origin + '/login'
            }
        });
    }

  },
  created() {

    if(!connected){

        connected = true;

        this.connection = new WebSocket(config.BASE_URL_SOCKET);

        //this.$store.connected = this.connection

        this.connection.onopen = function() {
            //console.log("Successfully connected to the echo websocket server...")
            this.onWindowLoad();
            this.getUserInfo();
        }.bind(this);

        this.connection.onmessage = function(event) {
            let data = JSON.parse(event.data)

            let dl = data.data;


            if(data.type === 'getListDauTien'){

                if(!!dl){
                    listData = dl;
                     this.setChartData(dl);
                    // this.getDataDefaultGet(dl);
                }

            }
            if(data.type === 'getidPlayer'){
                this.thisIDPlayer = data.data;
            }
            if(data.type === 'allData'){
                this.candleData = data.data;
                this.updateChartData(data.data);
                // this.onReceiveSocketData(dl);
            }
            if(data.type === 'transVolum'){
                if(dl.nbuy){
                    this.CSBUY = dl.ptbuy
                    this.CSSELL = dl.ptsell
                }
            }
            if(data.type === 'checkBet'){
                this.isBet = true
                return this.$vs.notify({
                    text:'Đặt lệnh thành công',
                    color:'success',
                    position:'top-right',
                    iconPack: 'feather',
                    icon:'icon-check'});
            }
            if(data.type === 'kq'){
                //console.log(dl);
                if(this.$store.state.forceWin || dl.kq == 'win'){
                    let mn = dl.money

                    this.playAudio('win');

                    getData.balance += mn;

                    this.moneyWin = this.nFormatter(mn, 2)
                    this.isWinPop = true
                    setTimeout(() => {
                        this.isWinPop = false
                    }, 3000)
                }else{
                    this.playAudio('lose');
                }
                // xóa notice = 0
                getData.Notify = 0;
                this.betOpen.l.bet[0].items = [];
                localStorage.removeItem('stateOpen');
                window.dispatchEvent(new CustomEvent('stateOpen-localstorage-changed', {
                    detail: {
                        storage: undefined
                    }
                }));
            }
            if(data.type === 'mess'){
                if(dl.type == 'bet'){
                    return this.$vs.notify({
                        text: dl.mess,
                        color: dl.style,
                        position:'top-right',
                        iconPack: 'feather',
                        icon:'icon-x-circle'})
                }

                if(dl.type  === 'disAccount'){
                    // đăng xuất tài khoản
                    setTimeout(() => {
                        localStorage.removeItem('tokenUser');
                        localStorage.removeItem('INFO');
                        getData.Notify = 0;
                        localStorage.removeItem('stateOpen');
                        window.location.href = window.location.origin + '/login';
                    }, 3000);
                    return this.$vs.notify({
                            text: dl.mess,
                            color: dl.style,
                            position:'top-right',
                            iconPack: 'feather',
                            icon:'icon-x-circle'});
                }

                if(dl.type  === 'reloadAccount'){
                    location.reload();
                }
            }
            if(data.type === 'static'){
                this.sessionID = data.data.ss;
                let indicato = data.load



                this.StaOscillators(indicato.Oscillators)
                this.StaSummary(indicato.Summary)
                this.StaMovingAverages(indicato.Moving)

                //this.totalBuyStatic = dl.cbuy;
                //this.totalSellStatic = dl.csell;

                let sta = dl.static

                let stl = sta.length
                let istart = 0;
                let csl = 40;
                this.totalBuyStatic = this.totalSellStatic = 0;
                //if(isMobile){ // rs lại tổng số
                //    this.totalBuyStatic = this.totalSellStatic = 0;
                //}
                if(isMobile && stl > 60){
                    //let sl = stl - csl;
                    let sl = 0;
                    if(stl > 60 && stl <= 80){
                        sl = 20;
                    }else if(stl > 80){
                        sl = 40;
                    }
                    for(let x = 0; x < sl; x++){
                       sta.shift();
                    }
                    stl = sta.length;
                }
                let list = $('.historyBox');
                $('.historyBox .item').removeClass('bg-green bg-red');
                for(let i = istart; i < stl; i++){
                    let item = i;
                    // let l1 = $('.historyBox .list1')
                    // let l2 = $('.historyBox .list2')
                    // let l3 = $('.historyBox .list3')
                    // let l4 = $('.historyBox .list4')
                    // let l5 = $('.historyBox .list5')
                    if(i < 20){
                        if(sta[i] == 'buy'){
                            list.find('.item:eq('+item+')').addClass('bg-green')
                            this.totalBuyStatic++;
                        }else if(sta[i] == 'sell'){
                            list.find('.item:eq('+item+')').addClass('bg-red')
                            this.totalSellStatic++;
                        }
                    }
                    if(i > 19 && i < 40){
                        if(sta[i] == 'buy'){
                            list.find('.item:eq('+item+')').addClass('bg-green')
                            this.totalBuyStatic++;
                        }else if(sta[i] == 'sell'){
                            list.find('.item:eq('+item+')').addClass('bg-red')
                            this.totalSellStatic++;
                        }
                    }
                    if(i > 39 && i < 60){
                        if(sta[i] == 'buy'){
                            list.find('.item:eq('+item+')').addClass('bg-green')
                            this.totalBuyStatic++;
                        }else if(sta[i] == 'sell'){
                            list.find('.item:eq('+item+')').addClass('bg-red')
                            this.totalSellStatic++;
                        }
                    }
                    if(i > 59 && i < 80){
                        if(sta[i] == 'buy'){
                            list.find('.item:eq('+item+')').addClass('bg-green')
                            this.totalBuyStatic++;
                        }else if(sta[i] == 'sell'){
                            list.find('.item:eq('+item+')').addClass('bg-red')
                            this.totalSellStatic++;
                        }
                    }
                    if(i > 79 && i < 100){
                        if(sta[i] == 'buy'){
                            list.find('.item:eq('+item+')').addClass('bg-green')
                            this.totalBuyStatic++;
                        }else if(sta[i] == 'sell'){
                            list.find('.item:eq('+item+')').addClass('bg-red')
                            this.totalSellStatic++;
                        }
                    }
                }

            }
        }.bind(this);

        this.connection.onclose = () => {
            // xóa notice = 0
            getData.Notify = 0;
            this.betOpen.l.bet[0].items = [];
            localStorage.removeItem('stateOpen');
        }

        //window.addEventListener("load", this.onWindowLoad);


    } else {
        //this.sendMessage({type: 'getListData'});
        // Fix reload index page
        // this.$router.go(this.$router.currentRoute);
    }


  },
  mounted() {

    this.addSound();
    this.onResize();
    window.addEventListener("resize", this.onResize)
    //window.addEventListener("load", this.setChartHeight);

    // this.setChartHeight();

    // this.isMounted = true;

    // const chart = this.$children[1].$refs.highcharts
    // console.log(chart);
    //setTimeout(() => {

            // let chart = this.$refs.chartOs.chart
            // if (chart.series) { // the chart may be destroyed
            //     timer = setInterval(() => {
            //         var left = chart.series[0].points[0],
            //             //right = chart.series[1].points[0],
            //             leftVal,
            //             //rightVal,
            //             inc = (Math.random() * 200) - 85;

            //         leftVal = left.y + inc;
            //         //console.log(left.y)
            //         //rightVal = leftVal + inc / 3;
            //         if (leftVal < -85 || leftVal > 85) {
            //             leftVal = left.y - inc;
            //         }
            //         // if (rightVal < -20 || rightVal > 6) {
            //         //     rightVal = leftVal;
            //         // }
            //         //console.log(leftVal)
            //         left.update(leftVal, false);
            //         //right.update(rightVal, false);
            //         chart.redraw();
            //     }, 3000)
            // }


    //}, 3000)

    this.$store.commit('SET_IS_RENDER_TRADE_INDEX', true);
  },
  destroyed() {

    //window.removeEventListener("resize", this.setChartHeight);

    if (timer) {
      clearInterval(timer)
    }
    this.$store.commit('SET_IS_RENDER_TRADE_INDEX', false);
    window.removeEventListener("resize", this.onResize);
    connected = false;
    this.connection.close();
  },
}
</script>


<style scoped lang="scss">
#tradePage{
    overflow: hidden;

    .ss{
        color: #23a776;
    }
}
.tradingview-widget-container{
    width: 100%;
    height: 52px;
    margin-bottom: 5px;
    overflow: hidden;

    @media screen and (max-width: 986px) {
        height: 30px;
    }
}

.drawing-toolbar {
  background: #0E0E0E;
  border-radius: px;
  padding: 5px;
  z-index: 20;
}
.wrapper-cuoc-mobile {
    display: flex;
    align-items: center;

    .session_mobile {
        margin-left: 10px;
        background: #2c3e50;
        padding: 0 10px;
        height: 3em;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        border-radius: .25em;
    }
}
.price-center {
    text-align: center;
    width: 100%;
    background: #2c3e50;
    border-radius: .25em;
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
}

.reset-demo {
  display: flex;
  align-items: center;
  padding: 3px 0;
  width: 100%;
  justify-content: flex-end;
  cursor: pointer;
  transition: .4s;

  span {
    margin-right: 5px;
  }
}

.rotate {
  animation: rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.select-custom {
  position: relative;
  display: flex;
  width: 20em;
  height: 3em;
  border-radius: .25em;
  overflow: hidden;

  &::after {
        content: '\25BC';
        position: absolute;
        top: 0;
        right: 0;
        padding: 1em;
        background-color: #34495e;
        transition: .25s all ease;
        pointer-events: none;
    }

    &:hover::after {
      color: #f39c12;
    }

    select {
      /* Reset Select */
      appearance: none;
      outline: 0;
      border: 0;
      box-shadow: none;
      /* Personalize */
      flex: 1;
      padding: 0 1em;
      color: #fff;
      background-color: #2c3e50;
      background-image: none;
      cursor: pointer;
    }
    /* Remove IE arrow */
    select::-ms-expand {
      display: none;
    }
}

.wrapper-phien-cuoc {
    display: flex;
    justify-content: space-between;

    .session, .wrapper-time {
        flex-basis: 50%;
        width: 50%;
    }
    .session {
        display: flex;
        flex-direction: column;
    }

    .wrapper-time {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        color: yellow;
    }
}

@media (min-width: 769px) and (max-width: 961px)  {
  .wrapper-right-mobile {
    width: calc(100vw - 40px);
    display: flex;
    flex-wrap: nowrap;
  }

  .wrapper {
        display: flex;
        flex-wrap: nowrap;

        #left-content {
            flex: 1 0 calc(100% - 200px);
            max-width: calc(100% - 200px);
            padding: 0 2px;
        }

        #right-content {
            flex: 0 0 200px;
            max-width: 200px;
            padding: 0 10px;
        }

        .c-loinhuan {
          margin-top: 1rem !important;
          display: flex;
          flex-direction: column;
        }

        .wrapper-cuoc-mobile {
          display: flex;
          flex-direction: column;
          & > div:first-child {
            margin-bottom: 10px;
          }
          & > div {
            max-width: 200px;
            width: 100%;
            margin: 0;
          }
        }

        .btn-mobile_1 {
          display: flex;
          flex-direction: column;
          margin-top: 2rem;

          & > button {
            max-width: 200px;
            width: 100%;
            margin: 0;
          }
        }
    }
}

@media screen and (min-width: 962px) {
  .wrapper-right-mobile {
    width: calc(100vw - 150px);
    display: flex;
    flex-wrap: nowrap;
  }

    .wrapper {
        display: flex;
        flex-wrap: nowrap;

        #left-content {
            flex: 1 0 calc(100% - 250px + 110px);
            max-width: calc(100% - 250px + 110px);
            padding: 0 2px;
        }

        #right-content {
            flex: 0 0 250px;
            max-width: 250px;
            padding: 0 10px;
        }
    }
}

@media screen and (min-width: 1200px) {
    .wrapper {
        #left-content {
            flex: 1 0 calc(100% - 250px );
            max-width: calc(100% - 250px);
            padding: 0 2px;
        }
    }
}

@media screen and (max-width: 768px) {
    .wrapper {
        display: flex !important;
        flex-wrap: nowrap;
    }

    .wrapper-right-mobile {
      width: calc(100vw - 50px);
    }

    .overviewInfo {
      top: 5px !important;
      .badgeItem {
        padding: 2px 4px;
        font-size: 12px;
      }
    }

    .c-loinhuan {
      margin-top: 0 !important;
    }
}

.trans {
    transition: .4s all;
}

.overviewInfo {
    font-weight: 700;
    font-size: 16px;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    right: 0;
}

.overviewInfo .badgeItem {
    padding: 4px 8px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.2);
}

.titleChartCandle {
    position: absolute;
    top: 10px;
    left: 0;
    padding: 7px 10px;
    border-radius: 10px!important;
    background-color: #2f3242!important;
}

.titleChartCandle .iconBTC {
    display: inline-flex;
    width: 30px;
    height: 30px;
    margin-right: 4px;
    background-image: url(~@/assets/images/landing/dollar-coin.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

.titleChartCandle .textPrice {
    font-size: 1rem;
    color: #fff;
    font-weight: 700;
}

.popupCongratulation {
    display: none;
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
}

.popupCongratulation .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.7);
}

.popupCongratulation .popupCongratulationContent {
    display: block;
    overflow: unset;
    border-radius: 8px;
    width: 450px;
    height: auto;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}

.winLive .wrapNotify {
    border-radius: unset !important;
    background-color: unset !important;
    height: 210px !important;
    width: 368px;
    background-image: url('~@/assets/images/sky/notify.png');
    background-repeat: no-repeat;
    background-size: 100% 215px;
}

.wrapNotify.congratulation {
    background-color: red;
}

.winLive .wrapNotify .iconWin {
    position: absolute;
    left: 49%;
    bottom: 89%;
    -webkit-transform: translate(-50%, 30%);
    -ms-transform: translate(-50%, 30%);
    -moz-transform: translate(-50%, 30%);
    transform: translate(-50%, 30%);
    width: 257px;
}

.winLive .wrapNotify .badgeDemo {
    position: absolute;
    top: 34px;
    right: 57px;
    color: #fff;
    font-weight: bold;
    background: #2177FF;
    border-radius: 4px;
    padding: 0 8px;
}

.winLive .wrapNotify .titleWin {
    font-size: 1.95rem;
    font-weight: bold;
    margin: 15px 0;
    color: #fff;
}

.winLive .wrapNotify .message {
    color: #23a776;
}

.winLive .wrapNotify .iconClose {
    color: #fff;
    position: absolute;
    right: -30px;
    top: 15px;
}

.winDemo .wrapNotify {
    border-radius: 5px;
    background-color: #12013E;
    height: 340px !important;
    width: 400px;
}

.winDemo .wrapNotify .iconWin {
    position: absolute;
    top: -25px;
    left: 50%;
    -webkit-transform: translate(-50%, 30%);
    -ms-transform: translate(-50%, 30%);
    -moz-transform: translate(-50%, 30%);
    transform: translate(-50%, 30%);
    width: 120px;
    height: 120px;
}

.boxContent .message_money {
  color: #00c48c;
}

.winDemo .wrapNotify .boxContent {
    padding: 0;
}

.boxContent {
    margin-top: 4.5rem !important;
}

.winDemo .wrapNotify .boxContent .contentPopup {
    margin-top: 140px;
}

.winDemo .wrapNotify .boxContent .titleWin {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 15px;
    line-height: 1.5;
}

.winDemo .wrapNotify .boxContent .message {
    color: #23a776;
    font-size: 2.2rem !important;
    line-height: 1;
}

.winDemo .wrapNotify .boxContent .btnDeposit {
    max-width: 340px;
    width: 100%;
    padding: 10px 0;
    font-weight: bold;
    font-size: 14px;
    color: #fff;
    border-radius: 5px;
    background-color: #23a776;
}

.winDemo .wrapNotify .iconClose {
    color: #fff;
    position: absolute;
    right: -30px;
    top: 0;
}

.analysis-wrapper{
    height: 8rem ;
}


.analysis-wrapper .wrap-gauge-meter.active,
.analysis-wrapper #historyBox.active {
    opacity: 1;
    z-index: 1;
}

.wrap-gauge-meter {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding-top: 20px;
}
.wrap-gauge-meter-inner {
    height: 100%;
}

.historyBox {
    margin-top: 30px;
}

.historyBox .item{
    width: 1.8rem;
    height: 1.8rem;
    margin: 2px !important;
}
.sidebarMobile{
    display: none;
}


.list1, .list2, .list3, .list4, .list5 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row dense;
    grid-gap: 0rem;
}

.gridcs-1{
    grid-column-start: 1;
}
.gridcs-2{
    grid-column-start: 2;
}
.gridcs-3{
    grid-column-start: 3;
}
.gridcs-4{
    grid-column-start: 4;
}
.gridcs-5{
    grid-column-start: 5;
}

@media (max-width: 1024.98px){

    .sidebarPC{
        display: none;
    }
    .sidebarMobile {
        display: block;
        position: absolute;
        top: 60px;
        left: 0;
        width: 50px;
    }
    .sidebarMobile .slidercontent {
        height: 100%;
        position: relative;
        width: 50px;
    }
    .sidebarMobile .slidercontent .backgroundOverlay {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 50px;
    }
    .sidebarMobile .slidercontent span {
        width: 50px;
        line-height: 1;
    }
    .zIndex99 {
        z-index: 99;
    }
    .sidebarMobile .slidercontent .progress {
        -webkit-transform: translateX(-48%) rotate(270deg);
        transform: translateX(-48%) rotate(270deg);
        height: .4rem!important;
        overflow: unset!important;
    }
}
@media screen and (max-width: 1300px) {
.wrap-gauge-meter-inner {
        height: auto;
        overflow: initial;
}
}
@media screen and (max-width: 1023px) and (min-width: 991px) {
.wrap-gauge-meter-inner {
        padding-bottom: 65px;
}
}
@media screen and (max-width: 1023px) and (min-width: 991px) and (orientation: landscape) {
.wrap-gauge-meter-inner {
      padding-bottom: 65px !important;
}
}
@media screen and (max-width: 1023px) and (orientation: landscape) {
.wrap-gauge-meter {
    padding-top: 36px;
}
}
@media screen and (max-width: 986px) {
    .wrap-gauge-meter {
        padding-top: 35px;
    }

    .c-desktop .profitValue {
        color: #23a776 !important;
        font-weight: 700 !important;
        font-size: 1.875rem !important;
    }
}
.gauge-meter {
  width: 900px;
  height: 135px;
  position: relative;
  margin: 0 auto;
  top: 15px;
}
@media screen and (max-width: 1500px) {
.gauge-meter {
      width: 700px;
}
}
@media screen and (max-width: 1300px) {
.gauge-meter {
      width: 600px;
      height: 64px;
      top: auto;
      transform: none;
      margin-top: 20px;
}
}
@media screen and (max-width: 1200px) {
.gauge-meter {
      margin-top: 15px;
}
}
@media screen and (max-width: 1024px) {
.gauge-meter {
      margin-top: 10px;
}
}
@media screen and (max-width: 1000px) and (orientation: landscape) {
.gauge-meter {
    margin-top: 5px;
    width: 350px;
}
}
@media screen and (max-width: 767px) {
.gauge-meter {
      width: 350px;
      margin-top: 15px;
}
.boxContent {
    margin-top: 3.2rem !important;
}
}
// @media screen and (max-width: 575px) {
// .gauge-meter {
//       margin-top: 35px;
// }
// }
@media screen and (max-width: 575px) {
.gauge-meter {
      margin-top: 10px;
      width: 320px;
}
}

@media screen and (max-width: 400px) {
.gauge-meter {
      /* margin-top: 10px; */
      width: 260px;
}
}

.gauge-meter.is-show-transaction {
    width: 90%;
}
.gauge-meter-sub {
    width: 176px;
    height: 100%;
    position: absolute;
    bottom: 0;
}
@media screen and (max-width: 1300px) {
.gauge-meter-sub {
        width: 88px;
}
}
.gauge-meter--os {
    left: 0;
    width: 140px;
}
@media screen and (max-width: 1300px) {
.gauge-meter--os {
        width: 70px;
}
}
.gauge-meter--su {
    left: 50%;
    transform: translateX(-50%);
}
.gauge-meter--ma {
    width: 140px;
    left: auto;
    right: 0;
}
@media screen and (max-width: 1300px) {
.gauge-meter--ma {
        width: 70px;
}
}
.gauge-meter-title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    z-index: 4;
    margin-bottom: 0;
    white-space: nowrap;
    display: flex;
    position: relative;
    color: #fff;
    cursor: pointer;
}
.gauge-meter-title:hover {
      text-decoration: underline;
}
.gauge-meter-title-icon {
      width: 16px;
      height: 16px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -20px;
}
.gauge-meter-title-icon svg {
        width: 100%;
        height: auto;
}
@media screen and (max-width: 1300px) {
.gauge-meter-title-icon {
          width: 12px;
          height: 12px;
          right: -14px;
}
}
@media screen and (max-width: 1300px) {
.gauge-meter-title {
        font-size: 10px;
}
}
.gauge-meter-sub-title {
    color: #fff;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    margin-bottom: 0;
    white-space: nowrap;
}

@media screen and (max-width: 1300px) {
.gauge-meter-sub-title {
        font-size: 10px;
        bottom: -12px;
}
}
.gauge-meter-border {
    width: 100%;
    height: 88px;
    position: absolute;
    bottom: 0;
    left: 0;
}
.gauge-meter-border:after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      bottom: 0;
      z-index: 3;
      background-size: cover;
      background-image: url("data:image/svg+xml;base64,PHN2ZyBpZD0iR3JvdXBfMjE1NTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9Ijg2IiBoZWlnaHQ9IjQzIiB2aWV3Qm94PSIwIDAgODYgNDMiPgogIDxnIGlkPSJQYXRoXzM1MzYzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDE4LjI1OSkiPgogICAgPHBhdGggaWQ9IlBhdGhfMzUzNzMiIGRhdGEtbmFtZT0iUGF0aCAzNTM3MyIgZD0iTTk0My4yNjIsMTE4Ni40MmEuODM0LjgzNCwwLDAsMS0uODY4LS44MjQsNDAuNTA5LDQwLjUwOSwwLDAsMSw3LjYzNi0yMy41Ni44NjguODY4LDAsMSwxLDEuMzg4LDEuMDQyLDM5LjEzNywzOS4xMzcsMCwwLDAtNy4yODksMjIuNDc1Ljg0NC44NDQsMCwwLDEtLjg2OC44NjhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTQyLjM5MSAtMTE2MS42NzkpIiBmaWxsPSIjZWY1NDUwIi8+CiAgPC9nPgogIDxnIGlkPSJQYXRoXzM1MzY3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3Ni43ODkgMTguMjE1KSI+CiAgICA8cGF0aCBpZD0iUGF0aF8zNTM3NCIgZGF0YS1uYW1lPSJQYXRoIDM1Mzc0IiBkPSJNMTEyOC42MTksMTE4Ni4zNjNoMGEuODguODgsMCwwLDEtLjg2OC0uOTExLDM5LjUyNSwzOS41MjUsMCwwLDAtNy4yODktMjIuNDc1Ljg2OC44NjgsMCwxLDEsMS4zODgtMS4wNDEsNDAuNTA5LDQwLjUwOSwwLDAsMSw3LjYzNiwyMy41NkEuODY5Ljg2OSwwLDAsMSwxMTI4LjYxOSwxMTg2LjM2M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTIwLjI3OSAtMTE2MS41NzkpIiBmaWxsPSIjMzFiYWEwIi8+CiAgPC9nPgogIDxnIGlkPSJQYXRoXzM1MzY0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjgzIDIuNjgpIj4KICAgIDxwYXRoIGlkPSJQYXRoXzM1Mzc1IiBkYXRhLW5hbWU9IlBhdGggMzUzNzUiIGQ9Ik05NjMuNjM0LDExNDAuNjYzYS45NTMuOTUzLDAsMCwxLS41NjQtLjE3My44NDYuODQ2LDAsMCwxLS4xMy0xLjIxNSw1Mi40NTcsNTIuNDU3LDAsMCwxLDUuODU4LTUuOTQ0YzQuNzczLTQuMjA5LDkuMzcyLTYuOSwxMy43MTEtOC4wN2EuODUyLjg1MiwwLDEsMSwuNDM0LDEuNjQ5Yy05LjcxOSwyLjU2LTE4LjU3LDEzLjMyLTE4LjY1NywxMy40NTFBLjg0OC44NDgsMCwwLDEsOTYzLjYzNCwxMTQwLjY2M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NjIuNzQxIC0xMTI1LjIzKSIgZmlsbD0iI2Y1OTg5NiIvPgogIDwvZz4KICA8ZyBpZD0iUGF0aF8zNTM2NiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTYuMjQxIDIuNjc3KSI+CiAgICA8cGF0aCBpZD0iUGF0aF8zNTM3NiIgZGF0YS1uYW1lPSJQYXRoIDM1Mzc2IiBkPSJNMTA5Mi45MTUsMTE0MC42NmExLjAyNSwxLjAyNSwwLDAsMS0uNjk0LS4zYy0uMDg3LS4wODctOC45MzgtMTAuODQ3LTE4LjY1Ny0xMy40NWEuODUzLjg1MywwLDEsMSwuNDM0LTEuNjQ5YzQuMzM5LDEuMTI4LDguOTM4LDMuODYyLDEzLjcxMSw4LjA3YTYyLjMzMiw2Mi4zMzIsMCwwLDEsNS44NTcsNS45NDQuODQyLjg0MiwwLDAsMS0uMTMsMS4yMTVBLjkyOS45MjksMCwwLDEsMTA5Mi45MTUsMTE0MC42NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDcyLjkyMyAtMTEyNS4yMjMpIiBmaWxsPSIjOGZmMGNiIi8+CiAgPC9nPgogIDxnIGlkPSJQYXRoXzM1MzY1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMC4yMTEpIj4KICAgIDxwYXRoIGlkPSJQYXRoXzM1Mzc3IiBkYXRhLW5hbWU9IlBhdGggMzUzNzciIGQ9Ik0xMDM3LjMsMTEyMi42NzVhLjczOC43MzgsMCwwLDEtLjMtLjA0M2MtMTEuMTA4LTQuMDc4LTIzLjI1Ni0uMDQzLTIzLjM4NywwYS44MjkuODI5LDAsMCwxLTEuMDg1LS41NjQuODM4LjgzOCwwLDAsMSwuNTIxLTEuMDg1Yy41MjEtLjE3MywxMi44NDMtNC4yNTIsMjQuNTU4LDBhLjg3Mi44NzIsMCwwLDEtLjMsMS42OTJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAxMi40NzUgLTExMTkuMDU0KSIgZmlsbD0iI2QxZDRkYyIvPgogIDwvZz4KPC9zdmc+Cg==");
}
@media screen and (max-width: 1300px) {
.gauge-meter-border {
        height: 44px;
}
}
.gauge-meter--os .gauge-meter-border,
    .gauge-meter--ma .gauge-meter-border {
      height: 50px;
}
@media screen and (max-width: 1300px) {
.gauge-meter--os .gauge-meter-border,
        .gauge-meter--ma .gauge-meter-border {
          height: 35px;
}
}
.gauge-meter-background {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-size: cover;
    transition: all 0.3s;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODYiIGhlaWdodD0iNDMiIHZpZXdCb3g9IjAgMCA4NiA0MyI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfNTE0MSIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgNTE0MSIgd2lkdGg9Ijg2IiBoZWlnaHQ9IjQzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0wLjAxKSIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjAuNSIgeTE9IjAuMDA2IiB4Mj0iMC41MDciIHkyPSIwLjQ5NCIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMC42MDQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjVjYmIwIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTdkY2NmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzY0MSIgZGF0YS1uYW1lPSJNYXNrIEdyb3VwIDY0MSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwLjAxKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPHBhdGggaWQ9IlBhdGhfMzU0NDAiIGRhdGEtbmFtZT0iUGF0aCAzNTQ0MCIgZD0iTTQzLDBDNjYuNzQ4LDAsODYsMTguOCw4Niw0MlM2Ni43NDgsODQsNDMsODQsMCw2NS4yLDAsNDIsMTkuMjUyLDAsNDMsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMC45OSkiIG9wYWNpdHk9IjAuNiIgZmlsbD0idXJsKCNsaW5lYXItZ3JhZGllbnQpIi8+CiAgPC9nPgo8L3N2Zz4K");
}
.gauge-meter-background.rank-1 {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODYiIGhlaWdodD0iNDMiIHZpZXdCb3g9IjAgMCA4NiA0MyI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfNTE0MCIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgNTE0MCIgd2lkdGg9Ijg2IiBoZWlnaHQ9IjQzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0wLjAxKSIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjAuNSIgeTE9IjAuMDA2IiB4Mj0iMC41MDciIHkyPSIwLjQ5NCIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNlZjU0NTAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYzk2NzY3IiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTdkY2NmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzY0MCIgZGF0YS1uYW1lPSJNYXNrIEdyb3VwIDY0MCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwLjAxKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPHBhdGggaWQ9IlBhdGhfMzU0MzkiIGRhdGEtbmFtZT0iUGF0aCAzNTQzOSIgZD0iTTQzLDBDNjYuNzQ4LDAsODYsMTguOCw4Niw0MlM2Ni43NDgsODQsNDMsODQsMCw2NS4yLDAsNDIsMTkuMjUyLDAsNDMsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMC45OSkiIG9wYWNpdHk9IjAuNiIgZmlsbD0idXJsKCNsaW5lYXItZ3JhZGllbnQpIi8+CiAgPC9nPgo8L3N2Zz4K");
}
.gauge-meter-background.rank-2 {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODYiIGhlaWdodD0iNDMiIHZpZXdCb3g9IjAgMCA4NiA0MyI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfNTA4NCIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgNTA4NCIgd2lkdGg9Ijg2IiBoZWlnaHQ9IjQzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0wLjAxKSIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjAuNSIgeTE9Ii0wLjI5OCIgeDI9IjAuNTA3IiB5Mj0iMC40OTQiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmQ5MjkxIiBzdG9wLW9wYWNpdHk9IjAuOCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmNTk4OTYiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGcgaWQ9Ik1hc2tfR3JvdXBfNjIxIiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgNjIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDAuMDEpIiBjbGlwLXBhdGg9InVybCgjY2xpcC1wYXRoKSI+CiAgICA8ZWxsaXBzZSBpZD0iRWxsaXBzZV8yMjM5IiBkYXRhLW5hbWU9IkVsbGlwc2UgMjIzOSIgY3g9IjQzIiBjeT0iNDIiIHJ4PSI0MyIgcnk9IjQyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDAuOTkpIiBvcGFjaXR5PSIwLjYiIGZpbGw9InVybCgjbGluZWFyLWdyYWRpZW50KSIvPgogIDwvZz4KPC9zdmc+Cg==");
}
.gauge-meter-background.rank-3 {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODYiIGhlaWdodD0iNDMiIHZpZXdCb3g9IjAgMCA4NiA0MyI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfNTE0MSIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgNTE0MSIgd2lkdGg9Ijg2IiBoZWlnaHQ9IjQzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0wLjAxKSIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjAuNSIgeTE9IjAuMDA2IiB4Mj0iMC41MDciIHkyPSIwLjQ5NCIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMC42MDQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjVjYmIwIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTdkY2NmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzY0MSIgZGF0YS1uYW1lPSJNYXNrIEdyb3VwIDY0MSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwLjAxKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPHBhdGggaWQ9IlBhdGhfMzU0NDAiIGRhdGEtbmFtZT0iUGF0aCAzNTQ0MCIgZD0iTTQzLDBDNjYuNzQ4LDAsODYsMTguOCw4Niw0MlM2Ni43NDgsODQsNDMsODQsMCw2NS4yLDAsNDIsMTkuMjUyLDAsNDMsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMC45OSkiIG9wYWNpdHk9IjAuNiIgZmlsbD0idXJsKCNsaW5lYXItZ3JhZGllbnQpIi8+CiAgPC9nPgo8L3N2Zz4K");
}
.gauge-meter-background.rank-4 {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODYiIGhlaWdodD0iNDMiIHZpZXdCb3g9IjAgMCA4NiA0MyI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfNTE1MiIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgNTE1MiIgd2lkdGg9Ijg2IiBoZWlnaHQ9IjQzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0wLjAxKSIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjAuNSIgeTE9Ii0wLjI2IiB4Mj0iMC41MDciIHkyPSIwLjQ5NCIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4ZmYwY2IiIHN0b3Atb3BhY2l0eT0iMC44Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmZjBjYiIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmZjBjYiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGcgaWQ9Ik1hc2tfR3JvdXBfNjQ1IiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgNjQ1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDAuMDEpIiBjbGlwLXBhdGg9InVybCgjY2xpcC1wYXRoKSI+CiAgICA8ZWxsaXBzZSBpZD0iRWxsaXBzZV8yMzIxIiBkYXRhLW5hbWU9IkVsbGlwc2UgMjMyMSIgY3g9IjQzIiBjeT0iNDIiIHJ4PSI0MyIgcnk9IjQyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDAuOTkpIiBvcGFjaXR5PSIwLjYiIGZpbGw9InVybCgjbGluZWFyLWdyYWRpZW50KSIvPgogIDwvZz4KPC9zdmc+Cg==");
}
.gauge-meter-background.rank-5 {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODYiIGhlaWdodD0iNDMiIHZpZXdCb3g9IjAgMCA4NiA0MyI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfNTA4NCIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgNTA4NCIgd2lkdGg9Ijg2IiBoZWlnaHQ9IjQzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0wLjAxKSIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjAuNSIgeTE9IjAuMDA2IiB4Mj0iMC41MDciIHkyPSIwLjQ5NCIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMzMWJhYTAiIHN0b3Atb3BhY2l0eT0iMC42MDQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjVjYmIwIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTdkY2NmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzYyMSIgZGF0YS1uYW1lPSJNYXNrIEdyb3VwIDYyMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwLjAxKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPHBhdGggaWQ9IlBhdGhfMzUzODIiIGRhdGEtbmFtZT0iUGF0aCAzNTM4MiIgZD0iTTQzLDBDNjYuNzQ4LDAsODYsMTguOCw4Niw0MlM2Ni43NDgsODQsNDMsODQsMCw2NS4yLDAsNDIsMTkuMjUyLDAsNDMsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMC45OSkiIG9wYWNpdHk9IjAuODAyIiBmaWxsPSJ1cmwoI2xpbmVhci1ncmFkaWVudCkiLz4KICA8L2c+Cjwvc3ZnPgo=");
}
.gauge-meter-pane {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
}


@media screen and (min-width: 769px) and (max-width: 986px) {

    .w-18 {
        max-width: 90% !important;
        padding: 0 .5rem;
    }

    .historyBox {
        margin-top: 5px;
    }

    .historyBox .item {
        width: 1.3rem;
        height: 1.3rem;
    }

    #tradePage {
        /* padding-top: 10px; */
    }

    .c-loinhuan {
        margin-bottom: 0.5rem !important;
        margin-top: 2.25rem !important;
    }
}


@media screen and (max-width: 986px) {

    .w-18 {
        max-width: 90% !important;
        padding: 0 .5rem;
    }

    .historyBox {
        margin-top: 5px;
    }

    .historyBox .item {
        width: 1.2rem;
        height: 1.2rem;
    }

    /* #tradePage{
        padding-top: 20px;
    } */
}

@media screen and (max-width: 576px) {

    .w-18 {
        max-width: 130px !important;
    }

    .historyBox .item {
        width: 1.2rem;
        height: 1.2rem;
    }

    .historyBox .list5, .historyBox .list4{
        display: none;
    }
}

@media screen and (max-width: 414px) {

    .w-18 {
        max-width: 130px !important;
        padding: 0 .4rem;
    }

    .historyBox .item {
        width: 1rem;
        height: 1rem;
    }

    .popupCongratulation .popupCongratulationContent{
        width: auto;
    }

    .winLive .wrapNotify{
        width: 320px;
        background-size: 320px;
    }

    .winLive .wrapNotify .iconWin{
        left: 50%;
    }

    .winLive .wrapNotify .badgeDemo{
        right: 50px;
    }
}

@media screen and (max-width: 376px) {

    .w-18 {
        max-width: 115px !important;
    }

    .historyBox .item {
        width: 1rem;
        height: 1rem;
    }


}

@media screen and (max-width: 359px) {

    .w-18 {
        max-width: 100px !important;
    }

   .historyBox .item {
        width: .8rem;
        height: .8rem;
    }

    .popupCongratulation{
        zoom: 0.8;
    }
}

@media screen and (max-width: 1300px) {
.gauge-meter-label-list {
      display: none;
}
}
.gauge-meter-label-item {
    font-size: 10px;
    color: #8383a1;
    text-align: center;
    position: absolute;
    line-height: 1.2;
    text-transform: uppercase;
    transition: all 0.3s;
}
.gauge-meter-label-item.active {
      color: #fff;
}
.gauge-meter-label-item--strong-sell {
      top: 45px;
      left: -42px;
}
.gauge-meter--os .gauge-meter-label-item--strong-sell,
      .gauge-meter--ma .gauge-meter-label-item--strong-sell {
        top: 40px;
        left: -40px;
}
.gauge-meter-label-item--sell {
      top: 5px;
      left: 5px;
}
.gauge-meter--os .gauge-meter-label-item--sell,
      .gauge-meter--ma .gauge-meter-label-item--sell {
        top: 8px;
        left: -2px;
}
.gauge-meter-label-item--neutral {
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
}
.gauge-meter--os .gauge-meter-label-item--neutral,
      .gauge-meter--ma .gauge-meter-label-item--neutral {
        top: -15px;
}
.gauge-meter-label-item--buy {
      top: 5px;
      right: 7px;
}
.gauge-meter--os .gauge-meter-label-item--buy,
      .gauge-meter--ma .gauge-meter-label-item--buy {
        top: 8px;
        right: 0px;
}
.gauge-meter-label-item--strong-buy {
      top: 45px;
      right: -42px;
}
.gauge-meter--os .gauge-meter-label-item--strong-buy,
      .gauge-meter--ma .gauge-meter-label-item--strong-buy {
        top: 40px;
        right: -40px;
}
.gauge-meter-status-list {
    position: absolute;
    width: 100%;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
}
@media screen and (max-width: 1300px) {
.gauge-meter-status-list {
        bottom: -55px;
}
}
@media screen and (max-width: 1023px) and (orientation: landscape) {
.gauge-meter-status-list {
    display: none;
}
}
@media screen and (max-width: 767px) {
.gauge-meter-status-list {
        display: none;
}
}
.gauge-meter-status-item {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
}
@media screen and (max-width: 1300px) {
.gauge-meter-status-item {
        padding: 0 5px;
        font-size: 12px;
}
}
.gauge-meter-status-value {
    color: #fff;
    text-align: center;
    font-weight: bold;
}
.gauge-meter-status-value--sell {
      color: #e54150;
}
.gauge-meter-status-value--buy {
      color: #23a776;
}
.gauge-meter-status-value--neutral {
      color: #d1d4dc;
}
.gauge-meter-status-text {
    color: #8383a1;
}
.gauge-meter-popover {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}
.gauge-meter--os .gauge-meter-popover,
    .gauge-meter--ma .gauge-meter-popover {
      top: 23px;
}
@media screen and (max-width: 1300px) {
.gauge-meter--os .gauge-meter-popover,
        .gauge-meter--ma .gauge-meter-popover {
          top: 10px;
}
}


.keyboard.hiddenKey {
    visibility: hidden;
    transform: translate3d(0, 100%, 0);
}

.vs-button-primary.vs-button-border, .vs-button-primary.vs-button-flat{
    border: 1px solid #4e4e4e;
    color: #fff;
}

.keyboard-input-wrap.active .numKeyboardInput {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.5);
}

.keyboard td {
    text-align: center;
    width: 25%;
    border: 1px solid #ddd;
}

.keyboard table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.keyboard {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    font-size: .48rem;
    line-height: .48rem;
    background: #f6f6f6;
    color: #4a4a4a;
    width: 100%;
    height: 4.4rem;
    user-select: none;
    visibility: visible;
    transform: translate3d(0, 0, 0);
    transition-property: transform visibility;
    transition-duration: .2s;
    font-weight: normal;
    border-top: 1px solid #e5e5e5;
}


.keyboard-input-wrap .keyboard {
    height: 460px;
    font-size: 1.2em;
    color: #fff;
    border: none;
}



.amountWrapper {
    height: 160px;
    background-color: #111;
}

.amountWrapper .headerAmount {
    padding: 1.25rem;
    background-color: #111;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}


.groupButtonMobile {
    margin: 1.25rem 0.5rem;
}

.keyboard-input-wrap .suggestion {
    background: #142C37;
    width: 100%;
    font-size: 1.2em;
    font-weight: normal;
}


.keyboard td:nth-of-type(-n+3) {
    font-weight: normal;
}

.keyboard td:first-child {
    border-left: none;
}

.c-body {
    max-height: calc(100vh - 88px);
}

.c-desktop .item-col {
    padding: 0 .2rem;
    border-radius: 10px;
}

.c-desktop .num1 {
    height: 100%;
}

.c-desktop .operator {
    font-size: 20px;
    font-weight: bold;
}
</style>

<style lang="scss">

.trading-vue-ohlcv {
    margin-left: 100px;
}


.trading-vue-legend{
    margin-left: 30px;
    @media screen and (min-width: 580px) {
         .t-vue-ind:nth-child(2){
            margin-left: 100px;
        }
    }

}

.vs-button:disabled {
    background-color: #818a95!important;
    opacity: 1 !important;
}

 #tradePage, .rightBar{
    overflow: hidden;
 }
@media screen and (min-width: 768.98px) {
    #tradePage, .rightBar{
        height: calc(100vh - 55px);
        border-left: 2px solid #000;
    }
    .vs-navbar.navbar-skelton{
        border-bottom: 2px solid #000;
    }
}

.vs-input-primary .vs-input--input:focus{
    border: 1px solid #4e4e4e !important
}

.vs-input-primary.isFocus .vs-input--label, .vs-input-primary .vs-input--input:focus~.icon-inputx, .vs-input-primary .vs-input--input:focus~.vs-placeholder-label{
        color: #4e4e4e
}

@media (max-width: 1024.98px) and (min-width: 576px){
    table tbody .suggestion td {
        font-size: 20.16px;
    }
}

.keyboard-input-wrap .keyboard table tbody tr td {
    border-color: #060017;
    background: #262527;
}

.keyboard-input-wrap .keyboard table tbody tr.suggestion td {
    background-color: #4e4e4e;
}




#tradePage .chartBox {
    height: calc(var(--vh, vh) * 100 - 230px - 60px - 85px);
    overflow: hidden;

    @media screen and (max-width: 1300px){
        height: calc(var(--vh, vh) * 100  - 150px - 60px - 85px);

   }

   @media screen and (max-width: 986px){
        height: calc(var(--vh, vh) * 100  - 230px - 60px - 85px);

   }

   @media screen and (max-width: 770px){
        height: calc(var(--vh, vh) * 100  - 230px - 75px - 45px);

   }
}


@media screen and (max-width: 986px){
    #tradePage .pc{
        display: none !important;
    }
    #tradePage .mobile{
        display: block !important;
    }
}

@media  (max-width: 986px) {
    .c-loinhuan {
        margin-bottom: 0.5rem !important;
        margin-top: 2.25rem !important;
    }
}


@media screen and (max-width: 1100px) and (min-width: 986px) {
        .analysis-wrapper{
        height: 10rem !important;
    }
}

@media screen and (max-width: 400px){
    .navbar-floating .router-content{
        margin-top: 30px;
    }

    body{
      overflow-x: hidden;
      overflow-y: auto;
    }
    /*#tradePage{
        padding-top: 75px !important;
    }*/
}
@media screen and (max-width: 986px){
    .navbar-floating .router-content{
        margin-top: 50px;
    }
}

.bpF{
    border-radius: 5px;
    display: inline-block;
    background-color: #1d233b;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}
.color-light-blue {
    color: #23a776 !important;
}
.color-green {
    color: #23a776 !important;
}
.color-red{
    color: #e54150 !important;
}
.bg-green{
    background: #23a776 !important;
}
.bg-red{
    background: #e54150 !important;
}
.empty{
    background: #637284;
}
.minutes-set {
  float: left;
  margin-right: 28px;
}

.betInput input{
    background: #1d233b !important;
    color: #fff;
}

.seconds-set { float: right; }

.controlls {
    position: absolute;
    text-align: center;
    left: 40%;
    top: 40%;
    margin-left: -17px;
    width: 45px;
    margin-top: -5px;
}

.display-remain-time {
  font-size: 14px;
  color: #82868b;
  /*position: relative;top: 14px;*/
}

.w-18{
    max-width: 160px !important;
}


.e-c-base {
  fill: none;
  stroke: #B6B6B6;
  stroke-width: 12px
}
.red .e-c-progress {
  fill: none;
  stroke: #e54150;
  stroke-width: 12px;
  transition: stroke-dashoffset 0.7s;
}
.green .e-c-progress {
  fill: none;
  stroke: #23a776;
  stroke-width: 12px;
  transition: stroke-dashoffset 0.7s;
}
.red .e-c-progress {
  fill: none;
  stroke: #e54150;
  stroke-width: 10px;
  transition: stroke-dashoffset 0.7s;
}

.red .e-c-pointer {
  fill: #FFF;
  stroke: #e54150;
  stroke-width: 10px;
}

.green .e-c-progress {
  fill: none;
  stroke: #23a776;
  stroke-width: 10px;
  transition: stroke-dashoffset 0.7s;
}

.green .e-c-pointer {
  fill: #FFF;
  stroke:#23a776;
  stroke-width: 10px;
}
#e-pointer { transition: transform 0.7s; }
.hide-sm{
  display: none !important;
}
.hide-xs{
  display: block;
}
.box-btn-buy-sell{
  position: relative;
}
.box-btn-buy-sell .col-2{
  position: static;
}

.circle{
  position: relative;
  left: 0px;
 height: 45px;
  /*top: 10px;*/
}

.plotlineChart .price {
    display: inline-block;
    background-color: #23a776;
    margin-bottom: 2px;
    padding: 2px 5px;
}
.plotlineChart .time {
    display: inline-block;
    background-color: #23a776;
    padding: 2px 5px;
}
/* Custom color manko */
.plotlineChart span {
    background-color: #fedd3c !important;
    color: #060017 !important;
    display: inline-block;
    margin-top: 2px;
    padding: 2px;
    border-radius: 0 !important;
}

.c-desktop .profitPercent span {
    color: rgb(210, 161, 90) !important;
    font-size: 20px;
}

.c-desktop .profitPercent {
    color: #fff !important;
}

.c-desktop .profitValue {
    color: #23a776 !important;
    font-weight: 700 !important;
    font-size: 2.875rem !important;
}

.c-desktop .btn-trade-time {
    height: 37px;
    color: #fff;
    font-weight: 700;
}

.c-desktop .bet-box-time {
    cursor: default;
    background-color: rgb(29, 35, 59);
    border-radius: 10px;
    color: #fff;
    height: 60px;
    line-height: 38px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: none !important;
}

.c-desktop .inp {
    width: 100% !important;
    background-color: #fff!important;
    font-weight: bold;
    border-radius: 5px;

    input[type="text"] {
        /* color: #000;
        font-weight: bold; */
        text-align: left;
    }

    i {
        color: #000 !important;
    }
}

.trans > .highcharts-container {
    transition: .4s all;
    width: 100%!important;
}

.highcharts-container{
  width: 100% !important;
}

.highcharts-root{
  width: 100% !important;
}

.vs-tabs--content {
    padding: 5px 0 0 !important;
}
</style>
