import fs from 'node:fs';
const ids = process.argv.slice(2);
const r2 = n => Math.round(n);
for (const id of ids) {
  let r;
  try { r = JSON.parse(fs.readFileSync(`evidence/${id}/inspection.json`, 'utf8')); }
  catch { console.log(`### ${id}: NO EVIDENCE`); continue; }
  console.log(`\n### ${id}  (${r.name}) status=${r.status} ok=${r.ok} ${r.errors?.[0] ? 'ERR:' + r.errors[0] : ''}`);
  if (r.finalUrl && r.finalUrl.replace(/\/$/, '') !== r.url.replace(/\/$/, '')) console.log(`  redirect -> ${r.finalUrl}`);
  for (const [k, v] of Object.entries(r.viewports || {})) {
    const i = v.initial;
    if (!i?.found) { console.log(`  ${k}: NAV NOT FOUND ${v.initialErr || ''}`); continue; }
    const c = i.container;
    console.log(`  ${k} <${i.selectorTag}.${(i.selectorCls || '').trim().split(/\s+/)[0] || ''}> box=${r2(c.rect.w)}x${r2(c.rect.h)}@y${r2(c.rect.y)} pos=${c.position} z=${c.zIndex} bg=${c.bg} blur=${c.backdropFilter} pad=${c.paddingTop}/${c.paddingRight}/${c.paddingBottom}/${c.paddingLeft} shadow=${c.boxShadow !== 'none' ? 'yes' : 'no'} blend=${c.mixBlendMode} trans=${c.transition || '-'}`);
    const sc = v.scrolled?.container, dp = v.deepScroll, su = v.scrollUp;
    if (sc) console.log(`    scrolled: y=${r2(sc.rect.y)} h=${r2(sc.rect.h)} bg=${sc.bg} blur=${sc.backdropFilter} shadow=${sc.boxShadow !== 'none' ? 'yes' : 'no'} | deepY=${dp ? r2(dp.y) : '-'} upY=${su ? r2(su.y) : '-'}`);
    if (i.fonts?.length) console.log(`    fonts: ${i.fonts.join(', ')} | bodyBg=${i.docBg}`);
    if (i.logo) console.log(`    logo: ${i.logo.hasImg ? 'IMG' : 'TEXT'} "${i.logo.text}" @${r2(i.logo.rect.x)},${r2(i.logo.rect.y)} ${r2(i.logo.rect.w)}x${r2(i.logo.rect.h)} ${i.logo.fontSize}/${i.logo.fontWeight}`);
    const items = (i.interactive || []).filter(o => o !== i.logo);
    console.log(`    items(${items.length}): ` + items.map(o => `"${o.text || o.aria || o.cls}"@${r2(o.rect.x)}w${r2(o.rect.w)}h${r2(o.rect.h)} ${o.fontSize}/${o.fontWeight}${o.textTransform !== 'none' ? '/' + o.textTransform : ''}${o.letterSpacing !== 'normal' ? '/ls' + o.letterSpacing : ''}${o.bg !== 'rgba(0, 0, 0, 0)' ? '/bg' + o.bg : ''}${o.radius !== '0px' ? '/r' + o.radius : ''}`).join('  '));
    if (v.menuToggle) console.log(`    toggle: "${v.menuToggle.label}" .${v.menuToggle.cls}`);
    if (v.menuOpen) {
      const m = v.menuOpen;
      if (m.overlayFound) console.log(`    MENU OPEN: ${m.w}x${m.h}@${m.x},${m.y} bg=${m.bg} z=${m.zIndex} tf=${m.transform} blur=${m.backdropFilter} bodyOverflow=${m.bodyOverflow}\n      trans=${(m.transition || '').slice(0, 150)}\n      links: ${(m.links || []).map(l => `"${l.t}"${l.fs}/${l.fw}${l.tt !== 'none' ? '/' + l.tt : ''}`).join(' ')}`);
      else console.log(`    MENU OPEN: no overlay detected (bodyOverflow=${m.bodyOverflow})`);
    }
    if (v.afterClose) console.log(`    afterClose bodyOverflow=${v.afterClose.bodyOverflow}`);
    if (v.hoverTarget) console.log(`    hovered: "${v.hoverTarget}"`);
  }
  if (r.consoleErrors?.length) console.log(`  consoleErrors: ${r.consoleErrors.length}`);
}
