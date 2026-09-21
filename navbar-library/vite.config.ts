import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  // Relative base so the built app also works when served from a subpath
  // (the published gallery loads it as a sibling file).
  base: './',
  plugins: [react()],
  server: { port: 4173, strictPort: true, host: '127.0.0.1' },
  build: { outDir: 'dist', sourcemap: false },
});
