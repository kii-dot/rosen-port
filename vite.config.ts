import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { UserConfig } from 'vite';
import { resolve } from 'path';
import Icons from 'unplugin-icons/vite';

export default {
  plugins: [
    react(),
    vike(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  resolve: {
    alias: {
      '#': resolve('./src'),
    },
  },
} as UserConfig;
