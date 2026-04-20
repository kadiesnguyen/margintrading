<template>
  <div class="home-body">

    


   

      <!-- MARKETS OVERVIEW -->
      <section class="topGainers_contentmain">

        <!-- Section title -->
        <h2 class="topGainers_contentmain_title">Markets Overview</h2>

        <!-- === DESKTOP: Hot Coins + Top Volume side by side === -->
        <div class="ctn_cellMarket cell_market_hidden_mobile">
          <!-- Hot Coins card -->
          <div class="cell_market">
            <div class="cell_market_title">Hot Coins</div>
            <div class="cell_market_table">
              <!-- Header -->
              <div class="cell_market_item">
                <div class="market_item_logo"><span class="titlemkmobile titlemkmobile_active">Name</span></div>
                <div class="market_item_number mkitem_price"><span class="titlemkmobile titlemkmobile_active">Price</span></div>
                <div class="market_item_number mkitem_percent"><span class="titlemkmobile titlemkmobile_active">24h</span></div>
              </div>
              <div v-for="coin in hotCoins" :key="'hc'+coin.symbol" class="cell_market_item">
                <div class="market_item_logo">
                  <img class="market_item_logo_img" :src="coinIcon(coin.symbol)" :alt="coin.symbol" />
                  <span class="market_item_logo_text">{{ coin.symbol }}<br><small style="color:#919eab;font-size:12px;font-weight:400">{{ coin.name }}</small></span>
                </div>
                <div class="market_item_number mkitem_price">
                  <span class="mkit_text">${{ coin.price }}</span>
                </div>
                <div class="market_item_number mkitem_percent">
                  <span :class="['mkit_text', coin.change >= 0 ? 'petext_green' : 'petext_red']">
                    {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Volume card -->
          <div class="cell_market">
            <div class="cell_market_title">Top Volume Coin</div>
            <div class="cell_market_table">
              <div class="cell_market_item">
                <div class="market_item_logo"><span class="titlemkmobile titlemkmobile_active">Name</span></div>
                <div class="market_item_number mkitem_price"><span class="titlemkmobile titlemkmobile_active">Price</span></div>
                <div class="market_item_number mkitem_percent"><span class="titlemkmobile titlemkmobile_active">24h</span></div>
              </div>
              <div v-for="coin in topVolumeCoins" :key="'tv'+coin.symbol" class="cell_market_item">
                <div class="market_item_logo">
                  <img class="market_item_logo_img" :src="coinIcon(coin.symbol)" :alt="coin.symbol" />
                  <span class="market_item_logo_text">{{ coin.symbol }}<br><small style="color:#919eab;font-size:12px;font-weight:400">{{ coin.name }}</small></span>
                </div>
                <div class="market_item_number mkitem_price">
                  <span class="mkit_text">${{ coin.price }}</span>
                </div>
                <div class="market_item_number mkitem_percent">
                  <span :class="['mkit_text', coin.change >= 0 ? 'petext_green' : 'petext_red']">
                    {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- === MOBILE: Tab navigation === -->
        <div class="ctn_cellMarket_mobile">
          <div class="cell_market_mbnav">
            <span
              v-for="tab in mobileTabs"
              :key="tab.key"
              :class="['cell_market_mbnav_item', 'titlemkmobile', activeTab === tab.key ? 'titlemkmobile_active borderStart' : '']"
              @click="activeTab = tab.key"
            >{{ tab.label }}</span>
            <span class="marker" :style="markerStyle"></span>
          </div>
          <div class="cell_market_table" style="margin-top:12px;">
            <div class="cell_market_item">
              <div class="market_item_logo"><span class="titlemkmobile titlemkmobile_active">Name</span></div>
              <div class="market_item_number mkitem_price"><span class="titlemkmobile titlemkmobile_active">Price</span></div>
              <div class="market_item_number mkitem_percent"><span class="titlemkmobile titlemkmobile_active">24h</span></div>
            </div>
            <div v-for="coin in activeTabCoins" :key="'mb'+coin.symbol" class="cell_market_item">
              <div class="market_item_logo">
                <img class="market_item_logo_img" :src="coinIcon(coin.symbol)" :alt="coin.symbol" />
                <span class="market_item_logo_text">{{ coin.symbol }}</span>
              </div>
              <div class="market_item_number mkitem_price">
                <span class="mkit_text">${{ coin.price }}</span>
              </div>
              <div class="market_item_number mkitem_percent">
                <span :class="['mkit_text', coin.change >= 0 ? 'petext_green' : 'petext_red']">
                  {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- TOP GAINERS TABLE -->
        <h2 class="topGainers_contentmain_title">Top Gainers</h2>
        <div class="topGainers_table" style="width:100%;">
          <table style="width:100%;border-collapse:separate;border-spacing:0 8px;">
            <thead>
              <tr>
                <th>Market</th>
                <th>Price</th>
                <th class="table_sm_hidden">Volume</th>
                <th>24h Change</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in topGainers" :key="item.market">
                <td>
                  <div class="market">
                    <div class="iconWing">
                      <img :src="coinIcon(item.symbol)" :alt="item.symbol" style="width:100%;height:100%;object-fit:cover;" />
                    </div>
                    <span class="market_text">{{ item.market }}</span>
                  </div>
                </td>
                <td>
                  <div class="price_volume">
                    <span class="price_volume_number">${{ item.price }}</span>
                  </div>
                </td>
                <td class="table_sm_hidden">
                  <div class="price_volume">
                    <span class="price_volume_number">{{ item.volume }}</span>
                  </div>
                </td>
                <td>
                  <div class="price_volume">
                    <span :class="['price_volume_number', item.change >= 0 ? 'petext_green' : 'petext_red']">
                      {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                    </span>
                  </div>
                </td>
                <td>
                  <div class="Action">
                    <a href="/trading" class="action_button"><p>Trade</p></a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- FAQ -->
        <h2 class="topGainers_contentmain_title" style="margin-top:8px;">FAQ</h2>
        <div class="ctn_FAQ" style="width:100%;">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            :class="['faq_item', openFaq === idx ? 'faq_item_active' : '']"
            @click="openFaq = openFaq === idx ? null : idx"
          >
            <div class="faq_item_number"><p>{{ idx + 1 }}</p></div>
            <div class="faq_item_content">
              <div class="faq_item_content_quest">
                <div class="faq_item_content_title">
                  <span>{{ faq.q }}</span>
                  <div class="faq_item_top_icon">
                    <div v-if="openFaq === idx" class="icon_bg" style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
                      <svg width="11" height="2" viewBox="0 0 11 2" fill="none"><rect width="11.25" height="1.25" fill="white"/></svg>
                    </div>
                    <div v-else style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#919eab" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </div>
                  </div>
                </div>
                <div :class="['faq_item_desc', openFaq === idx ? 'faq_item_desc_active' : '']">
                  {{ faq.a }}
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

    <!-- FOOTER -->
    <footer class="hb-footer">
      <div class="hb-footer__inner">
        <div class="hb-footer__left">
          <img src="https://i.imgur.com/MvFojL5.png" alt="Logo" style="height:32px;margin-bottom:12px;" />
          <p>© 2024 Blazing Digital. All Rights Reserved.</p>
        </div>
        <div class="hb-footer__links">
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="https://tawk.to/chat/6530bf04a84dd54dc482cb8a/1hd36kajh" target="_blank">Support</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  components: { VueSlickCarousel },

  data() {
    return {
      mobileMenu: false,
      activeTab: 'hot',
      openFaq: null,

      slickSettings: {
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        pauseOnHover: true,
      },

      mobileTabs: [
        { key: 'hot', label: 'Hot Coins' },
        { key: 'volume', label: 'Top Volume' },
      ],

      hotCoins: [
        { symbol: 'BTC', name: 'Bitcoin',  price: '73,966.00', change: -0.92 },
        { symbol: 'BNB', name: 'BNB',      price: '614.15',    change: -0.69 },
        { symbol: 'ETH', name: 'Ethereum', price: '2,320.31',  change: -2.89 },
      ],

      topVolumeCoins: [
        { symbol: 'ETH', name: 'Ethereum', price: '2,320.31', change: -2.89 },
        { symbol: 'BTC', name: 'Bitcoin',  price: '73,966.00', change: -0.92 },
        { symbol: 'XRP', name: 'XRP',      price: '1.352',    change: -1.51 },
      ],

      topGainers: [
        { symbol: 'BTC', market: 'BTC / USDT', price: '73,966.00', volume: '24.32K',  change: -0.92 },
        { symbol: 'ETH', market: 'ETH / USDT', price: '2,320.31',  volume: '369.40K', change: -2.89 },
        { symbol: 'BNB', market: 'BNB / USDT', price: '614.15',    volume: '155.65K', change: -0.69 },
        { symbol: 'XRP', market: 'XRP / USDT', price: '1.352',     volume: '95.20M',  change: -1.51 },
        { symbol: 'ADA', market: 'ADA / USDT', price: '0.2398',    volume: '128.66M', change: -0.45 },
        { symbol: 'SOL', market: 'SOL / USDT', price: '83.01',     volume: '3.34M',   change:  2.14 },
        { symbol: 'TRX', market: 'TRX / USDT', price: '0.3221',    volume: '127.38M', change:  0.88 },
      ],

      faqs: [
        {
          q: 'What is Blazing Digital?',
          a: 'Blazing Digital is a large and reputable cryptocurrency exchange in the market. The platform provides buying, selling and trading services for cryptocurrencies such as Bitcoin, Ethereum, Litecoin and many other altcoins.',
        },
        {
          q: 'How to start investing in Blazing Digital?',
          a: 'Choose Blazing Digital exchange → Set up an account → Fund your account with fiat currency → Decide which cryptocurrency to buy → Place an order to buy your chosen cryptocurrency.',
        },
        {
          q: 'Blazing Digital offers a wide range of tools for technical analysis.',
          a: 'Price charts: Blazing Digital provides detailed price charts for real-time monitoring. Supports technical indicators such as Moving Average (MA), Relative Strength Index (RSI), Bollinger Bands and many other indicators.',
        },
        {
          q: 'P2P DEPOSIT AND WITHDRAW',
          a: 'P2P (peer-to-peer) deposit and withdrawal is the process of transferring money directly between individuals without going through any intermediary. This helps reduce transaction costs and time, while increasing safety.',
        },
        {
          q: 'Protect customer\'s assets and information on Blazing Digital',
          a: 'Blazing Digital applies two-factor authentication (2FA) and maintains a clear privacy policy so users understand how their personal information is used and protected.',
        },
        {
          q: 'What determines cryptocurrencies price changes?',
          a: 'Price changes are determined by: Supply and demand, Market news and events, Volatility of the stock market, commodity market, or foreign exchange market.',
        },
      ],
    }
  },

  computed: {
    isLogin() {
      return this.$store.state.isLogin
    },
    activeTabCoins() {
      return this.activeTab === 'hot' ? this.hotCoins : this.topVolumeCoins
    },
    markerStyle() {
      const idx = this.mobileTabs.findIndex(t => t.key === this.activeTab)
      return { left: (idx * 100) + 'px', width: '80px' }
    },
  },

  methods: {
    coinIcon(symbol) {
      return `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Sarabun', Helvetica, Arial, sans-serif;
  background: #0f1317;
  color: #f9fafb;
  overflow-x: hidden;
}
</style>

<style lang="scss" scoped>
/* ─── Variables ─── */
$bg:      #0f1317;
$card-bg: rgba(77, 127, 248, 0.08);
$primary: #2b67f8;
$text:    #f9fafb;
$text2:   #dfe3e8;
$muted:   #919eab;
$green:   #00ab55;
$red:     #f13a3a;
$nav-h:   64px;

/* ─── Navbar ─── */
.hb-navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(15, 19, 23, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(77, 127, 248, 0.15);
}

.hb-navbar__inner {
  display: flex;
  align-items: center;
  gap: 32px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  height: $nav-h;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

.hb-logo img {
  height: 36px;
  display: block;
}

.hb-nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;

  @media (max-width: 768px) { display: none; }
}

.hb-nav-link {
  color: $muted;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color .2s;

  &:hover, &.router-link-exact-active { color: $text; }
}

.hb-nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) { display: none; }
}

.hb-btn-outline {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 8px;
  border: 1.5px solid $primary;
  color: $primary;
  text-decoration: none;
  font-size: 14px;
  font-weight: 510;
  transition: all .2s;

  &:hover { background: $primary; color: #fff; }
}

.hb-btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 8px;
  background: $primary;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 510;
  transition: opacity .2s;

  &:hover { opacity: .85; }
}

.hb-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: $text;
    border-radius: 2px;
  }

  @media (max-width: 768px) { display: flex; }
}

.hb-mobile-menu {
  display: flex;
  flex-direction: column;
  background: #131928;
  border-top: 1px solid rgba(77,127,248,.1);
  max-height: 0;
  overflow: hidden;
  transition: max-height .3s ease;

  &.open { max-height: 400px; }
}

.hb-mb-link {
  padding: 14px 20px;
  color: $text2;
  text-decoration: none;
  font-size: 15px;
  border-bottom: 1px solid rgba(255,255,255,.05);
  transition: color .2s;

  &:hover { color: $text; }
  &--primary { color: $primary; font-weight: 600; }
}

.hb-mb-divider {
  height: 1px;
  background: rgba(77,127,248,.2);
  margin: 4px 0;
}

/* ─── Page wrapper ─── */
.home-body {
  min-height: 100vh;
  background: $bg;
  font-size: 16px;
  line-height: 1.5;
}

.hb-page {
  padding-top: $nav-h;
}

/* ─── Banner ─── */
.hb-banner {
  width: 100%;
  overflow: hidden;
}

.hb-slide img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;

  @media (max-width: 768px) { height: 200px; }
}

/* ─── Content main ─── */
.topGainers_contentmain {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 120px;

  @media (min-width: 768px) and (max-width: 1200px) {
    padding: 32px 40px;
  }
  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
}

/* ─── Section title ─── */
.topGainers_contentmain_title {
  color: $text;
  font-family: 'SF Pro Display', 'Sarabun', sans-serif;
  font-weight: 600;
  line-height: 40px;
  font-size: 32px;

  @media (min-width: 768px) and (max-width: 1200px) {
    font-size: 24px;
    line-height: 32px;
  }
  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 28px;
  }
}

/* ─── Side-by-side coin cards ─── */
.ctn_cellMarket {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
}

.cell_market {
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;
  border-radius: 8px;
  background: $card-bg;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
}

.cell_market_title {
  color: $text;
  font-size: 14px;
  font-weight: 590;
  line-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 16px;
  }
}

.cell_market_table {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  align-self: stretch;
  width: 100%;
}

.cell_market_item {
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

.market_item_logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 0 0;

  @media (max-width: 768px) { gap: 8px; }
}

.market_item_logo_img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
}

.market_item_logo_text {
  color: $text;
  font-size: 16px;
  font-weight: 590;
  line-height: 24px;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
}

.market_item_number {
  display: flex;
  padding: 4px 0;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
}

.mkitem_price { justify-content: center; }
.mkitem_percent { justify-content: flex-end; }

.mkit_text {
  color: $text;
  font-size: 16px;
  font-weight: 590;
  line-height: 24px;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
}

.petext_green { color: $green; }
.petext_red   { color: $red; }

.titlemkmobile {
  color: $muted;
  font-size: 12px;
  font-weight: 590;
  line-height: 16px;
  letter-spacing: -.12px;
}

.titlemkmobile_active { color: $text; }

/* ─── Mobile tabs ─── */
.cell_market_hidden_mobile {
  @media (max-width: 768px) { display: none !important; }
}

.ctn_cellMarket_mobile {
  display: none;
  width: 100%;
  background: $card-bg;
  border-radius: 8px;
  padding: 16px;

  @media (max-width: 768px) { display: block; }
}

.cell_market_mbnav {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  padding-bottom: 8px;
}

.cell_market_mbnav_item {
  cursor: pointer;
  position: relative;
  z-index: 1;
  padding-bottom: 8px;
}

.borderStart {
  border-bottom: 2px solid $primary;
  color: $text;
}

.marker {
  position: absolute;
  left: 0;
  height: 2px;
  width: 0;
  background: $primary;
  bottom: 0;
  transition: all .3s ease;
}

/* ─── Top Gainers Table ─── */
.topGainers_table {
  width: 100%;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
  }

  th {
    padding: 0 8px 4px 8px;
    color: $muted;
    font-size: 14px;
    font-weight: 510;
    line-height: 20px;
    letter-spacing: .7px;
    text-transform: uppercase;
    text-align: center;

    &:first-child { text-align: left; }

    @media (max-width: 768px) {
      font-size: 12px;
      line-height: 16px;
      letter-spacing: .6px;
    }
  }

  td { vertical-align: top; }
  td:first-child { text-align: left; }

  .table_sm_hidden {
    @media (max-width: 768px) { display: none; }
  }

  .market {
    display: flex;
    padding: 20px;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    border-radius: 8px 0 0 8px;
    background: $card-bg;

    @media (max-width: 768px) {
      gap: 8px;
      padding: 16px 12px;
    }
  }

  .iconWing {
    width: 32px;
    height: 32px;
    border-radius: 144px;
    overflow: hidden;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }

  .market_text {
    color: $text;
    font-size: 16px;
    font-weight: 590;
    line-height: 24px;
    white-space: nowrap;

    @media (max-width: 768px) {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }

  .price_volume {
    display: flex;
    padding: 24px 12px;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    justify-content: center;
    background: $card-bg;

    @media (max-width: 768px) {
      padding: 16px 8px;
    }
  }

  .price_volume_number {
    color: $text;
    text-align: center;
    font-size: 16px;
    font-weight: 590;
    line-height: 24px;

    @media (max-width: 768px) {
      font-size: 14px;
      line-height: 20px;
    }
  }

  .Action {
    display: flex;
    padding: 16px 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 0 8px 8px 0;
    background: $card-bg;
  }

  .action_button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 89px;
    height: 40px;
    padding: 0 8px;
    border-radius: 8px;
    border: 2px solid $primary;
    text-decoration: none;
    cursor: pointer;
    transition: background .2s;

    p {
      color: $primary;
      font-size: 14px;
      font-weight: 510;
      line-height: 20px;
    }

    &:hover {
      background: $primary;
      p { color: #fff; }
    }
  }
}

/* ─── FAQ ─── */
.ctn_FAQ {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;

  @media (max-width: 768px) { gap: 8px; }
}

.faq_item {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 16px;
  align-self: stretch;
  border-radius: 8px;
  cursor: pointer;
  transition: background .2s;

  &:hover { background: $card-bg; }
}

.faq_item_active {
  background: $card-bg;
}

.faq_item_number {
  display: flex;
  padding: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid rgba(77, 127, 248, .48);
  background: $bg;
  flex-shrink: 0;

  p {
    color: $text;
    text-align: center;
    font-size: 16px;
    font-weight: 590;
    line-height: 24px;
    width: 24px;
  }
}

.faq_item_content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  position: relative;
}

.faq_item_content_quest {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.faq_item_content_title {
  color: $text2;
  font-weight: 590;
  line-height: 24px;
  font-size: 18px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
}

.faq_item_top_icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon_bg {
  border-radius: 50%;
  background: $primary;
}

.faq_item_desc {
  color: $muted;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  transition: all .3s ease-in;
  flex: 1 0 0;
  height: 0;
  opacity: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
}

.faq_item_desc_active {
  height: auto;
  min-height: 60px;
  opacity: 1;

  @media (max-width: 768px) { min-height: 80px; }
}

/* ─── Footer ─── */
.hb-footer {
  background: #070a0f;
  border-top: 1px solid rgba(77,127,248,.12);
  margin-top: 40px;
}

.hb-footer__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 120px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 24px 16px;
    flex-direction: column;
  }
}

.hb-footer__left p {
  color: $muted;
  font-size: 13px;
}

.hb-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  a {
    color: $muted;
    text-decoration: none;
    font-size: 14px;
    transition: color .2s;

    &:hover { color: $text; }
  }
}
</style>

<style>
.slick-arrow { display: none !important; }
.slick-dots { bottom: 12px !important; }
.slick-dots li button:before { color: #fff !important; opacity: 0.5 !important; }
.slick-dots li.slick-active button:before { opacity: 1 !important; color: #2b67f8 !important; }
</style>
