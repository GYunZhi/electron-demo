<template>
  <div class="app-wrapper clearfix">
    <c-sidebar></c-sidebar>
    <div class="main-container" :style="{ 'padding-left': 180 + 'px' }">
      <c-app-main></c-app-main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
  .main-container {
    box-sizing: border-box;
    transition: padding 0.28s;
    width: 100%;
    min-height: 100%;
  }
}
</style>
