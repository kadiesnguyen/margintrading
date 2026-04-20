<template>
  <div class="drawing-toolbar">
    <div class="drawing-toolbar-content" v-for="n in toolIcons" :key="n">
      <img :src="'/img/draw' + n + '.svg'" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DrawTool',
  data() {
    return {
      toolIcons: [1, 2, 3, 4, 5, 6, 7, 13, 14]
    }
  }
}
</script>

<style scoped>
.drawing-toolbar {
  border-left: 1px solid rgba(255,255,255,0.12);
  border-right: 1px solid rgba(255,255,255,0.12);
  background-color: #0f1317;
  padding: 3px 0;
  flex-direction: column;
  gap: 2px;
  width: 35px;
  display: flex;
}
.drawing-toolbar-content {
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  cursor: pointer;
}
.drawing-toolbar-content img {
  width: 28px;
  height: 28px;
}
</style>
