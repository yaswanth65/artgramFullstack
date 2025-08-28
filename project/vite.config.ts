import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
  // Backend runs on 5000 by default (server/src/index.ts sets PORT=5000)
  target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
