import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Rutas relativas para compatibilidad total con GitHub Pages (/n8n-QA/) y despliegues estáticos
})
