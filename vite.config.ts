import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'year-by-year': ['./src/components/yearByYear/YearByYearCalculator.tsx']
        }
      }
    }
  }
})
