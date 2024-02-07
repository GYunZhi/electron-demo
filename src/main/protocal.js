const { app, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

// 注册自定义协议作为特权协议
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'myapp', // 自定义协议名称
    privileges: {
      standard: true, // 标准协议
      secure: true, // 安全协议
      supportFetchAPI: true,
    },
  },
]);

app.whenReady().then(() => {
  // 注册自定义协议处理程序
  protocol.registerStreamProtocol('myapp', (request, callback) => {
    let resourcePath;

    if (request.url === 'myapp://example.com/resource1') {
      resourcePath = path.join(__dirname, '../../test.js');
    }

    if (resourcePath) {
      // 如果有资源位置，则通过流将资源响应给请求
      const stream = fs.createReadStream(resourcePath);
      callback({ statusCode: 200, headers: { 'Content-Type': 'text/js' }, data: stream });
    } else {
      // 如果找不到资源位置，可以返回错误
      callback({ statusCode: 404, headers: { 'Content-Type': 'text/plain' }, data: 'Not Found' });
    }
  });
});
