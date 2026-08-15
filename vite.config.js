import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Both 3D scenes are lazy-loaded, but they share three and drei, so
        // Rollup would otherwise hoist the whole WebGL stack into the entry
        // chunk and undo the split. Pinning them keeps first paint light.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('motion') || id.includes('framer')) return 'motion'
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
