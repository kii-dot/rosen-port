import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { UserConfig } from 'vite';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';
// import fs from 'vite-plugin-fs';
import Icons from 'unplugin-icons/vite';

export default {
  define: {
    'process.env': {},
  },
  plugins: [
    react({
      babel: {
        // presets: ['@babel/preset-env'],
        // plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    }),
    wasm(),
    vike(),
    // fs(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
  ssr: {
    // Add problematic npm package here:
    noExternal: ['@emurgo/cardano-serialization-lib-asmjs'],
  },
  resolve: {
    alias: {
      '#': resolve('./src'),
    },
  },
} as UserConfig;
