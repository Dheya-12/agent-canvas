import { useCallback } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import a11y from '../../core/a11y.module.css';
import { useCloseOnDesktop, useDisclosure, useEscape } from '../../core/hooks';
import s from './styles.module.css';

/**
 * Stacked-column micro nav.
 *
 * Navigation is arranged as narrow vertical columns rather than a row, so the
 * bar stays only a few lines tall at very small type. `items` form the first
 * column; `socials` plus the actions form a second. The bar is absolute, so
 * it scrolls away with the page instead of following it.
 */
export default function StackedColumnMicro({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const labels = menuLabels(c);

  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 700px)');

  const nav = useCallback(
    (href: string, item?: NavItem) => { onClose(); onNavigate?.(href, item); },
    [onClose, onNavigate],
  );

  const hasAux = !!c.socials?.length || hasCta(c.cta) || !!c.secondaryAction?.label;

  return (
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

        <button
          type="button"
          className={`${s.toggle} ${a11y.tapTarget}`}
          aria-expanded={open}
          aria-label={open ? labels.close : labels.open}
          onClick={onToggle}
        >
          {open ? labels.close : labels.open}
        </button>

        <div className={s.stack}>
          <div className={s.stackInner}>
            {c.items.length > 0 && (
              <ul className={`${s.col} ${s.colNav}`}>
                {c.items.map((it, i) => (
                  <li key={`${it.label}-${i}`} className={s.item}>
                    <Link
                      className={s.link}
                      href={it.href}
                      item={it}
                      data-current={it.current ? 'true' : undefined}
                      onNavigate={nav}
                    >
                      {it.label}
                      {it.badge && <span className={s.badge}>{it.badge}</span>}
                    </Link>
                    {!!it.children?.length && (
                      <ul className={s.sub}>
                        {it.children.map((k, j) => (
                          <li key={`${k.label}-${j}`}>
                            <Link className={s.subLink} href={k.href} item={k} onNavigate={nav}>{k.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {hasAux && (
              <ul className={`${s.col} ${s.colAux}`}>
                {c.socials?.map((so, i) => (
                  <li key={`so-${i}`} className={s.item}>
                    <Link className={s.link} href={so.href} onNavigate={nav}>{so.label}</Link>
                  </li>
                ))}
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
