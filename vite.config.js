import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

// https://vite.dev/config/
const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)

const isoStamp = new Date().toISOString()
const defaultBuildStamp = `${isoStamp.slice(2, 4)}${isoStamp.slice(5, 7)}${isoStamp.slice(8, 10)}-${isoStamp.slice(11, 13)}${isoStamp.slice(14, 16)}`

const appVersion =
  process.env.VITE_APP_VERSION ||
  process.env.npm_package_version ||
  packageJson.version ||
  '0.0.0'

const appBuild =
  process.env.VITE_APP_BUILD ||
  process.env.BUILD_TIMESTAMP ||
  defaultBuildStamp

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
    'import.meta.env.VITE_APP_BUILD': JSON.stringify(appBuild),
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
})
