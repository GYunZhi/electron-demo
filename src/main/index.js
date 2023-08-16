import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import * as apis from 'electron'
import CookieManager from './utils/cookie'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// 单一实例
const gotTheLock = app.requestSingleInstanceLock()

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    useContentSize: true,
    title: '主窗口',
    webPreferences: {
      icon: require('path').resolve(__dirname, '../../static/ico.png'),

      enableRemoteModule: true, // 是否启用 Remote 模块，设置为 true 时，在渲染进程中可以使用 remote 模块来调用主进程的模块和方法，以便进行进程间通信和访问底层系统功能。

      nodeIntegration: true, // 启用 Node.js 环境（从 Electron 5 开始，nodeIntegration 默认值被更改为 false）
      contextIsolation: false, // 关闭上下文隔离（从 Electron 12 开始，contextIsolation 默认值被更改为 true）
      sandbox: false, // 是否启用沙箱环境（（从 Electron 20 开始，sandbox 默认值被更改为 true））
      preload: require('path').resolve(__dirname, '../preload/index.js'), // 在 preload 脚本中访问 node 的 API

      webSecurity: false, // 关闭启同源策略，默认是开启的
      devTools: true
    }
  })

  mainWindow.loadURL(winURL)
  // mainWindow.loadFile(require('path').resolve(__dirname, '../renderer/test.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

Menu.setApplicationMenu(null)

/**
 * 单一实例
 */
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时，将会聚焦到 mainWindow 这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  app.on('ready', () => {
    createWindow()

    /************************** 实例化工具类 ****************************/
    const cookieManager = new CookieManager()


    /************************** 接收渲染进程的消息 ****************************/
    // 同步消息
    ipcMain.on('sync-render', (event, data) => {
      event.returnValue = '我收到了同步消息，这是我的回复：啦啦啦'
    })

    // 异步消息（send）
    ipcMain.on('async-render', (event, data) => {
      event.reply('async-reply', '我收到了异步消息，这是我的回复：啦啦啦')
    })

    // 异步消息（invoke）
    // 注意：相同的事件名称，on 方法可以注册多次，但是 handle 方法只能注册一次，否则会报错
    ipcMain.handle('invoke-render', (event, args) => {
      return '我收到了异步消息(invoke)，这是我的回复：啦啦啦'
    })
    

    /************************** 向渲染进程发送消息 ****************************/
    ipcMain.handle('send-a-message', (event, args) => {
      mainWindow.webContents.send('main-msg', `这是一条来自主进程的消息 + ${new Date().getTime()}`)
    })


    /************************** 设置全局变量 ****************************/
    global.sharedData = {
      mainApi: Object.keys(apis),

      name: 'Gavin',
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron,

      cookieManager
    }
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // if (mainWindow === null) {
  //   createWindow()
  // }
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 网页应用调起桌面程序
// This will catch clicks on links such as <a href="callup-demo://abc=1">open in demo</a>
app.on('open-url', function(event, data) {
  event.preventDefault()
  console.log('open by web:', data)
})
// app.removeAsDefaultProtocolClient('callup-demo')
// app.setAsDefaultProtocolClient('callup-demo')

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
