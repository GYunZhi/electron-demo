<template>
  <div class="session">
    <el-divider>cookie 设置</el-divider>
    <el-button type="primary" @click="setCookie">设置 cookie</el-button>
    <el-button type="primary" @click="getCookie">获取 cookie</el-button>
    
    <p>cookie 值 {{ cookie  }}</p>

    <el-divider>使用 net 模块来发送网络请求</el-divider>
    <el-input placeholder="请输入 url" v-model="url">
      <el-button slot="append" icon="el-icon-search" @click="sendRequest">发送</el-button>
    </el-input>
    <p>返回值 {{ response }}</p>

    <el-divider>使用 resolveHost 解析 ip 地址</el-divider>
    <el-input placeholder="请输入域名" v-model="host">
      <el-button slot="append" icon="el-icon-search" @click="resolveHost">发送</el-button>
    </el-input>
    <p>返回值 {{ resolvedIP }}</p>
  </div>
</template>

<script>
const { getGlobal, session } = require('@electron/remote')

// 访问主进程的全局变量
const { cookieManager, netRequest } = getGlobal('sharedData')

export default {
  name: 'session',
  data() {
    return {
      cookie: '',
      url: 'https://tenapi.cn/v2/getip',
      host: 'zuoyebang.com',
      response: null,
      resolvedIP: ''
    }
  },
  methods: {
    setCookie() {
      const url = location.href
      const cookieString = 'myCookieValue=12345'
      cookieManager.setCookie(url, 'name', 'gongyz')
      console.log('setCookie', url, cookieString)
    },
    async getCookie() {
      const url = location.href
      this.cookie = await cookieManager.getCookie(url, 'name')
    },
    async sendRequest () {
      this.response = await netRequest.request(this.url)
    },
    async resolveHost () {
      // resolveHost 方法支持 DNS over HTTPS (DoH)
      this.resolvedIP = await session.defaultSession.resolveHost(this.host)
    }
  }
}
</script>

<style scoped lang="scss"></style>
