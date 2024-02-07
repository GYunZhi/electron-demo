<template>
  <div class="ipc">
    <el-divider>在 BrowserView 中显示独立的网页内容</el-divider>
    <el-button @click="createBV">创建标签页</el-button>
    <el-button @click="removeBv">关闭标签页</el-button>
    <el-button @click="destroyBV">销毁标签页</el-button>
  </div>
</template>

<script>
const { BrowserView, getCurrentWindow } = require('@electron/remote')
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
      view.setBounds({ x: 700, y: 0, width: 300, height: 300 }) // 指定相对宿主窗口的偏移坐标和容器大小
      view.webContents.loadURL('https://baidu.com')

      // 窗口内嵌视图容器（一个窗口可以内嵌多个 BrowserView）
      mainWindow.addBrowserView(view)
    },
    removeBv() {
      view && mainWindow.removeBrowserView(view)
    },
    destroyBV() {
      view.webContents.destroy()
      view = null
    },
    
  }
}
</script>

<style lang="scss">
.el-message-box__content {
  overflow-wrap: break-word;
}
</style>
