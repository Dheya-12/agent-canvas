import { useCallback, useEffect, useRef, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import { useCloseOnDesktop, useDisclosure, useEscape, useMedia, useScrollLock, useScrollState } from '../../core/hooks';
import s from './styles.module.css';

/**
 * Fluid rail with pill CTA.
 *
 * Desktop: a transparent full-bleed rail whose every dimension is a fraction
 * of viewport width, hiding on scroll-down and restoring on scroll-up.
 * Mobile: a detached translucent card that expands in place.
 */
export default function FluidRailPill({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const isMobile = useMedia('(max-width: 767px)');
  const { hidden } = useScrollState(60, 140);
  const [openIdx, setOpenIdx] = useState(-1);
  const panelRef = useRef<HTMLDivElement>(null);
  const [openH, setOpenH] = useState<number>();

  useScrollLock(open && isMobile);
  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 768px)');
  const labels = menuLabels(c);

  // Measure the card's natural open height so the expansion animates to a
  // real number rather than a guessed one (content length varies per site).
  useEffect(() => {
    if (!open || !isMobile) return;
    const el = panelRef.current;
    if (!el) return;
    const measure = () => setOpenH(Math.min(el.scrollHeight + 50, window.innerHeight - 20));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, isMobile, c.items, c.cta]);

  const nav = useCallback(
    (href: string, item?: NavItem) => {
      onClose();
      setOpenIdx(-1);
      onNavigate?.(href, item);
    },
    [onClose, onNavigate],
  );

  const dir = c.dir ?? 'ltr';

  return (
    <header
      className={[s.root, className].filter(Boolean).join(' ')}
      style={{ ...style, ...(open && openH ? ({ ['--nb-open-h' as string]: `${openH}px` }) : null) }}
      data-theme={c.theme ?? 'light'}
      data-hidden={hidden && !open ? 'true' : 'false'}
      data-open={open ? 'true' : 'false'}
      dir={dir}
    >
      <div className={s.inner}>
        <div className={s.bar}>
          <Brand
            brand={c.brand}
            className={s.brand}
            imgClassName={s.brandImg}
            textClassName={s.brandText}
            onNavigate={onNavigate ? (h) => nav(h) : undefined}
          />
          <button
            type="button"
            className={s.toggle}
            aria-expanded={open}
            aria-label={open ? labels.close : labels.open}
            onClick={onToggle}
          >
            <span className={s.toggleBar} />
            <span className={s.toggleBar} />
          </button>
        </div>

        <div className={s.right} ref={panelRef} aria-hidden={isMobile && !open ? true : undefined}>
          {c.items.length > 0 && <span className={s.menuLabel}>{labels.open}</span>}

          <ul className={s.list}>
            {c.items.map((it, i) => {
              const kids = it.children?.filter(Boolean) ?? [];
              return (
                <li
                  key={`${it.label}-${i}`}
                  className={s.item}
                  style={{ ['--i' as string]: i }}
                  data-open={openIdx === i ? 'true' : 'false'}
                  onMouseEnter={() => kids.length && !isMobile && setOpenIdx(i)}
                  onMouseLeave={() => !isMobile && setOpenIdx(-1)}
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
                          <Link className={s.subLink} href={k.href} item={k} onNavigate={nav}>
                            {k.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {c.secondaryAction?.label && (
            <Link className={s.secondary} href={c.secondaryAction.href} onNavigate={nav}>
              {c.secondaryAction.label}
            </Link>
          )}

          {hasCta(c.cta) && (
            <Link className={s.cta} href={c.cta.href} onNavigate={nav}>
              {c.cta.label}
              {c.cta.icon && <span aria-hidden="true">{c.cta.icon}</span>}
            </Link>
          )}

          {!!c.socials?.length && (
            <div className={s.socials}>
              {c.socials.map((so, i) => (
                <Link key={`${so.label}-${i}`} href={so.href} onNavigate={nav}>
                  {so.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
