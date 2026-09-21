import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// The gallery ships offline, so the certified numbers are baked in at build
// time rather than fetched. Read from the same reports the suite writes.
const readJson = (f: string, fallback: unknown) => {
  try { return JSON.parse(readFileSync(resolve(__dirname, f), 'utf8')); }
  catch { return fallback; }
};
const baseline = readJson('reports/baseline.json', { navbars: {} }) as { navbars: unknown };
const cert = readJson('reports/certification.json', { results: [] }) as { results: { id: string; status: string }[] };
const statuses = Object.fromEntries(cert.results.map(r => [r.id, r.status]));

export default defineConfig({
  define: {
    __BASELINE__: JSON.stringify(baseline.navbars),
    __STATUS__: JSON.stringify(statuses),
  },
  // Relative base so the built app also works when served from a subpath
  // (the published gallery loads it as a sibling file).
  base: './',
  plugins: [react()],
  server: { port: 4173, strictPort: true, host: '127.0.0.1' },
  build: process.env.GALLERY_ONLY
    ? {
        // Single-chunk build for the offline gallery: code splitting would
        // leave the inlined script importing a sibling file, which defeats
        // the point of a self-contained page.
        outDir: 'dist-gallery',
        sourcemap: false,
        cssCodeSplit: false,
        rollupOptions: {
          input: resolve(__dirname, 'gallery.html'),
          output: { inlineDynamicImports: true, entryFileNames: 'app.js', assetFileNames: 'app.[ext]' },
        },
      }
    : {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'index.html'),
            gallery: resolve(__dirname, 'gallery.html'),
          },
        },
      },
});
