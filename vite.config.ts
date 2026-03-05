import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
// For GitHub Pages: set VITE_BASE_URL to /repo-name/ in the deploy workflow
export default defineConfig({
  base: process.env.VITE_BASE_URL ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@app': resolve(rootDir, 'src/app'),
      '@entities': resolve(rootDir, 'src/entities'),
      '@widgets': resolve(rootDir, 'src/widgets'),
      '@pages': resolve(rootDir, 'src/pages'),
      '@shared': resolve(rootDir, 'src/shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
