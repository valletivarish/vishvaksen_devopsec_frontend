import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 10002,
    proxy: {
      '/api': {
        target: 'http://localhost:10001',
        changeOrigin: true
      }
    }
  }
})
