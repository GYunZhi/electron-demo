#include <napi.h>
#include <windows.h>
#include <windowsx.h>

LRESULT CALLBACK wndProc(HWND hwnd, UINT msg, WPARAM wparam, LPARAM lparam) {
  switch (msg) {
    case WM_NCCALCSIZE: {
      return 0;
    }
    case WM_LBUTTONDOWN:{
        MessageBox(hwnd,
      "allen",
      "allen",
      MB_ICONWARNING | MB_OK);
      return 0;
    }
  }
  return DefWindowProcW(hwnd, msg, wparam, lparam);
}

void CreateChildWindow(const Napi::CallbackInfo &info) {
  // 获取父窗口句柄
  Napi::Env env = info.Env();
  Napi::Buffer<void *> wndHandle = info[0].As<Napi::Buffer<void *>>();
  HWND hwndParent = static_cast<HWND>(*reinterpret_cast<void **>(wndHandle.Data()));

  // 父窗口的子窗口中查找类名为 "Intermediate D3D Window" 的窗口
  // 注意：这里指的是 Electron 内部创建的 D3D 渲染窗口（类名固定为 "Intermediate D3D Window"），该窗口由 Chromium 渲染引擎管理，用于底层图形输出（如 WebGL/Direct3D）
  HWND hwndD3D = FindWindowEx(hwndParent, nullptr, "Intermediate D3D Window", nullptr);

  // 关键代码：设置窗口裁剪样式​
  LONG_PTR style = GetWindowLongPtr(hwndD3D, GWL_STYLE);
  if ((style & WS_CLIPSIBLINGS) == 0) {
    style |= WS_CLIPSIBLINGS;
    SetWindowLongPtr(hwndD3D, GWL_STYLE, style);
  }
  style = GetWindowLongPtr(hwndParent, GWL_STYLE);
  if ((style & WS_CLIPCHILDREN) == 0) {
    style |= WS_CLIPCHILDREN;
    SetWindowLongPtr(hwndParent, GWL_STYLE, style);
  }

  // 注册子窗口类​
  WNDCLASSEXW wcx{};
  wcx.cbSize = sizeof(wcx);
  wcx.style = CS_HREDRAW | CS_VREDRAW;
  wcx.hInstance = nullptr;
  wcx.lpfnWndProc = &wndProc;
  wcx.lpszClassName = L"ChildWindowClass";
  wcx.hbrBackground = CreateSolidBrush(RGB(226, 160, 160));
  wcx.hCursor = LoadCursor(nullptr, IDC_ARROW);
  ATOM childClassId = RegisterClassExW(&wcx);
  if (!childClassId) {
    auto errCode = GetLastError();
  }

  // 创建子窗口并附加到父窗口
  auto childStyle = WS_CHILD| WS_POPUP | WS_VISIBLE;
  HWND hwnd = CreateWindowExW(0, wcx.lpszClassName, NULL, childStyle, 100, 100, 600, 600, nullptr, nullptr, nullptr, nullptr);
  SetParent(hwnd, hwndParent);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "createChildWindow"), Napi::Function::New(env, CreateChildWindow));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)