import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'react-select', 'react-datepicker'],
          charts: ['recharts'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          utils: ['date-fns', 'papaparse', 'html2canvas', 'jspdf']
        }
      }
    }
  }
});
