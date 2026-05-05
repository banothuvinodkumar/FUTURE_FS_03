import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'fix-windows-routing',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const urlPath = req.url.split('?')[0];
          const uiRoutes = ['/login', '/register', '/cart', '/checkout', '/orders', '/admin'];
          // Force Vite to serve HTML for UI routes instead of mistakenly serving .jsx files
          if (uiRoutes.includes(urlPath)) {
            req.url = '/index.html';
          }
          next();
        });
      }
    }
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
