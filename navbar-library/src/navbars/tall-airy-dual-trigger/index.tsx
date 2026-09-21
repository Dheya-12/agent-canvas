import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import { useDisclosure, useEscape, useScrollLock, useScrollState } from '../../core/hooks';
import a11y from '../../core/a11y.module.css';
import s from './styles.module.css';

/**
 * Tall airy rail with a dual trigger.
 *
 * Unusually for an inline navigation bar, the "Menu" control is present at
 * every width — at desktop it sits alongside the inline links rather than
 * replacing them, giving a second route into a fuller index. The rail hides
 * on scroll-down and returns on scroll-up, but never while the menu is open.
 */
export default function TallAiryDualTrigger({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [openIdx, setOpenIdx] = useState(-1);
  const labels = menuLabels(c);

  const { hidden } = useScrollState(40, 160);
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

  const brand = (
    <Brand
      brand={c.brand}
      className={s.brand}
      imgClassName={s.brandImg}
      textClassName={s.brandText}
      onNavigate={onNavigate ? (h) => nav(h) : undefined}
    />
  );

  return (
    <>
      <header
        className={[s.root, className].filter(Boolean).join(' ')}
        style={style}
        data-theme={c.theme ?? 'light'}
        data-open={open ? 'true' : 'false'}
        data-hidden={hidden && !open ? 'true' : 'false'}
        dir={c.dir ?? 'ltr'}
      >
        <div className={s.inner}>
          {brand}

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
              <Link className={s.cta} href={c.cta.href} onNavigate={nav}>{c.cta.label}</Link>
            )}
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
        </div>
      </header>

      <div
        className={s.overlay}
        data-open={open ? 'true' : 'false'}
        data-theme={c.theme ?? 'light'}
        aria-hidden={!open}
        dir={c.dir ?? 'ltr'}
      >
        <nav>
          <ul className={s.overlayList}>
            {c.items.map((it, i) => (
              <li key={`o-${it.label}-${i}`} style={{ ['--i' as string]: i }}>
                <Link className={s.overlayLink} href={it.href} item={it} onNavigate={nav} tabIndex={open ? 0 : -1}>
                  {it.label}
                </Link>
                {!!it.children?.length && (
                  <ul className={s.overlaySub}>
                    {it.children.map((k, j) => (
                      <li key={`os-${k.label}-${j}`}>
                        <Link className={s.overlaySubLink} href={k.href} item={k} onNavigate={nav} tabIndex={open ? 0 : -1}>{k.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {hasCta(c.cta) && (
            <Link className={s.overlayCta} href={c.cta.href} onNavigate={nav} tabIndex={open ? 0 : -1}>
              <span>{c.cta.label}</span>
              {c.cta.icon && <span aria-hidden="true">{c.cta.icon}</span>}
            </Link>
          )}
        </nav>

        {(!!c.socials?.length || c.secondaryAction?.label) && (
          <div className={s.overlayFoot}>
            {c.socials?.map((so, i) => (
              <Link key={`s-${i}`} href={so.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{so.label}</Link>
            ))}
            {c.secondaryAction?.label && (
              <Link href={c.secondaryAction.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.secondaryAction.label}</Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
