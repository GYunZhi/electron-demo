<template>
  <section class="app-main">
    <!-- <transition name="fade" mode="out-in"> -->
    <router-view></router-view>
    <!-- </transition> -->
  </section>
</template>

<script>
export default {
  name: 'CAppMain'
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
  width: 100%;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
