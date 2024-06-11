import { type ConfigEnv, type UserConfigExport, loadEnv } from 'vite';
import path, { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import electron from 'vite-plugin-electron/simple';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import svgLoader from 'vite-svg-loader';
import pkg from './package.json';
import { rimraf } from 'rimraf';
import { globSync } from 'glob';

const input = Object.fromEntries(
  globSync('./electron/main/**/*.ts').map(file => {
    return [path.relative('', file.split('\\').slice(1).join('\\').split('.')[0]), fileURLToPath(new URL(file, import.meta.url))];
  }),
);

const preloadInput = Object.fromEntries(
  globSync('./electron/preload/**/*.ts').map(file => {
    return [path.relative('', file.split('\\').slice(1).join('\\').split('.')[0]), fileURLToPath(new URL(file, import.meta.url))];
  }),
);

const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  rimraf(path.join(__dirname, './dist-electron'), { maxRetries: 3 });
  rimraf(path.join(__dirname, './dist'), { maxRetries: 3 });
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(mode, process.cwd());
  const { VITE_PUBLIC_PATH } = viteEnv;

  return {
    /** 打包时根据实际情况修改 base */
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        /** @ 符号指向 src 目录 */
        '@': resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "@/assets/css/common.scss";', // 引入全局变量文件
        },
      },
    },
    server: {
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 端口号 */
      port: 3333,
      /** 是否自动打开浏览器 */
      open: false,
      /** 跨域设置允许 */
      cors: true,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 接口代理 */
      proxy: {
        '/api/v1': {
          target: 'https://mock.mengxuegu.com/mock/63218b5fb4c53348ed2bc212',
          ws: true,
          /** 是否允许跨域 */
          changeOrigin: true,
        },
      },
      /** 预热常用文件，提高初始页面加载速度 */
      warmup: {
        clientFiles: ['./src/layouts/**/*.vue'],
      },
    },
    build: {
      /** 单个 chunk 文件的大小超过 2048KB 时发出警告 */
      chunkSizeWarningLimit: 2048,
      /** 禁用 gzip 压缩大小报告 */
      reportCompressedSize: false,
      /** 打包后静态资源目录 */
      assetsDir: 'static',
      rollupOptions: {
        output: {
          /**
           * 分块策略
           * 1. 注意这些包名必须存在，否则打包会报错
           * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            element: ['element-plus', '@element-plus/icons-vue'],
          },
        },
      },
    },
    /** 混淆器 */
    esbuild:
      mode === 'development'
        ? undefined
        : {
            /** 打包时移除 console.log */
            pure: ['console.log'],
            /** 打包时移除 debugger */
            drop: ['debugger'],
            /** 打包时移除所有注释 */
            legalComments: 'none',
          },
    plugins: [
      vue(),
      vueJsx(),
      /** 将 SVG 静态图转化为 Vue 组件 */
      svgLoader({ defaultImport: 'url' }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),
      electron({
        main: {
          // Shortcut of `build.lib.entry`.
          entry: 'electron/main/app.ts',
          vite: {
            build: {
              minify: 'terser',
              emptyOutDir: false,
              rollupOptions: {
                input, // 自定义 Rollup 打包，按目录结构输出主进程代码
                output: {
                  dir: path.join(__dirname, 'dist-electron'),
                },
                external: [...Object.keys('dependencies' in pkg ? pkg.dependencies : {})],
              },
            },
          },
          onstart({ startup }) {
            startup(['./dist-electron/main/app.js', '--win', '--ia32']); // 主进程代码改动 -> 杀掉重启进程
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: path.join(__dirname, 'electron/preload/index.ts'),
          vite: {
            build: {
              minify: 'terser',
              emptyOutDir: false,
              rollupOptions: {
                input: preloadInput, // 自定义 Rollup 打包，按目录结构输出 preload 脚本代码
                output: {
                  dir: path.join(__dirname, 'dist-electron'),
                },
                external: [...Object.keys('dependencies' in pkg ? pkg.dependencies : {})],
              },
            },
          },
          onstart({ reload }) {
            reload(); // preload 脚本改动 -> 触发页面重新加载，Vite 底层会调用 location.reload
          },
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer:
          process.env.NODE_ENV === 'test'
            ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
              undefined
            : {},
      }),
    ],
  };
};
