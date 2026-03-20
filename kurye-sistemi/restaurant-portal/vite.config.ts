import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
  },
  define: {
    // API URL based on environment
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'https://api.paketciniz.com' 
        : 'http://localhost:4000'
    ),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
