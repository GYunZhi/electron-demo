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
	globSync('./electron/**/*.ts', { ignore: ['electron/electron-env.d.ts'] }).map((file) => {
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
        entry: 'electron/main.ts',
        vite: {
          build: {
            minify: 'terser',
            emptyOutDir: true,
            rollupOptions: {
              input,
              output: {
                dir: path.join(__dirname, 'dist-electron'),
                format: 'esm',
              },
              external: [
                ...Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              ],
            },
          },
        },
        onstart({ startup, reload }) {
          startup(['./dist-electron/main.js', '--win', '--ia32'])
        }
      },
      // preload: {
      //   // Shortcut of `build.rollupOptions.input`.
      //   // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
      //   input: path.join(__dirname, 'electron/preload.ts'),
      // },
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
