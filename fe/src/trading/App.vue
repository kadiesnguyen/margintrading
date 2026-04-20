<template>
  <div>
    <nav-bar />
    <trading-view />
  </div>
</template>
<script>
import TradingView from "./views/TradingView.vue";
import NavBar from "./components/NavBar"
export default {
  components: { TradingView, NavBar },

  created() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    window.addEventListener("resize", () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    });
  },
};
</script>
