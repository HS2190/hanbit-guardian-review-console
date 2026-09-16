import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/hanbit-guardian-review-console/',
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: { main: path.resolve(__dirname, 'index.html'), shadcn: path.resolve(__dirname, 'shadcn.html') } } },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
