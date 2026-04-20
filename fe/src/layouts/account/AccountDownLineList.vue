<template>
  <div>
    <h3 class="ml-8 mb-5">
      <vs-button type="line" class="mr-2" @click="$emit('close')"
        >Trở về</vs-button
      >
    </h3>
    <div class="ml-8 mb-5">
      <h5>Tổng nạp: <span style="color: rgb(23, 201, 100)">{{ formatPrice((data.nap || {}).amount || 0) }} </span></h5>
      <h5>Tổng rút: <span style="color: rgb(242, 19, 93)">{{ formatPrice((data.rut || {}).amount || 0) }} </span></h5>
      <h5>Tổng Chơi: <span style="color: rgb(255, 130, 0)">{{ formatPrice(data.bet.amount || 0) }} </span></h5>
      <h5>Tổng Thắng: <span style="color: rgb(23, 201, 100)">{{ formatPrice(data.bet.win || 0) }} </span></h5>
      <h5>Tổng Thua: <span style="color: rgb(242, 19, 93)"> {{ formatPrice(data.bet.lose || 0) }} </span></h5>
    </div>
    <AccountAllMemberList :ref-code="data.user.ref_code" />
  </div>
</template>

<script>
import AccountAllMemberList from "./AccountAllMemberList.vue";
export default {
  props: ['data'],
  components: {
    AccountAllMemberList,
  },

  methods: {
    formatPrice(value, minimum) {
      var formatter = new Intl.NumberFormat("en-US", {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum,
      });
      return formatter.format(value);
    },
  },
};
</script>

<style>
</style>