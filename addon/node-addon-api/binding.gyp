{
  "targets": [
    {
      # 编译出来的 xxx.node 文件名称，这里是 addon.node
      "target_name": "addon",
      # 被编译的 cpp 源文件
      "sources": ["addon.cpp"],
      # 为了简便，忽略掉编译过程中的一些报错
      "cflags!": [ "-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      # 增加一个头文件搜索路径
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      # 添加一个预编译宏，避免编译的时候并行抛错
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}