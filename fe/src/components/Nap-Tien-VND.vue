<template>
  <div>
    <div class="tab-wrapper">
      <ul class="nav nav-tabs nav-justified">
        <li class="nav-item" v-for="bank in banksName" :key="bank.name" @click.prevent="setActive(bank.name)" :class="{ active: isActive(bank.name) }">
          <div class="nav-link">
            <img class="bankIcon" :src="bank.icon">
            <div class="bankInfo">
              <div class="bankName">{{ bank.name }}</div>
              <div class="bankTime">1-5 phút</div>
            </div>
          </div>
        </li>
      </ul>

      <div class="wrapper-money">
        <div class="money-item" v-for="moneyItem in breakMoney" :key="moneyItem" @click="changeMoney(moneyItem)">
          {{ formatPrice(moneyItem) }} ₫
        </div>
      </div>
    </div>

    <vs-checkbox v-model="accept">Theo như vậy, tôi đồng ý với <span style="color: #DE7223">Điều khoản và Điều kiện</span></vs-checkbox>

    <vs-alert v-if="amount && accept" style="margin-top: 10px;">
      Số tiền quy đổi <b>{{ formatPrice(Math.round(amount / getSetSys.quotePriceVND), 0) }}$</b>
    </vs-alert>

    <div class="wrapper-continue" v-if="accept">
      <div class="boxAddress relative mt-4">
          <h4 class="colorSecondary2">Giá trị VNĐ</h4>
          <input type="number" v-model="amount" :placeholder="`Số tiền tối thiểu: ${formatPrice(400000)} VNĐ`" class="form-control">
      </div>

      <vs-button
          icon-pack="feather"
          icon="icon-arrow-right"
          icon-after
          color="#fff"
          type="border"
          @click="submit"
      >
          Tiếp tục
      </vs-button>
    </div>
  </div>
</template>

<script>
import getSetSys  from '@/services/settingSys.json'

export default {
  data() {
    return {
      getSetSys: getSetSys,
      activeItem: 'home',
      banksName: [
        {
          name: 'VIB',
          icon: require('@/assets/images/sky/icon_bank/VIB-mini.svg'),
        },
        {
          name: 'TPBank',
          icon: require('@/assets/images/sky/icon_bank/TP-mini.svg'),
        },
        {
          name: 'SHB',
          icon: require('@/assets/images/sky/icon_bank/SHB-mini.svg'),
        },
      ],
      breakMoney: [
        300000000,
        150000000,
        60000000,
        20000000,
        10000000,
        5000000,
        2000000,
        1000000,
        500000,
        400000,
      ],
      amount: 0,
      accept: false,
    }
  },
  methods: {
    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
    },
    changeMoney(newMoney) {
      this.amount = newMoney;
    },
    formatPrice(value, minimum) {
        var formatter = new Intl.NumberFormat('en-US', {
            //style: 'currency',
            //currency: '',
            minimumFractionDigits: minimum
        });
        return formatter.format(value);
    },
    submit() {
      this.$emit("submitBank", {
        moneyVND: this.amount,
      });
    }
  }
}
</script>

<style scoped lang="scss">
  .fade {
    display: none;
  }
  .show {
    display: block;
  }

  .active {
      background: #2F3547;
  }

  .tab-wrapper {
    display: flex;
    .nav {
      margin-right: 20px;
    }

    .nav-item {
      border-bottom: 1px solid #2F3547;
      border-radius: 2px;
      padding: 10px 20px;
      transition: .2s;
      cursor: pointer;

      &:hover {
        background: #2F3547;
      }
    }


    .nav-link {
      display: flex;
      align-items: center;
      width: 150px;

      .bankIcon {
        width: 30px;
        object-fit: cover;
        margin-right: 10px;
      }

      .bankName {
        font-size: 15px;
      }

      .bankTime {
        color: #8A90A1;
      }
    }

    .wrapper-money {
      display: flex;
      flex-wrap: wrap;
    }

    .money-item {
      margin-right: 10px;
      flex-basis: calc(50% - 10px);
      border: 1px solid #2F3547;
      border-radius: 2px;
      transition: .2s;
      cursor: pointer;

      display: flex;
      align-items: center;
      padding: 10px 0 10px 10px;

      margin-bottom: 10px;

      &:hover {
        background: #2F3547;
      }
    }
  }


  .wrapper-continue {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;

    .boxAddress {
      flex-basis: 60%;
      margin-right: 10px;
    }

    .usd-transfer {
      flex-basis: calc(40% - 10px);
    }
  }

  .boxAddress h4.colorSecondary2 {
      background: #111111;
      font-size: 12px;
      line-height: 14px;
      color: #778e9f;
      font-weight: 400;
      margin: 0;
      position: absolute;
      top: -6px;
      left: 30px;
      padding: 0 6px;
  }

  .boxAddress input {
      font-size: 14px;
      border: 1px solid #2f3342;
      border-radius: 8px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
  }

  .boxAddress .form-group {
      margin-bottom: 20px;
  }
</style>