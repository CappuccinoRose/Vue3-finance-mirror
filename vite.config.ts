import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), vueJsx(), process.env.NODE_ENV === 'development' && vueDevTools()].filter(
    Boolean,
  ),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  base: process.env.NODE_ENV === 'production' ? '/' : '/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia', 'element-plus'],
          utils: ['axios', 'dayjs', 'lodash-es'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  server: {
    host: '0.0.0.0',
    port: 9925,
    open: true,
    proxy: {
      '/': {
        target: 'https://www.financemirror.icu',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 9925,
    proxy: {
      '/': {
        target: 'https://www.financemirror.icu',
        changeOrigin: true,
      },
    },
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
})
