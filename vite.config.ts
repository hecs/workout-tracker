import { defineConfig } from 'vite'

export default defineConfig({
  base: '/workout-tracker/',
  root: 'src',
  build: {
    outDir: '../dist'
  },
  server: {
    open: true
  }
})
