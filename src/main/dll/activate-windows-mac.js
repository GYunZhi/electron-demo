const applescript = require('applescript')

const script = `
  tell application "WeChat"
    activate
  end tell
`

applescript.execString(script, (err, result) => {
  if (err) {
    console.error('执行 AppleScript 出错：', err)
    return
  }
  console.log('AppleScript 执行成功！')
})
