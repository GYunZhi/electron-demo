#include "lib.h"

// 实现在 demo.h 中声明的 Add 函数
// gcc -g -shared  lib.cpp -o lib.dylib
double Add(double a, double b){
  return a + b;
}