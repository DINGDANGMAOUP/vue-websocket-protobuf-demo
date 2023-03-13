import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' //引入node的path模块 这里报错
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{//路径别名
    alias:{
      '@': resolve(__dirname,'./src')
    }
  },
})
