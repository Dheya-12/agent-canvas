import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import a11y from '../../core/a11y.module.css';
import { useCloseOnDesktop, useDisclosure, useEscape, useScrollLock, useScrollState } from '../../core/hooks';
import { UtilityIcon } from './icons';
import s from './styles.module.css';

/**
 * Centred-wordmark commerce rail.
 *
 * The wordmark is centred on the viewport axis rather than on the leftover
 * space, so it holds position however wide the flanking clusters grow.
 * Category items with children open a full-width mega panel; `utilities`
 * render as a trailing icon cluster, `secondaryAction` as a locale selector.
 */
export default function CenteredWordmarkCommerce({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [megaIdx, setMegaIdx] = useState(-1);
  const { past } = useScrollState(20, 1e9);
  const labels = menuLabels(c);

  useScrollLock(open);
  useEscape(open || megaIdx >= 0, () => { onClose(); setMegaIdx(-1); });
  useCloseOnDesktop(open, onClose, '(min-width: 1024px)');

  const nav = useCallback(
    (href: string, item?: NavItem) => {
      onClose();
      setMegaIdx(-1);
      onNavigate?.(href, item);
    },
    [onClose, onNavigate],
  );

  const mega = megaIdx >= 0 ? c.items[megaIdx]?.children ?? [] : [];

  return (
    <>
      <header
        className={[s.root, className].filter(Boolean).join(' ')}
        style={style}
        data-theme={c.theme ?? 'light'}
        data-past={past ? 'true' : 'false'}
        dir={c.dir ?? 'ltr'}
        onMouseLeave={() => setMegaIdx(-1)}
      >
        <div className={s.inner}>
          <div className={s.lead}>
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

            <ul className={s.list}>
              {c.items.map((it, i) => {
                const kids = it.children?.filter(Boolean) ?? [];
                return (
                  <li
                    key={`${it.label}-${i}`}
                    className={s.item}
                    data-open={megaIdx === i ? 'true' : 'false'}
                    onMouseEnter={() => setMegaIdx(kids.length ? i : -1)}
                  >
                    <Link
                      className={s.link}
                      href={it.href}
                      item={it}
                      data-current={it.current ? 'true' : undefined}
                      aria-haspopup={kids.length ? 'true' : undefined}
                      aria-expanded={kids.length ? megaIdx === i : undefined}
                      onNavigate={nav}
                    >
                      <span className={s.label}>{it.label}</span>
                      {it.badge && <span className={s.badge}>{it.badge}</span>}
                      {kids.length > 0 && <span className={s.caret} aria-hidden="true" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <Brand
            brand={c.brand}
            className={s.brand}
            imgClassName={s.brandImg}
            textClassName={s.brandText}
            onNavigate={onNavigate ? (h) => nav(h) : undefined}
          />

          <div className={s.tail}>
            {hasCta(c.cta) && <Link className={s.cta} href={c.cta.href} onNavigate={nav}>{c.cta.label}</Link>}
            {c.secondaryAction?.label && (
              <Link className={s.secondary} href={c.secondaryAction.href} onNavigate={nav}>{c.secondaryAction.label}</Link>
            )}
            {!!c.utilities?.length && (
              <div className={s.utils}>
                {c.utilities.map((u, i) => (
                  <Link key={`u-${i}`} className={`${s.util} ${a11y.tapTarget}`} href={u.href} aria-label={u.label} onNavigate={nav}>
                    <UtilityIcon name={u.icon} />
                    {typeof u.count === 'number' && (
                      <span className={s.count}><span className={s.countText}>{u.count}</span></span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={s.mega} data-open={megaIdx >= 0 ? 'true' : 'false'} aria-hidden={megaIdx < 0} onMouseLeave={() => setMegaIdx(-1)}>
        <ul className={s.megaList}>
          {mega.map((k, j) => (
            <li key={`m-${j}`}>
              <Link className={s.megaLink} href={k.href} item={k} onNavigate={nav} tabIndex={megaIdx >= 0 ? 0 : -1}>{k.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.panel} data-open={open ? 'true' : 'false'} aria-hidden={!open} dir={c.dir ?? 'ltr'}>
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
        <div className={s.panelFoot}>
          {hasCta(c.cta) && <Link href={c.cta.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.cta.label}</Link>}
          {c.secondaryAction?.label && <Link href={c.secondaryAction.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.secondaryAction.label}</Link>}
          {c.socials?.map((so, i) => (
            <Link key={`sf-${i}`} href={so.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{so.label}</Link>
          ))}
        </div>
      </div>
    </>
  );
}
