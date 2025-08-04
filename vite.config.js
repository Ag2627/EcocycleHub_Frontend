import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],  // tailwind ko yaha se hata diya
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
