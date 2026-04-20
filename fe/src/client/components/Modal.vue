<template>
  <div class="swal-overlay" v-if="active" @click.self="close">
    <div class="swal-modal">
      <div class="swal-title text-black">
        {{title}}
      </div>
      <div class="swal-footer">
        <div class="swal-button-container">
          <button class="swal-button" :class="type" @click="close">Đóng</button>
          <div class="swal-button__loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "active", "closed", "type"],
  methods: {
    async close() {
      if(this.closed){
        await this.closed();
      }
      this.$emit("close");
    },
  },

};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/color";
.swal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  opacity: 1;
  transition: opacity 0.3s;
  &::before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    height: 100vh;
  }
  .swal-modal {
    width: 478px;
    background-color: #fff;
    text-align: center;
    margin: 20px auto;
    display: inline-block;
    vertical-align: middle;
    transform: scale(1);
    transform-origin: 50% 50%;
    z-index: 200;
    box-shadow: 0px 1px 10px black;
    border-radius: 8px;
    animation: show 0.3s ease;

    @media screen and (max-width: 560px ) {
        width: calc(100% - 20px);
    }

    .swal-title {
      color: rgba(0, 0, 0, 0.65);
      font-weight: 600;
      text-transform: none;
      position: relative;
      display: block;
      padding: 13px 16px;
      font-size: 27px;
      line-height: normal;
      text-align: center;
      margin-bottom: 0;
      font-size: 18px;
    }

    .swal-footer {
      text-align: center;
      padding-top: 13px;
      margin-top: 13px;
      padding: 13px 16px;
      border-radius: inherit;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    .swal-button {
      background-color: $primary;
      color: #fff;
      border: none;
      box-shadow: none;
      border-radius: 5px;
      font-weight: 600;
      font-size: 14px;
      padding: 10px 24px;
      margin: 0;
      cursor: pointer;
      transition: 0.3s background;
      &.danger{
        background-color: $danger;
        &:hover{
          background: rgba($danger, 0.5)
        }
      }
      &:hover{
        background: #fd961ae6;
      }
    }
  }
}

@keyframes show {
  0% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.1);
  }
  80% {
    transform: scale(0.75);
  }
  100% {
    transform: scale(1);
  }
}
</style>
