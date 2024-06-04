import { net } from 'electron';

class NetRequest {
  /**
   * 网络状态，true为在线，false为离线
   * @return Boolean
   */
  isOnline() {
    return net.isOnline();
  }

  /**
   * @description net request 请求
   * @param {*} url 请求url
   * @param {*} options 请求参数
   * @return Promise<string>
   */
  request(url: string, options = {}) {
    return new Promise((resolve, reject) => {
      const params = {
        url,
        ...options,
      };
      const request = net.request(params);
      request.on('response', (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('error', (error: Error) => {
          console.log('error', error)
          reject(data);
        });
        res.on('end', () => {
          resolve(data);
        });
      });
      request.end();
    });
  }
}

export default NetRequest;