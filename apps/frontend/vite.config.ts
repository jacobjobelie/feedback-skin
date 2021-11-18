import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
const ABSOLUTE_BASE = __dirname
const ENV = 'configz/web'
export default ({ mode }) => {
  const isDev = process.env.NODE_ENV === 'development'
  console.log(process.env.NODE_ENV)
  return defineConfig({
    server: {
      host: '0.0.0.0',
      port: 3004,
      hmr: false,
      // https: true,
    },
    root: __dirname,
    define: {
      'process.env': {},
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    optimizeDeps: {
      include: ['@signal-fire/client'],
      exclude: [],
    },
    esbuild: {},
    build: {
      commonjsOptions: {},
      minify: 'terser',
      terserOptions: {
        compress: {
          defaults: false,
          drop_console: true,
        },
        mangle: {
          safari10: false,
          properties: false,
        },
      },
    },
    plugins: [
      vue(),
      // eslint({ }),
      // vanillaExtractPlugin(),
    ],
  })
}
