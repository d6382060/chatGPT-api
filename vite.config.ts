import path from 'path'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
 alias:{
  '@': path.resolve(__dirname, 'src'),
 }
  },
  plugins: [
    vue(),
    Unocss(),
    AutoImport({
     imports: [
      'vue',
      'vue-router',
      '@vueuse/core',
     ],
     dirs: [
      'src/api',
      ],
      dts: 'src/auto-imports.d.ts'
    })
  ],
})
