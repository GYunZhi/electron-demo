<template>
  <div class="ipc">
    <el-divider>在 BrowserView 中显示独立的网页内容</el-divider>
    <el-button @click="createBV">打开新标签页</el-button>
    <el-button @click="closeBV">关闭新标签页</el-button>
  </div>
</template>

<script>
const { BrowserView, getCurrentWindow } = require('electron').remote
const mainWindow = getCurrentWindow()
let view

export default {
  name: 'ipc',
  data() {
    return {}
  },
  methods: {
    createBV() {
      if (view) return
      view = new BrowserView()
      mainWindow.setBrowserView(view)
      view.setBounds({ x: 700, y: 0, width: 300, height: 300 })
      view.webContents.loadURL('https://baidu.com')

      console.log(view)
    },
    closeBV() {
      mainWindow.removeBrowserView(view)
      view.webContents.destroy()
    }
  }
}
</script>

<style lang="scss">
.el-message-box__content {
  overflow-wrap: break-word;
}
</style>
