import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import a11y from '../../core/a11y.module.css';
import { useDisclosure, useEscape, useScrollLock } from '../../core/hooks';
import s from './styles.module.css';

/** Two stacked copies in a clipped box; hover rolls the second into place. */
function Roll({ children }: { children: React.ReactNode }) {
  return (
    <span className={s.roll}>
      <span className={s.rollLine}>{children}</span>
      <span className={s.rollLine} aria-hidden="true">{children}</span>
    </span>
  );
}

/**
 * Chunky control rail with an accent pill and centred emblem.
 *
 * Controls are sized off the bar rather than the type — a 60px rounded square
 * in an 83px rail — which gives the bar a physical, product-like weight. The
 * burger is present at EVERY width, including desktop, so the full index is
 * always one tap away. `secondaryAction` renders as the centred circular
 * emblem; `cta` takes the high-visibility accent pill.
 */
export default function ChunkyPillEmblem({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [openIdx, setOpenIdx] = useState(-1);
  const labels = menuLabels(c);

  useScrollLock(open);
  useEscape(open, onClose);

  const nav = useCallback(
    (href: string, item?: NavItem) => {
      onClose();
      setOpenIdx(-1);
      onNavigate?.(href, item);
    },
    [onClose, onNavigate],
  );

  return (
    <>
      <header
        className={[s.root, className].filter(Boolean).join(' ')}
        style={style}
        data-theme={c.theme ?? 'light'}
        data-open={open ? 'true' : 'false'}
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

          {c.secondaryAction?.label && !open && (
            <Link
              className={s.emblem}
              href={c.secondaryAction.href}
              aria-label={c.secondaryAction.label}
              onNavigate={nav}
            >
              <span className={s.emblemText} aria-hidden="true">
                {c.secondaryAction.icon ?? c.secondaryAction.label.slice(0, 2)}
              </span>
            </Link>
          )}

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
          </ul>

          <div className={s.tail}>
            {hasCta(c.cta) && (
              <Link className={s.cta} href={c.cta.href} onNavigate={nav}>
                <span className={s.ctaLabel}>{c.cta.label}</span>
              </Link>
            )}
            <button
              type="button"
              className={`${s.toggle} ${a11y.tapTarget}`}
              aria-expanded={open}
              aria-label={open ? labels.close : labels.open}
              onClick={onToggle}
            >
              <span className={s.toggleBar} />
              <span className={s.toggleBar} />
            </button>
          </div>
        </div>
      </header>

      <div className={s.overlay} data-open={open ? 'true' : 'false'} data-theme={c.theme ?? 'light'} aria-hidden={!open} dir={c.dir ?? 'ltr'}>
        <nav>
          <ul className={s.overlayList}>
            {c.items.map((it, i) => (
              <li key={`o-${i}`} className={s.overlayItem} style={{ ['--i' as string]: i }}>
                <Link className={s.rollLink} href={it.href} item={it} onNavigate={nav} tabIndex={open ? 0 : -1}>
                  <Roll>{it.label}</Roll>
                </Link>
                {!!it.children?.length && (
                  <ul className={s.overlaySub}>
                    {it.children.map((k, j) => (
                      <li key={`os-${j}`}>
                        <Link className={s.overlaySubLink} href={k.href} item={k} onNavigate={nav} tabIndex={open ? 0 : -1}>{k.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {(!!c.socials?.length || hasCta(c.cta)) && (
          <div className={s.overlayFoot}>
            {hasCta(c.cta) && <Link href={c.cta.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.cta.label}</Link>}
            {c.socials?.map((so, i) => (
              <Link key={`of-${i}`} href={so.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{so.label}</Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
