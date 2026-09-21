import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, useSafeContent } from '../../core/primitives';
import s from './styles.module.css';

/**
 * Fluid-clamp inline rail.
 *
 * The bar holds one height at every viewport while its type ramps fluidly
 * between a floor and a ceiling, so the rail reads large on a desktop and
 * stays legible on a phone without a breakpoint step. Links remain inline at
 * every width — there is no burger — which makes this a good fit for a small
 * number of short labels and a poor one for deep navigation.
 */
export default function FluidClampInline({ content, className, style, onNavigate }: NavbarProps) {
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
                  {it.label}
                  {it.badge && <span className={s.badge}>{it.badge}</span>}
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
              <Link className={s.secondary} href={c.secondaryAction.href} onNavigate={nav}>{c.secondaryAction.label}</Link>
            </li>
          )}
          {hasCta(c.cta) && (
            <li className={s.item}>
              <Link className={s.cta} href={c.cta.href} onNavigate={nav}>{c.cta.label}</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
