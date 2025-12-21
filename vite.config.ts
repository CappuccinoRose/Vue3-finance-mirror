import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // --- 插件配置 ---
  // 动态加载 vueDevTools，确保它只在开发环境启用，避免与生产构建冲突
  plugins: [vue(), vueJsx(), process.env.NODE_ENV === 'development' && vueDevTools()].filter(
    Boolean,
  ), // 使用 .filter(Boolean) 来过滤掉在非开发环境下为 false 的插件

  // --- 路径别名配置 ---
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // --- 基础路径配置 ---
  base: process.env.NODE_ENV === 'production' ? '/' : '/',

  // --- 构建配置 ---
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 生产环境通常关闭 sourcemap
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true, // 生产环境移除 debugger
      },
    },
    rollupOptions: {
      output: {
        // 将 'element-plus' 合并到 'vue-vendor' 中，确保 Vue 和 Element Plus 在同一个代码块加载，解决初始化顺序问题
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia', 'element-plus'],
          utils: ['axios', 'dayjs', 'lodash-es'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000, // 增加 chunk 大小警告的限制
  },

  // --- 服务器配置 ---
  server: {
    host: '0.0.0.0',
    port: 9925,
    open: true,
    proxy: {
      '/api': {
        target: 'https://www.financemirror.icu', // 修改为线上后端域名
        changeOrigin: true, // 必须开启，解决跨域
        rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写（如 /api/accounts -> /accounts）
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    proxy: {
      '/api': {
        target: 'https://www.financemirror.icu', // 同步修改预览环境的代理
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // --- 全局变量定义 ---
  define: {
    __VUE_PROD_DEVTOOLS__: false, // 生产环境禁用 devtools
  },
})
