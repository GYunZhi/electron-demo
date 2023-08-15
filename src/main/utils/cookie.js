/*
 * @Author: gongyunzhi
 * @Date: 2023-07-26 15:46:06
 * @LastEditors: gongyunzhi
 * @LastEditTime: 2023-08-10 15:53:49
 * @Description: electron cookie 管理
 */
const { session, net } = require('electron');

class CookieManager {
  constructor() {
    // 获取默认会话
    this.defaultSession = session.defaultSession;
  }

  // 设置 Cookie
  setCookie(url, cookieString) {
    this.defaultSession.cookies.set({ url, name: 'myCookie', value: cookieString }, (error) => {
      if (error) {
        console.error('Failed to set cookie:', error);
      } else {
        console.log('Cookie set successfully!');
      }
    });
  }

  // 获取 Cookie
  getCookie(url) {
    console.log(url)
    this.defaultSession.cookies.get({ url, name: 'myCookie' }, (error, cookies) => {
      console.log(1111111111)
      if (error) {
        console.error('Failed to get cookie:', error);
      } else {
        if (cookies && cookies.length > 0) {
          console.log('Cookie value:', cookies[0].value);
          return cookies[0].value
        } else {
          console.log('Cookie not found.');
        }
      }
    });
  }

  // 清除 Cookie
  clearCookie(url) {
    this.defaultSession.cookies.remove(url, 'myCookie', (error) => {
      if (error) {
        console.error('Failed to clear cookie:', error);
      } else {
        console.log('Cookie cleared successfully!');
      }
    });
  }

  // 添加 Cookie 到请求头
  sendRequestWithCookie(url) {
    // 使用 net 模块来发送网络请求
    const request = net.request(url);

    this.defaultSession.cookies.get({ url }, (error, cookies) => {
      if (!error && cookies) {
        const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
        request.setHeader('Cookie', cookieString);
      }

      request.on('response', (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          console.log('Response data:', data);
        });
      });

      request.end();
    });
  }
}

export default CookieManager;