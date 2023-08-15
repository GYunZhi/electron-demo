#include <node.h>

// 声明 add 函数
void Add(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();

  // 获取传入的参数
  double a = args[0]->NumberValue(isolate->GetCurrentContext()).FromJust();
  double b = args[1]->NumberValue(isolate->GetCurrentContext()).FromJust();

  // 计算结果
  double result = a + b;

  // 将结果转换为 V8 值并返回
  v8::Local<v8::Number> returnValue = v8::Number::New(isolate, result);
  args.GetReturnValue().Set(returnValue);
}

// 初始化原生模块
void Init(v8::Local<v8::Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(addon, Init)
