#include <nan.h>

// 定义 add 函数
NAN_METHOD(Add) {
  double a = Nan::To<double>(info[0]).FromJust();
  double b = Nan::To<double>(info[1]).FromJust();
  double result = a + b;
  info.GetReturnValue().Set(result);
}

// 初始化原生模块
NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("add").ToLocalChecked(),
  Nan::GetFunction(Nan::New<v8::FunctionTemplate>(Add)).ToLocalChecked());
}

// 注册原生模块
NODE_MODULE(addon, Init)
