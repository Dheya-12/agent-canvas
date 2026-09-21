import fs from 'node:fs';
import path from 'node:path';

/**
 * Folds the built gallery into ONE self-contained .html file.
 *
 * The published version is fine when claude.ai is reachable, but a single
 * file opens from a filesystem with no server, no network and nothing to
 * install - which is the only thing that works behind a block.
 */
const dist = process.env.GALLERY_DIST || 'dist-gallery';
const html = fs.readFileSync(path.join(dist, 'gallery.html'), 'utf8');

const inlineOne = (src, tag) => {
  const file = path.join(dist, src.replace(/^\.?\//, ''));
  if (!fs.existsSync(file)) throw new Error(`missing build output: ${file}`);
  const body = fs.readFileSync(file, 'utf8');
  // A closing tag inside the payload would end the element early.
  const safe = body.replace(/<\/(script|style)/gi, '<\\/$1');
  return tag === 'script' ? `<script type="module">${safe}</script>` : `<style>${safe}</style>`;
};

let out = html
  .replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g, (_m, src) => inlineOne(src, 'script'))
  .replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_m, href) => inlineOne(href, 'style'));

// Inline the sample logo so the image-logo fixture works with no network.
const svg = path.join(dist, 'logo-sample.svg');
if (fs.existsSync(svg)) {
  const uri = 'data:image/svg+xml;base64,' + fs.readFileSync(svg).toString('base64');
  out = out.split('/logo-sample.svg').join(uri);
}

if (/src="\.?\/?assets\//.test(out) || /href="\.?\/?assets\//.test(out)) {
  throw new Error('an asset reference survived inlining - the file would not be self-contained');
}

fs.writeFileSync('navbar-specimen-book.html', out);
const kb = (Buffer.byteLength(out) / 1024).toFixed(0);
console.log(`navbar-specimen-book.html  ${kb} kB  (single file, no external references)`);
