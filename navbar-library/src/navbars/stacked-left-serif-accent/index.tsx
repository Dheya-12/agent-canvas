import { useCallback, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import a11y from '../../core/a11y.module.css';
import { useCloseOnDesktop, useDisclosure, useEscape, useScrollLock } from '../../core/hooks';
import s from './styles.module.css';

/**
 * Stacked-left rail with a centred serif wordmark.
 *
 * Three zones on three different alignments: navigation stacked vertically
 * hard-left, a serif wordmark centred on the viewport axis, and the actions
 * right — all deliberately overflowing a very shallow bar. Dark-first, with a
 * single hot accent (--nb-accent) carrying both actions and the disclosure
 * chevrons.
 */
export default function StackedLeftSerifAccent({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [openIdx, setOpenIdx] = useState(-1);
  const labels = menuLabels(c);

  useScrollLock(open);
  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 768px)');

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
        data-theme={c.theme ?? 'dark'}
        dir={c.dir ?? 'ltr'}
      >
        <div className={s.inner}>
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
                    <span className={s.linkLabel}>{it.label}</span>
                    {it.badge && <span className={s.badge}>{it.badge}</span>}
                    {kids.length > 0 && <span className={s.caret} aria-hidden="true">{'⌄'}</span>}
                  </Link>
                  {kids.length > 0 && (
                    /* The grid collapse needs its own wrapper: a <div> placed
                     * directly inside a <ul> is invalid and breaks the row
                     * collapse, so expanded children overlapped the next item. */
                    <div className={s.sub}>
                      <ul className={s.subInner}>
                        {kids.map((k, j) => (
                          <li key={`${k.label}-${j}`}>
                            <Link className={s.subLink} href={k.href} item={k} onNavigate={nav}>{k.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <Brand
            brand={c.brand}
            className={s.brand}
            imgClassName={s.brandImg}
            textClassName={s.brandText}
            onNavigate={onNavigate ? (h) => nav(h) : undefined}
          />

          <div className={s.tail}>
            {c.secondaryAction?.label && (
              <Link className={s.secondary} href={c.secondaryAction.href} onNavigate={nav}>{c.secondaryAction.label}</Link>
            )}
            {hasCta(c.cta) && (
              <Link className={s.cta} href={c.cta.href} onNavigate={nav}>
                <span className={s.ctaLabel}>{c.cta.label}</span>
              </Link>
            )}
          </div>

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
      </header>

      <div className={s.panel} data-open={open ? 'true' : 'false'} data-theme={c.theme ?? 'dark'} aria-hidden={!open} dir={c.dir ?? 'ltr'}>
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
        {(c.secondaryAction?.label || !!c.socials?.length) && (
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
