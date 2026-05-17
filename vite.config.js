import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'robots.txt', 'sitemap.xml'],
      manifest: false, // usamos nuestro propio manifest.json en /public
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Pre-cache sitemap y robots para SEO crawlers offline
        additionalManifestEntries: [
          { url: '/sitemap.xml', revision: null },
          { url: '/robots.txt',  revision: null },
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],

  // ── Build optimizations (Core Web Vitals / Lighthouse) ────────────────────
  build: {
    // Code splitting para mejor LCP y TTI
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
    // Compresión y limpieza
    minify:        'terser',
    sourcemap:     false,
    cssMinify:     true,
    // Chunks más pequeños → mejor FCP
    chunkSizeWarningLimit: 600,
  },

  server: {
    port: 5173,
    host: true,
  },
})