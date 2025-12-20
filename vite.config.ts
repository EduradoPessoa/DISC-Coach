import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Permite rodar em subpastas (XAMPP)
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/disc/api': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        // Altere o target abaixo se sua pasta no XAMPP for diferente
        // Ex: http://localhost/disc/api se você copiou para C:\xampp\htdocs\disc
        // Ou http://localhost:8000 se usar o php -S
        target: process.env.VITE_API_TARGET || 'http://localhost/disc', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
