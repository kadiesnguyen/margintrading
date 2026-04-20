<template>
  <div class="copy-wrapper">
    <div @click="copy">
      <slot> </slot>
    </div>
    <div v-if="success" class="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "message", "time"],

  data() {
    return {
      success: false,
    };
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.value);
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, this.time || 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-wrapper {
  position: relative;

  .message {
    position: absolute;
    top: -130%;
    background: #9d9d9d;
    display: block;
    left: 0;
    padding: 5px 7px;
    border-radius: 5px;
    color: white;
  }
}
</style>