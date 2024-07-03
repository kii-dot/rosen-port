import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { UserConfig } from 'vite';
import { resolve } from 'path';
import fs from 'vite-plugin-fs';
import Icons from 'unplugin-icons/vite';

export default {
  plugins: [
    react(),
    vike(),
    fs(),
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
  resolve: {
    alias: {
      '#': resolve('./src'),
    },
  },
} as UserConfig;
