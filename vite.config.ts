import { defineConfig } from 'vite'

export default defineConfig({
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
