/**
 * 测试原生窗口嵌入到 Electron BrowserWindow 内
 * 参考：https://zhuanlan.zhihu.com/p/620300579
 */

const { app, BrowserWindow, ipcMain } = require('electron')
const addon = require('./build/Release/addon') // 编译后的模块

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    useContentSize: true,
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
}


app.on('ready', () => {
  createWindow();
})
