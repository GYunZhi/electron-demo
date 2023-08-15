#include <node_api.h>

// 定义 add 函数
napi_value Add(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

  double a, b;
  napi_get_value_double(env, args[0], &a);
  napi_get_value_double(env, args[1], &b);

  napi_value result;
  napi_create_double(env, a + b, &result);
  return result;
}

// 初始化原生模块
napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor desc = { "add", nullptr, Add, nullptr, nullptr, nullptr, napi_default, nullptr };
  napi_define_properties(env, exports, 1, &desc);
  return exports;
}

// 注册原生模块
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
