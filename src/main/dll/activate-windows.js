const ffi = require('ffi-napi')
const ref = require('ref-napi')

// 定义 Windows API 的签名
const user32 = new ffi.Library('user32', {
  FindWindowW: ['int', ['string', 'string']],
  ShowWindow: ['bool', ['int', 'int']]
})

// 查找窗口句柄
function findWindow(className, windowTitle) {
  const windowTitlePtr = ref.allocCString(windowTitle)
  const classNamePtr = ref.allocCString(className)
  return user32.FindWindowW(classNamePtr, windowTitlePtr)
}

// 唤醒窗口
function wakeUpWindow(className, windowTitle) {
  const hwnd = findWindow(className, windowTitle)
  if (hwnd !== 0) {
    user32.ShowWindow(hwnd, 9) // 9 表示恢复并激活窗口
  } else {
    console.log('窗口未找到')
  }
}

// 调用示例（打开微信窗口）
// 微信 PC 版的主窗口类名为 WeChatMainWndForPC
wakeUpWindow('WeChatMainWndForPC', null)
