<template>
  <div class="ipc">
    <el-divider>渲染进程到主进程通信</el-divider>
    <el-button type="primary" @click="sendMessage('sync')">发送同步消息</el-button>
    <el-button type="primary" @click="sendMessage('async')">发送异步消息 send</el-button>
    <el-button type="primary" @click="sendMessage('invoke')">发送异步消息 invoke</el-button>
    <p class="reply">主进程回复的消息: {{ reply }}</p>

    <el-divider>接收主进程的消息</el-divider>
    <el-button type="primary" @click="postMessage">模拟主进程触发消息通知</el-button>
    <p class="reply">消息内容: {{ msg }}</p>

    <el-divider>使用 remote 直接调用主进程模块</el-divider>
    <el-button type="primary" @click="handleRemote">打开一个 dialog</el-button>

    <el-divider>使用 remote 访问主进程的全局变量</el-divider>
    <p class="share-data">{{ sharedData }}</p>
  </div>
</template>

<script>
const { remote, ipcRenderer } = require('electron')

export default {
  name: 'ipc',
  data() {
    return {
      msg: '',
      reply: '',
      sharedData: {}
    }
  },
  mounted() {
    ipcRenderer.on('main-msg', (event, msg) => {
      this.msg = msg
    })

    // 访问主进程的全局变量
    const { name, node, chrome, electron } = remote.getGlobal('sharedData')
    this.sharedData = { name, node, chrome, electron }
  },
  methods: {
    postMessage() {
      ipcRenderer.invoke('send-a-message')
    },
    sendMessage(type) {
      if (type === 'sync') {
        const msg = ipcRenderer.sendSync('sync-render', '我是来自渲染进程的同步消息')
        this.reply = msg
      } else if (type === 'async') {
        ipcRenderer.send('async-render', '我是来自渲染进程的异步消息')
        ipcRenderer.on('async-reply', (event, value) => {
          this.reply = value
        })
      } else if (type === 'invoke') {
        ipcRenderer.invoke('invoke-render', '我是来自渲染进程的异步 Promise 消息').then(value => (this.reply = value))
      }
    },
    handleRemote() {
      remote.dialog.showErrorBox('主进程才有的 dialog 模块', '我是使用 remote 调用的')
    }
  }
}
</script>

<style lang="scss" scoped>
.reply {
  margin: 20px 0;
  color: #f00;
}
.share-data {
  margin: 20px 0;
}
</style>

<style lang="scss">
.el-message-box__content {
  overflow-wrap: break-word;
}
</style>
