<template>
  <div class="app-wrapper clearfix">
    <c-sidebar></c-sidebar>
    <div class="main-container" :style="{ 'padding-left': sidebar.width + 'px' }">
      <c-app-main></c-app-main>
    </div>
  </div>
</template>

<script>
import CSidebar from '@/components/CSidebar'
import CAppMain from '@/components/CAppMain'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  components: {
    CSidebar,
    CAppMain
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
