import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // Split heavy vendors into cacheable chunks so the app shell stays tiny.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
})
