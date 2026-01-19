import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite pour le frontend React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Port pour le développement (Vite par défaut)
    proxy: {
      // Proxy les requêtes API vers le backend Express
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
