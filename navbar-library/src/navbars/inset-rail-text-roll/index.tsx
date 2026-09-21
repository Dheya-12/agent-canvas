import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, useSafeContent } from '../../core/primitives';
import s from './styles.module.css';

/** Two stacked copies of a label inside a clipped box, so hover rolls one
 *  out and the other in. The duplicate is hidden from assistive tech. */
function Roll({ children }: { children: React.ReactNode }) {
  return (
    <span className={s.roll}>
      <span className={s.rollLine}>{children}</span>
      <span className={s.rollLine} aria-hidden="true">{children}</span>
    </span>
  );
}

/**
 * Inset rail with rolling labels.
 *
 * The header is absolute rather than fixed, so it scrolls away with the page,
 * and it is inset from every edge rather than full-bleed. Its interaction
 * signature is the vertical label roll on hover. The row stays horizontal at
 * every width — there is no burger — so it suits short labels and few items.
 */
export default function InsetRailTextRoll({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const [openIdx, setOpenIdx] = useState(-1);

  const nav = useCallback(
    (href: string, item?: NavItem) => { setOpenIdx(-1); onNavigate?.(href, item); },
    [onNavigate],
  );

  return (
    <header
      className={[s.root, className].filter(Boolean).join(' ')}
      style={style}
      data-theme={c.theme ?? 'light'}
      dir={c.dir ?? 'ltr'}
    >
      <div className={s.inner}>
        <Brand
          brand={c.brand}
          className={s.brand}
          imgClassName={s.brandImg}
          textClassName={s.brandText}
          onNavigate={onNavigate ? (h) => nav(h) : undefined}
        />

        <ul className={s.list}>
          {c.items.map((it, i) => {
            const kids = it.children?.filter(Boolean) ?? [];
            return (
              <li
                key={`${it.label}-${i}`}
                className={s.item}
                data-open={openIdx === i ? 'true' : 'false'}
                onMouseEnter={() => kids.length && setOpenIdx(i)}
                onMouseLeave={() => setOpenIdx(-1)}
              >
                <Link
                  className={s.link}
                  href={it.href}
                  item={it}
                  data-current={it.current ? 'true' : undefined}
                  aria-haspopup={kids.length ? 'true' : undefined}
                  aria-expanded={kids.length ? openIdx === i : undefined}
                  onNavigate={nav}
                >
                  <Roll>
                    {it.label}
                    {it.badge && <span className={s.badge}>{it.badge}</span>}
                  </Roll>
                </Link>
                {kids.length > 0 && (
                  <ul className={s.sub}>
                    {kids.map((k, j) => (
                      <li key={`${k.label}-${j}`}>
                        <Link className={s.subLink} href={k.href} item={k} onNavigate={nav}>{k.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}

          {c.secondaryAction?.label && (
            <li className={s.item}>
              <Link className={s.secondary} href={c.secondaryAction.href} onNavigate={nav}>
                <Roll>{c.secondaryAction.label}</Roll>
              </Link>
            </li>
          )}
          {hasCta(c.cta) && (
            <li className={s.item}>
              <Link className={s.cta} href={c.cta.href} onNavigate={nav}>
                <Roll>{c.cta.label}</Roll>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
