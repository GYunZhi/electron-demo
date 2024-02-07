<template>
  <div class="apis">
    <div class="col">
      <h4>主进程可调用 API</h4>
      <ul>
        <li v-for="item in mainApi" :key="item">{{ item }}</li>
      </ul>
    </div>

    <div class="col">
      <h4>渲染进程可调用 API</h4>
      <ul>
        <li v-for="item in renderApi" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as apis from 'electron'
const { getGlobal } = require('@electron/remote')

// 访问主进程的全局变量
const { mainApi } = getGlobal('sharedData')

export default {
  name: 'apis',
  data() {
    return {
      renderApi: Object.keys(apis),
      mainApi
    }
  }
}
</script>

<style scoped lang="scss">
.apis {
  display: flex;
  .col {
    flex: 1;
    h4 {
      margin-bottom: 18px;
    }
  }

  li + li {
    margin-top: 2px;
  }
}
</style>
