import { defineConfig } from 'vitest/config'
import { getViteConfig } from './vite.config'

export default defineConfig({
  ...getViteConfig(),
  root: '.',
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
  },
})
