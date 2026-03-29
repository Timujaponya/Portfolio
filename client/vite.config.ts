import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const runtimeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } })
  .process?.env ?? {}

const previewAllowedHosts = [
  'localhost',
  '127.0.0.1',
  runtimeEnv.RAILWAY_PUBLIC_DOMAIN,
  runtimeEnv.CLIENT_PUBLIC_DOMAIN,
  'client-production-arda.up.railway.app',
].filter((host): host is string => Boolean(host))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: previewAllowedHosts,
  },
})
