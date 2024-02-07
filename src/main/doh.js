const { app, session } = require('electron');

app.whenReady().then(() => {
  // 设置代理，测试 electron net 模块发出的请求也会走代理
  // session.defaultSession.setProxy({
  //   proxyRules: 'http=localhost:8888;https=localhost:8888',
  //   proxyBypassRules: '<local>'
  // });

  // 配置 DOH（注意：本地开启代理或者 electron 调用了 setProxy 之后 DOH 不生效）
  app.configureHostResolver({
    secureDnsMode: 'secure', // off automatic secure
    secureDnsServers: [
      'https://dns.alidns.com/dns-query',
      'https://doh.360.cn/dns-query'
    ]
  })

  // app.configureHostResolver({
  //   secureDnsMode: 'secure',
  //   secureDnsServers: ['https://127.0.0.1:1234']
  // });
})