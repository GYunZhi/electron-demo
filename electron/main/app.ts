import { app, BrowserWindow, ipcMain } from 'electron';
import remote from '@electron/remote/main';
import path from 'node:path';
import * as apis from 'electron';
import CookieManager from './utils/cookie';
import NetRequest from './utils/net';
import { setCustomProtocol,  setDefaultProtocol, handleDefaultProtocol } from './protocal';
import { initCrash } from './crash';
import './doh';

remote.initialize();

process.env.APP_ROOT = path.join(__dirname, '../../');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

// 单一实例
const gotTheLock = app.requestSingleInstanceLock();

let mainWindow: BrowserWindow | null;

// 崩溃监控
initCrash();

// 注册自定义协议
setCustomProtocol();

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1200,
    height: 720,
    useContentSize: true,
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 启用 remote 模块
  remote.enable(mainWindow.webContents);
}

/**
 * 单一实例
 */
if (!gotTheLock) {
  app.quit();
} else {
  app.on('ready', () => {
    createWindow();

    /************************** 实例化工具类 ****************************/
    const cookieManager = new CookieManager();
    const netRequest = new NetRequest();

    /************************** 接收渲染进程的消息 ****************************/
    // 同步消息
    ipcMain.on('sync-render', (event, data) => {
      event.returnValue = '我收到了同步消息，这是我的回复：啦啦啦';
    });

    // 异步消息（send）
    ipcMain.on('async-render', (event, data) => {
      event.reply('async-reply', '我收到了异步消息，这是我的回复：啦啦啦');
    });

    // 异步消息（invoke）
    // 注意：相同的事件名称，on 方法可以注册多次，但是 handle 方法只能注册一次，否则会报错
    ipcMain.handle('invoke-render', (event, args) => {
      return '我收到了异步消息(invoke)，这是我的回复：啦啦啦';
    });

    /************************** 向渲染进程发送消息 ****************************/
    ipcMain.handle('send-a-message', (event, args) => {
      mainWindow?.webContents.send('main-msg', `这是一条来自主进程的消息 + ${new Date().getTime()}`);
    });

    /************************** 设置全局变量 ****************************/
    global.sharedData = {
      mainApi: Object.keys(apis),

      name: 'Gavin',
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron,

      cookieManager,
      netRequest,
    };
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mainWindow = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * 网页应用调起桌面程序
 */
setDefaultProtocol();

// mac 下唤醒应用会激活 open-url 事件
app.on('open-url', function (event, url) {
  event.preventDefault();
  console.log('open by web:', url);
});

// window 下唤醒应用会激活 second-instance 事件
app.on('second-instance', (event, commandLine) => {
  event.preventDefault();
  handleDefaultProtocol(commandLine.pop() as string); // commandLine 是一个数组，其中最后一个数组元素为唤醒链接
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
