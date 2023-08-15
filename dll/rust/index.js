const ffi = require('ffi-napi')
const path = require('path')

// 加载 DLL
const libPath = path.join(__dirname, './lib.dylib') // Windows: 'libadd.dll'，macOS: 'libadd.dylib'，Linux: 'libadd.so'

const cpplib = ffi.Library(libPath, {
  add: ['double', ['double', 'double']]
})

// 调用 Add 函数并输出结果
const result = cpplib.add(3.5, 4.2)
console.log(result)
