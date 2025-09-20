import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      // Remove COOP header in development to prevent Firebase auth issues
      ...(mode === 'production' && {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
      }),
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    hmr: {
      port: 5173,
      clientPort: 5173,
    },
    // Handle WebSocket connection issues
    watch: {
      usePolling: false,
      interval: 100,
    }
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  },
  // Optimize dependencies to prevent React hooks issues
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    force: true
  },
  // Handle service worker cache issues
  define: {
    // Disable service worker registration in development
    'process.env.SW_DEV': JSON.stringify(mode === 'development')
  }
}))
