const { app, BrowserWindow, crashReporter, ipcMain, systemPreferences } = require('electron');
const path = require('path');

// 获取崩溃堆栈文件存放路径
let crashFilePath = '';
let crashDumpsDir = '';

export const initCrash = () => {
  try {
    // electron 低版本
    crashFilePath = path.join(app.getPath('temp'), app.getName() + ' Crashes');
    console.log('————————crash path:', crashFilePath);
    // electron 高版本
    crashDumpsDir = app.getPath('crashDumps');
    console.log('————————crashDumpsDir:', crashDumpsDir);
  } catch (e) {
    console.error('获取崩溃文件路径失败', e);
  }

  try {
    // 开启crash捕获
    crashReporter.start({
      productName: 'Your-Application-Name',
      companyName: 'Your-Company-Name',
      submitURL: 'https://www.xxx.com', // 上传到服务器的地址
      uploadToServer: false, // 不上传服务器
      compress: false,
      ignoreSystemCrashHandler: false, // 不忽略系统自带的崩溃处理，为 true 时表示忽略，崩溃时不会生成崩溃堆栈文件
    });
  } catch (e) {
    console.error(`初始化crash上报出错${e}`);
  }
};
