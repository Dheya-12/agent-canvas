import { build } from '../node_modules/esbuild/lib/main.js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Bundles every navbar's meta.ts into a plain JSON manifest so the Node-side
 * tooling (certification, reports) can read the same metadata the app does,
 * without duplicating it or parsing TypeScript by hand.
 */
export async function buildManifest() {
  const dir = path.resolve('src/navbars');
  const ids = fs.readdirSync(dir).filter(d => fs.existsSync(path.join(dir, d, 'meta.ts')));
  const entry = path.resolve('.manifest-entry.ts');
  fs.writeFileSync(entry,
    ids.map((id, i) => `import { meta as m${i} } from './src/navbars/${id}/meta';`).join('\n') +
    `\nexport const metas = [${ids.map((_, i) => `m${i}`).join(',')}];\n`);
  const out = await build({
    entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'neutral', logLevel: 'silent',
  });
  fs.unlinkSync(entry);
  const mod = await import('data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64'));
  const sites = JSON.parse(fs.readFileSync('scripts/sites.json', 'utf8'));
  const byUrl = new Map(sites.map(s => [s.url.replace(/\/$/, ''), s.id]));
  return mod.metas.map(m => ({ ...m, refId: byUrl.get((m.reference?.url || '').replace(/\/$/, '')) ?? null }));
}

if (process.argv[1].endsWith('manifest.mjs')) {
  const m = await buildManifest();
  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/manifest.json', JSON.stringify(m, null, 1));
  console.log(`${m.length} navbars`);
  for (const x of m) console.log(` ${x.id.padEnd(28)} ref=${String(x.refId).padEnd(16)} ${x.layout}/${x.menuArchitecture}/${x.scrollBehavior} motion=${x.motionIntensity}`);
}
