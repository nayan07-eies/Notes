import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // 'serve' is what Vite uses when running locally (npm run dev)
    // 'build' is used for production deployment (npm run build)
    base: command === 'serve' ? '/' : '/MediFlow/mediflow-dashboard/',
  }
})