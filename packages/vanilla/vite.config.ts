import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
// import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin()
    // dts({
    //   tsconfigPath: './tsconfig.json',
    //   rollupTypes: true
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: './src/index.ts',
      name: 'bamao-link-prosemirror',
      fileName: (format) => {
        return format === 'es'
          ? 'bamao-link-prosemirror.js'
          : `bamao-link-prosemirror-${format}.cjs`
      },
      formats: ['es', 'umd']
    }
  },
  server: {
    port: 3002
  }
})
