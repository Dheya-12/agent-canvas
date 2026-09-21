import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import { useCloseOnDesktop, useDisclosure, useEscape, useScrollLock } from '../../core/hooks';
import a11y from '../../core/a11y.module.css';
import s from './styles.module.css';

/**
 * Blend-difference tri-zone rail.
 *
 * The bar carries no background: `mix-blend-mode: difference` inverts it
 * against whatever scrolls underneath, so it stays legible over both light
 * and dark sections without a scroll listener. Content is laid out in three
 * zones — mark hard-left, link cluster set off-centre, one action hard-right.
 */
export default function BlendDifferenceTrizone({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [openIdx, setOpenIdx] = useState(-1);
  const labels = menuLabels(c);

  useScrollLock(open);
  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 861px)');

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

          <ul className={s.cluster}>
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

          {(hasCta(c.cta) || c.secondaryAction?.label) && (
            <div className={s.tail}>
              {c.secondaryAction?.label && (
                <Link className={s.secondary} href={c.secondaryAction.href} onNavigate={nav}>{c.secondaryAction.label}</Link>
              )}
              {hasCta(c.cta) && (
                <Link className={s.cta} href={c.cta.href} onNavigate={nav}>{c.cta.label}</Link>
              )}
            </div>
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
      </header>

      <div className={s.panel} data-open={open ? 'true' : 'false'} aria-hidden={!open} dir={c.dir ?? 'ltr'}>
        <nav>
          <ul className={s.panelList}>
            {c.items.map((it, i) => (
              <li key={`p-${it.label}-${i}`} style={{ ['--i' as string]: i }}>
                <Link className={s.panelLink} href={it.href} item={it} onNavigate={nav} tabIndex={open ? 0 : -1}>
                  {it.label}
                </Link>
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
        {(hasCta(c.cta) || !!c.socials?.length || c.secondaryAction?.label) && (
          <div className={s.panelFoot}>
            {hasCta(c.cta) && <Link href={c.cta.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.cta.label}</Link>}
            {c.secondaryAction?.label && <Link href={c.secondaryAction.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.secondaryAction.label}</Link>}
            {c.socials?.map((so, i) => (
              <Link key={`sf-${i}`} href={so.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{so.label}</Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
