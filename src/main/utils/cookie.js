/*
 * @Author: gongyunzhi
 * @Date: 2023-07-26 15:46:06
 * @LastEditors: gongyunzhi
 * @LastEditTime: 2023-11-24 10:56:36
 * @Description: electron cookie 管理
 */
const { session, net } = require('electron');

class CookieManager {

  constructor() {}

  /**
   * 设置 Cookie
   * @param {*} url
   * @param {*} name 
   * @param {*} value
   * @returns 
   */
  setCookie(url, name, value) {
    session.defaultSession.cookies.set({ url, name, value }, (error) => {
      if (error) {
        console.error('Failed to set cookie:', error);
      } else {
        console.log('Cookie set successfully!');
      }
    });
  }

  /**
   * 获取 Cookie
   * @param {*} url 
   * @param {*} name 
   * @returns 
   */
  getCookie(url, name) {
    return session.defaultSession.cookies.get({  url, name })
      .then((cookies) => {
        if (cookies && cookies.length > 0) {
          return cookies[0].value
        } else {
          console.log('Cookie not found.');
        }
      }).catch((error) => {
        console.error('Failed to get cookie:', error);
      })
  }

  /**
   * 清除 Cookie
   * @param {*} url 
   * @param {*} name
   * @returns 
   */
  clearCookie(url, name) {
    this.defaultSession.cookies.remove(url, name, (error) => {
      if (error) {
        console.error('Failed to clear cookie:', error);
      } else {
        console.log('Cookie cleared successfully!');
      }
    });
  }
}

export default CookieManager;