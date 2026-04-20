<template>
  <transition name="fade">
    <div
      class="modal-container"
      v-if="isShowModal"
      @click.self="$emit('close')"
    >
      <div class="v-modal">
        <div class="header">
          <h2 class="title">
            <slot name="title"> </slot>
            <button
              type="button"
              class="fa fa-times close"
              @click="$emit('close')"
            ></button>
          </h2>
        </div>
        <div class="content">
          <slot name="content"> </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["isShowModal"],
};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/responsive.scss";
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba($color: #000000, $alpha: 0.2);
  padding: 20px;
  .v-modal {
    max-width: 1366px;
    position: relative;
    // display: block;
    height: calc(100% - 40px);
    overflow: hidden;
    background: white;
    margin: 20px auto;

    .header {
      position: relative;
      .title {
        display: block;
        width: 100%;
        background-color: #5a5a5a;
        padding: 0.8rem 1.5rem;
        color: #fff;
        font-weight: bold;
        font-size: 1.5rem;
        font-family: -apple-system, BlinkMacSystemFont, "Microsoft Jheng Hei",
          "PingFang", "蘋方", "微軟正黑體", "Segoe UI", Roboto, "Helvetica Neue",
          Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol" !important;
        text-align: center;
      }

      .close {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 20px;

        color: #ffffff;
      }
    }

    .content {
      height: calc(100% - 62px);
      overflow: auto;
      padding: 1rem;
    }
  }
}

.fade-enter-active, .fade-leave-active  {
  transform: translateY(0);
  transition: transform 0.5s ease,  opacity 0.25s;
  // transition: opacity 0.5s ease;

}
.fade-enter,
.fade-leave-to {
  transform: translateY(-30%);
  opacity: 0;
}
</style>