/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

// 自定义环境变量：https://cn.vitejs.dev/guide/env-and-mode.html#intellisense
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_BASE_API: string;
  readonly VITE_ROUTER_HISTORY: 'hash' | 'html5';
  readonly VITE_PUBLIC_PATH: string;
}
