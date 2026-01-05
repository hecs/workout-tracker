import { defineConfig } from 'vite'

export const getViteConfig = () => ({
  base: '/workout-tracker/',
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: {
    open: true
  }
})

export default defineConfig(getViteConfig())
