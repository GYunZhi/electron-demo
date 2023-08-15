const path = require('path')
const ffi = require('ffi-napi')

// 加载 DLL
const libPath = path.join(__dirname, './lib.dylib') // Windows: 'libadd.dll'，macOS: 'libadd.dylib'，Linux: 'libadd.so'

const cpplib = ffi.Library(libPath, {
  Add: ['double', ['double', 'double']]
})

// 调用 Add 函数并输出结果
const result = cpplib.Add(3.5, 4.2)
console.log(result)
