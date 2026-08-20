/// <reference types="vitest/config" />
import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { seoStaticAssetsPlugin } from './vite-plugins/seo-static-assets';

const VITE_DEV_SERVER_PORT = 5173;

export default defineConfig({
  plugins: [react(), tailwindcss(), seoStaticAssetsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: 'localhost',
    port: VITE_DEV_SERVER_PORT,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});
