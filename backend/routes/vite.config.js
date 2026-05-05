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
          // Catch all page refresh requests and safely force them to the SPA entry point
          if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
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