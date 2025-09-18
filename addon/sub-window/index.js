/**
 * 测试原生窗口嵌入到 Electron BrowserWindow 内
 * 参考：https://zhuanlan.zhihu.com/p/620300579
 */

const { app, BrowserWindow, ipcMain, BrowserView } = require('electron')
const addon = require('./build/Release/addon') // 编译后的模块

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    useContentSize: true,
    transparent: true,  // 子窗口置底之后 BW 需要透明才能看到
    frame: false,
    title: '主窗口',
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: false,
      preload: require('path').resolve(__dirname, './preload')
    },
  });

  mainWindow.loadURL(require('path').resolve(__dirname, './index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  

  // 打开子窗口
  ipcMain.handle('createChildWindow', () => {
    addon.createChildWindow(mainWindow.getNativeWindowHandle());
  });

  // 创建 BV
  ipcMain.handle('createBV', () => {
    const view = new BrowserView()
    mainWindow.setBrowserView(view)
    view.setBounds({ x: 400, y: 400, width: 300, height: 300 })
    view.webContents.loadURL('https://electronjs.org')
  })
}


app.on('ready', () => {
  createWindow();
})
