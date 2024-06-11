import { app, BrowserWindow, ipcMain } from 'electron';
import remote from '@electron/remote/main';
import path from 'node:path';
import { initCrash } from './crash';
import './doh';

// 初始化 remote 模块
remote.initialize();

process.env.APP_ROOT = path.join(__dirname, '../../');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

// 崩溃监控
initCrash();

// 单一实例
const gotTheLock = app.requestSingleInstanceLock();

let mainWindow: BrowserWindow | null;

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
      spellcheck: false, // 禁用拼写检查器
      disableBlinkFeatures: "SourceMap", // 以 "," 分隔的禁用特性列表
      webSecurity: false, // 当设置为 false, 将禁用同源策略
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js'),
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
