import { app, protocol, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import mineType from 'mime-types';

/**
 * 注册自定义协议
 * 1、设置为特权协议
 * 2、注册协议处理函数
 */
export function setCustomProtocol() {
  // 注册自定义协议作为特权协议
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'myapp', // 自定义协议名称
      privileges: {
        standard: true, // 标准协议
        secure: true, // 安全协议
        supportFetchAPI: true, // 支持 fetch API
      },
    },
    {
      scheme: 'is-standard',
      privileges: {
        standard: true
      },
    },
    {
      scheme: 'not-standard',
      privileges: {
        standard: false
      },
    },
  ]);

  app.whenReady().then(() => {

    // 注册自定义协议处理函数
    protocol.handle('myapp', req => {
      let resourcePath;
      if (req.url === 'myapp://example.com/resource') {
        resourcePath = path.join(process.env.VITE_PUBLIC, 'protocal.js');
      }

      if (resourcePath) {
        // 如果有资源位置，则通过流将资源响应给请求
        const stream = fs.createReadStream(resourcePath);
        return new Response(stream as any, {
          status: 200,
          headers: { 
            'Content-Type': 'text/js' 
          }
        })
      } else {
        // 如果找不到资源位置，可以返回错误
        return new Response('Not Found', {
          status: 404,
          headers: { 
            'Content-Type': 'text/plain' 
          },
        })
      }
    });

    protocol.handle('not-standard', req => {
      let urlObj = new URL(req.url);
      const relativePath = urlObj.pathname == '/' ? urlObj.hostname : urlObj.pathname.slice(1);
      const filePath = path.resolve(process.env.VITE_PUBLIC, relativePath);
      const stream = fs.createReadStream(filePath);

      return new Response(stream as any, {
        status: 200,
        headers: { 
          'Content-Type': 'text/html'
       }
      })
    });

    protocol.handle('is-standard', req => {
      let urlObj = new URL(req.url);
      const relativePath = urlObj.pathname == '/' ? urlObj.hostname : urlObj.pathname.slice(1);
      const filePath = path.resolve(process.env.VITE_PUBLIC, relativePath);
      const type = mineType.lookup(filePath)
      const stream = fs.createReadStream(filePath);

      return new Response(stream as any, {
        status: 200,
        headers: { 'Content-Type': type }
      })
    });
  });
}

/**
 * 将应用程序注册为特定协议的默认处理程序，当用户点击特定协议的链接时，将会打开应用程序来处理该链接
 */
export function setDefaultProtocol() {
  const agreement = 'callup-demo';

  app.removeAsDefaultProtocolClient(agreement); // 每次运行都删除自定义协议 然后再重新注册

  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(agreement, process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient(agreement);
  }
}

/**
 * 解析唤醒链接
 * @param {*} str
 */
export function handleDefaultProtocol(str: string) {
  const AGREEMENT_REGEXP = new RegExp(`^callup-demo://`);

  if (AGREEMENT_REGEXP.test(str)) {
    dialog.showMessageBox({
      type: 'info',
      message: 'window protocol 自定义协议打开',
      detail: `自定义协议链接:${str}`,
    });
  }
}
