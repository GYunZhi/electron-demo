/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// 添加调试功能，如果安装了 devtron、electron-react-devtools 等扩展, 会默认激活 
// https://www.npmjs.com/package/electron-debug
require('electron-debug')({ showDevTools: false })

// Install `vue-devtools`
// require('electron').app.on('ready', () => {
//   let installExtension = require('electron-devtools-installer')
//   installExtension
//     .default(installExtension.VUEJS_DEVTOOLS)
//     .then(() => {})
//     .catch(err => {
//       console.log('Unable to install `vue-devtools`: \n', err)
//     })
// })

// Require `main` process to boot app
require('./index')
