import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import a11y from '../../core/a11y.module.css';
import { useCloseOnDesktop, useDisclosure, useEscape, useScrollLock } from '../../core/hooks';
import s from './styles.module.css';

/**
 * Justified link row on a difference-blend rail.
 *
 * The links are not gap-spaced: the row occupies a fixed fraction of the bar
 * and distributes its items with space-between, so the spacing is whatever is
 * left over. Adding an item tightens every gap rather than pushing the row
 * outward, which keeps the trailing edge locked to the gutter.
 */
export default function JustifiedRowBlend({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [openIdx, setOpenIdx] = useState(-1);
  const labels = menuLabels(c);

  useScrollLock(open);
  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 901px)');

  const nav = useCallback(
    (href: string, item?: NavItem) => {
      onClose();
      setOpenIdx(-1);
      onNavigate?.(href, item);
    },
    [onClose, onNavigate],
  );

  // The action joins the justified row so the trailing edge stays locked.
  const row: NavItem[] = hasCta(c.cta)
    ? [...c.items, { label: c.cta.label, href: c.cta.href }]
    : c.items;

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

          <ul className={s.list}>
            {row.map((it, i) => {
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

          <button
            type="button"
            className={`${s.toggle} ${a11y.tapTarget}`}
            aria-expanded={open}
            aria-label={open ? labels.close : labels.open}
            onClick={onToggle}
          >
            <span className={s.toggleBar} />
            <span className={s.toggleBar} />
            <span className={s.toggleBar} />
          </button>
        </div>
      </header>

      <div className={s.overlay} data-open={open ? 'true' : 'false'} data-theme={c.theme ?? 'light'} aria-hidden={!open} dir={c.dir ?? 'ltr'}>
        <nav>
          <ul className={s.overlayList}>
            {row.map((it, i) => (
              <li key={`o-${i}`} style={{ ['--i' as string]: i }}>
                <Link className={s.overlayLink} href={it.href} item={it} onNavigate={nav} tabIndex={open ? 0 : -1}>
                  {it.label}
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
        {(!!c.socials?.length || c.secondaryAction?.label) && (
          <div className={s.overlayFoot}>
            {c.secondaryAction?.label && <Link href={c.secondaryAction.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.secondaryAction.label}</Link>}
            {c.socials?.map((so, i) => (
              <Link key={`of-${i}`} href={so.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{so.label}</Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
