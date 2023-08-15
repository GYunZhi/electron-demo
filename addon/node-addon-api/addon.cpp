#include <napi.h>

// 定义 add 函数
Napi::Value Add(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // 获取传入的参数
  double a = info[0].As<Napi::Number>().DoubleValue();
  double b = info[1].As<Napi::Number>().DoubleValue();
  
  // 计算结果并返回
  double result = a + b;
  return Napi::Number::New(env, result);
}

// 初始化原生模块
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "add"), Napi::Function::New(env, Add));
  return exports;
}

// 注册原生模块
NODE_API_MODULE(addon, Init)
