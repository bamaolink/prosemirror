import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), cssInjectedByJsPlugin(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: './src/index.ts',
      name: 'bamao-link-editor',
      fileName: (format) => {
        return format === 'es' ? 'bamao-link-editor.js' : `bamao-link-editor-${format}.cjs`
      },
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'pinia', 'tailwindcss'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  server: {
    port: 3004,
  },
})
