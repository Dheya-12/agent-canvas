import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import a11y from '../../core/a11y.module.css';
import { useCloseOnDesktop, useDisclosure, useEscape, useScrollLock, useScrollState } from '../../core/hooks';
import s from './styles.module.css';

function ThemeGlyph({ dark }: { dark: boolean }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const };
  return dark ? (
    <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M14.5 10.6A6 6 0 0 1 7.4 3.5a6 6 0 1 0 7.1 7.1Z" {...p} /></svg>
  ) : (
    <svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="3.6" {...p} /><path d="M9 1.4v1.8M9 14.8v1.8M1.4 9h1.8M14.8 9h1.8M3.6 3.6l1.3 1.3M13.1 13.1l1.3 1.3M14.4 3.6l-1.3 1.3M4.9 13.1l-1.3 1.3" {...p} /></svg>
  );
}

/**
 * Light-weight type rail with an in-bar theme switch.
 *
 * Type is large but set at weight 300 on negative tracking, which reads as
 * quiet rather than loud. The navbar does NOT own the theme: it renders
 * whatever `content.theme` it is given and reports the requested value
 * through `onThemeChange`, so the host stays the single source of truth.
 */
export default function LightweightTypeThemeSwitch({ content, className, style, onNavigate, onThemeChange }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [openIdx, setOpenIdx] = useState(-1);
  const { hidden } = useScrollState(30, 150);
  const labels = menuLabels(c);
  const theme = c.theme ?? 'dark';

  useScrollLock(open);
  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 700px)');

  const nav = useCallback(
    (href: string, item?: NavItem) => {
      onClose();
      setOpenIdx(-1);
      onNavigate?.(href, item);
    },
    [onClose, onNavigate],
  );

  const themeBtn = c.themeToggle && (
    <button
      type="button"
      className={`${s.themeBtn} ${a11y.tapTarget}`}
      aria-label={theme === 'dark' ? c.themeToggle.toLight : c.themeToggle.toDark}
      onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
    >
      <ThemeGlyph dark={theme === 'dark'} />
    </button>
  );

  return (
    <>
      <header
        className={[s.root, className].filter(Boolean).join(' ')}
        style={style}
        data-theme={theme}
        data-hidden={hidden && !open ? 'true' : 'false'}
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
            {c.secondaryAction?.label && (
              <Link className={s.secondary} href={c.secondaryAction.href} onNavigate={nav}>{c.secondaryAction.label}</Link>
            )}
            {hasCta(c.cta) && <Link className={s.cta} href={c.cta.href} onNavigate={nav}>{c.cta.label}</Link>}
          </div>

          <button
            type="button"
            className={`${s.toggle} ${a11y.tapTarget}`}
            aria-expanded={open}
            aria-label={open ? labels.close : labels.open}
            onClick={onToggle}
          >
            {open ? labels.close : labels.open}
          </button>

          {themeBtn}
        </div>
      </header>

      <div className={s.drawer} data-open={open ? 'true' : 'false'} data-theme={theme} aria-hidden={!open} dir={c.dir ?? 'ltr'}>
        <nav>
          <ul className={s.drawerList}>
            {c.items.map((it, i) => (
              <li key={`d-${i}`} style={{ ['--i' as string]: i }}>
                <Link className={s.drawerLink} href={it.href} item={it} onNavigate={nav} tabIndex={open ? 0 : -1}>{it.label}</Link>
                {!!it.children?.length && (
                  <ul className={s.drawerSub}>
                    {it.children.map((k, j) => (
                      <li key={`ds-${j}`}>
                        <Link className={s.drawerSubLink} href={k.href} item={k} onNavigate={nav} tabIndex={open ? 0 : -1}>{k.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {hasCta(c.cta) && (
              <li style={{ ['--i' as string]: c.items.length }}>
                <Link className={s.drawerLink} href={c.cta.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.cta.label}</Link>
              </li>
            )}
          </ul>
        </nav>
        {(!!c.socials?.length || c.secondaryAction?.label) && (
          <div className={s.drawerFoot}>
            {c.secondaryAction?.label && <Link href={c.secondaryAction.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.secondaryAction.label}</Link>}
            {c.socials?.map((so, i) => (
              <Link key={`df-${i}`} href={so.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{so.label}</Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
