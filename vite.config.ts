import reactRefresh from '@vitejs/plugin-react-refresh';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
// import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import nodePolyfills from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      //'@terra-money/terra.js': '@terra-money/terra.js/dist/bundle.js',
      'styled-components':
        'styled-components/dist/styled-components.browser.esm.js',
      // 'process': path.resolve(__dirname, 'src/polyfills/process-es6.js'),
      //'react-csv': 'react-csv/lib/index.js',
      'readable-stream': 'vite-compatible-readable-stream/readable-browser.js',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
    },
  },
  //define: {
  //  'process.env': {},
  //},
  server: {
    // enable for ngrok to work properly
    // hmr: {
    //   clientPort: 3000,
    // },
    https: {
      cert: process.env.LOCALHOST_HTTPS_CERT,
      key: process.env.LOCALHOST_HTTPS_KEY,
      //@ts-ignore
      maxSessionMemory: 100,
      peerMaxConcurrentStreams: 300,
    },
  },
  plugins: [viteCommonjs(), reactRefresh(), tsconfigPaths(), svgr()],
  build: {
    sourcemap: true,
    outDir: 'build',
    //  rollupOptions: {
    //    input: {
    //      main: path.resolve(__dirname, 'index.html'),
    //      subpage: path.resolve(__dirname, 'subpage.html'),
    //    },
    //  },
    rollupOptions: {
      plugins: [
        // ↓ Needed for build
        //@ts-ignore
        nodePolyfills()
      ]
    },
  },
});
