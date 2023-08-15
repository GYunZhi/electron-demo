const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')

console.log('load preload.js')

// 关闭上下文隔离
// window.electronAPI = {
//   node: process.versions.node,
//   chrome: process.versions.chrome,
//   electron: process.versions.electron,
//   sendMessage: message => ipcRenderer.send('message', message)
// }

// 开启上下文隔离
// contextBridge.exposeInMainWorld('electronAPI', {
//   node: process.versions.node,
//   chrome: process.versions.chrome,
//   electron: process.versions.electron,
//   sendMessage: message => ipcRenderer.send('message', message)
// })

// 操作 DOM
// preload.js 脚本注入的时机非常早，执行该脚本的时候，Web 页面还没有开始解析，所以不能立即操作 DOM，需要在 DOMContentLoaded 事件之后再操作
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#app').onclick = () => {
    // console.log('preload.js 操作 DOM')
  }
})

window.readFile = function () {
  const txt = fs.readFileSync(path.join(__dirname, '../index.ejs')).toString()
  console.log('11', txt)
  return txt
}

