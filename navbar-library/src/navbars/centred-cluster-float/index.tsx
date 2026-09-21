import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import a11y from '../../core/a11y.module.css';
import { useCloseOnDesktop, useDisclosure, useEscape, useScrollLock } from '../../core/hooks';
import s from './styles.module.css';

/**
 * Centred floating cluster.
 *
 * Mark, links and action form a single group held on the viewport axis
 * rather than being pushed to opposite edges, which keeps the bar reading as
 * one object over a full-bleed page. The bar spans the viewport but is
 * `pointer-events: none`, so it never swallows clicks meant for the content
 * behind it — only the controls opt back in.
 */
export default function CentredClusterFloat({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [openIdx, setOpenIdx] = useState(-1);
  const labels = menuLabels(c);

  useScrollLock(open);
  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 640px)');

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
              {open ? labels.close : labels.open}
            </button>
          </div>
        </div>
      </header>

      <div className={s.panel} data-open={open ? 'true' : 'false'} data-theme={c.theme ?? 'light'} aria-hidden={!open} dir={c.dir ?? 'ltr'}>
        <nav>
          <ul className={s.panelList}>
            {c.items.map((it, i) => (
              <li key={`p-${i}`}>
                <Link className={s.panelLink} href={it.href} item={it} onNavigate={nav} tabIndex={open ? 0 : -1}>{it.label}</Link>
                {!!it.children?.length && (
                  <ul className={s.panelSub}>
                    {it.children.map((k, j) => (
                      <li key={`ps-${j}`}>
                        <Link className={s.panelSubLink} href={k.href} item={k} onNavigate={nav} tabIndex={open ? 0 : -1}>{k.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {hasCta(c.cta) && (
          <Link className={s.panelCta} href={c.cta.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.cta.label}</Link>
        )}
        {(!!c.socials?.length || c.secondaryAction?.label) && (
          <div className={s.panelFoot}>
            {c.secondaryAction?.label && <Link href={c.secondaryAction.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.secondaryAction.label}</Link>}
            {c.socials?.map((so, i) => (
              <Link key={`pf-${i}`} href={so.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{so.label}</Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
