<template>
  <div class="session">
    <el-button type="primary" @click="setCookie">设置 cookie</el-button>
    <el-button type="primary" @click="getCookie">获取 cookie</el-button>
    <el-divider>cookie 值</el-divider>
    <p>{{ cookie  }}</p>
  </div>
</template>

<script>
const { remote } = require('electron')

// 访问主进程的全局变量
const { cookieManager } = remote.getGlobal('sharedData')

export default {
  name: 'session',
  data() {
    return {
      cookie: ''
    }
  },
  methods: {
    setCookie() {
      const url = location.href
      const cookieString = 'myCookieValue=12345'
      cookieManager.setCookie(url, cookieString)
    },
    getCookie() {
      const url = location.href
      console.log(cookieManager.getCookie(url))
      this.cookie = cookieManager.getCookie(url)
    }
  }
}
</script>

<style scoped lang="scss"></style>
