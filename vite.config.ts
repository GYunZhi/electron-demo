import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import pkg from './package.json'
import { globSync } from 'glob'

const input = Object.fromEntries(
	globSync('./electron/main/**/*.ts').map((file) => {
    return [
      path.relative('', file.split('\\').slice(1).join('\\').split('.')[0]),
      fileURLToPath(new URL(file, import.meta.url)),
    ]
  })
)

const preloadInput = Object.fromEntries(
	globSync('./electron/preload/**/*.ts').map((file) => {
    return [
      path.relative('', file.split('\\').slice(1).join('\\').split('.')[0]),
      fileURLToPath(new URL(file, import.meta.url)),
    ]
  })
)

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/css/common.scss";', // 引入全局变量文件
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
    }),
    Components({
      dirs: ['src/components'],
      resolvers: [ElementPlusResolver({
        importStyle: false
      })],
      types: [{
        from: 'vue-router',
        names: ['RouterLink', 'RouterView'],
      }]
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
              external: [
                ...Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              ],
            },
          },
        },
        onstart({ startup }) {
          startup(['./dist-electron/main/app.js', '--win', '--ia32']) // 主进程代码改动 -> 杀掉重启进程
        }
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
              input: preloadInput,  // 自定义 Rollup 打包，按目录结构输出 preload 脚本代码
              output: {
                dir: path.join(__dirname, 'dist-electron'),
              },
              external: [
                ...Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              ],
            },
          },
        },
        onstart({ reload }) {
          reload() // preload 脚本改动 -> 触发页面重新加载，Vite 底层会调用 location.reload
        }
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === 'test'
        // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
        ? undefined
        : {},
    }),
  ],
})
