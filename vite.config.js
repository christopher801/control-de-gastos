import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // ❌ VitePWA retire — sw.js pa nou an ap jere tout sa
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-charts':   ['chart.js', 'react-chartjs-2'],
          'vendor-pdf':      ['jspdf'],
        },
      },
    },
    minify:               'terser',
    sourcemap:            false,
    cssMinify:            true,
    chunkSizeWarningLimit: 600,
  },

  server: {
    port: 5173,
    host: true,
  },
})