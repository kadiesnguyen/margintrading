<template>
  <div class="full-page">
    <div class="web-left-block w-full lg:w-1/2"></div>
    <div class="flex items-center justify-center w-full lg:w-1/2 px-4">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" >
@import "@/assets/client/scss/responsive";

.web-left-block {
  max-width: 100%;
  padding: 0 50px;
  //
  background: url('https://i.imgur.com/ls1vZdu.jpg') center center
    no-repeat;
  background-size: cover;

  @include max-lg{
    padding-top: 100%;
  }
}
</style>
<style lang="scss" scoped>
.full-page {
  max-width: 100%;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
}
</style>
