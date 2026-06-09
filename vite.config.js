import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: "0.0.0.0",
    port: 5174,
    allowedHosts: [
      'posts-owen-bryant-liquid.trycloudflare.com'
    ],
    // In development, we still use our local Express server
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})