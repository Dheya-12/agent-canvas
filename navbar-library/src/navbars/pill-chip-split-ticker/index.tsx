import { useCallback, useMemo, useState } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import { useCloseOnDesktop, useDisclosure, useEscape, useScrollLock, useScrollState } from '../../core/hooks';
import a11y from '../../core/a11y.module.css';
import s from './styles.module.css';

/**
 * Pill-chip rail with split clusters and a centred announcement.
 *
 * Navigation renders as chips, not plain links, and is split around a centre
 * slot: `items` divide at their midpoint into a left and a right cluster,
 * `cta` joins the right cluster, and `secondaryAction` becomes the centred
 * announcement line. The rail is transparent at rest, takes a solid surface
 * once scrolled, and translates away on scroll-down.
 */
export default function PillChipSplitTicker({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const [openIdx, setOpenIdx] = useState(-1);
  const { past, hidden } = useScrollState(24, 140);
  const labels = menuLabels(c);

  useScrollLock(open);
  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 1024px)');

  // The split is the composition. With an odd count the left cluster takes
  // the extra item, which keeps the centre slot visually centred.
  const [left, right] = useMemo(() => {
    const n = c.items.length;
    const at = Math.ceil(n / 2);
    return [c.items.slice(0, at), c.items.slice(at)];
  }, [c.items]);

  const nav = useCallback(
    (href: string, item?: NavItem) => {
      onClose();
      setOpenIdx(-1);
      onNavigate?.(href, item);
    },
    [onClose, onNavigate],
  );

  const renderCluster = (list: NavItem[], offset: number, end: boolean) => (
    <ul className={[s.cluster, end ? s.clusterEnd : ''].filter(Boolean).join(' ')}>
      {list.map((it, i) => {
        const idx = offset + i;
        const kids = it.children?.filter(Boolean) ?? [];
        return (
          <li
            key={`${it.label}-${idx}`}
            className={s.item}
            data-open={openIdx === idx ? 'true' : 'false'}
            onMouseEnter={() => kids.length && setOpenIdx(idx)}
            onMouseLeave={() => setOpenIdx(-1)}
          >
            <Link
              className={s.link}
              href={it.href}
              item={it}
              data-current={it.current ? 'true' : undefined}
              aria-haspopup={kids.length ? 'true' : undefined}
              aria-expanded={kids.length ? openIdx === idx : undefined}
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
      {end && hasCta(c.cta) && (
        <li>
          <Link className={s.link} href={c.cta.href} onNavigate={nav} data-current="true">
            {c.cta.label}
          </Link>
        </li>
      )}
    </ul>
  );

  const announcement = c.secondaryAction?.label;

  return (
    <>
      <header
        className={[s.root, className].filter(Boolean).join(' ')}
        style={style}
        data-theme={c.theme ?? 'light'}
        data-past={past ? 'true' : 'false'}
        data-hidden={hidden && !open ? 'true' : 'false'}
        dir={c.dir ?? 'ltr'}
      >
        <a className={s.skip} href="#main">Skip navigation</a>

        <div className={s.inner}>
          {/* The reference carries no mark in the rail; below the chip
              breakpoint one is needed so the bar is not anonymous. */}
          <Brand
            brand={c.brand}
            className={s.brandSmall}
            imgClassName={s.brandSmallImg}
            textClassName={s.brandSmallText}
            onNavigate={onNavigate ? (h) => nav(h) : undefined}
          />

          {renderCluster(left, 0, false)}

          {announcement ? (
            <div className={s.ticker}>
              <span className={s.tickerText}>{announcement}</span>
              {c.secondaryAction?.href && (
                <Link className={s.tickerLink} href={c.secondaryAction.href} onNavigate={nav}>
                  {c.secondaryAction.icon ?? '→'}
                </Link>
              )}
            </div>
          ) : (
            <div className={s.spacer} />
          )}

          {renderCluster(right, left.length, true)}

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
            {hasCta(c.cta) && (
              <li style={{ ['--i' as string]: c.items.length }}>
                <Link className={s.panelLink} href={c.cta.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.cta.label}</Link>
              </li>
            )}
          </ul>
        </nav>
        {announcement && (
          <p className={s.panelTicker}>
            {announcement}{' '}
            {c.secondaryAction?.href && (
              <Link href={c.secondaryAction.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{c.secondaryAction.icon ?? '→'}</Link>
            )}
          </p>
        )}
        {!!c.socials?.length && (
          <div className={s.panelFoot}>
            {c.socials.map((so, i) => (
              <Link key={`sf-${i}`} href={so.href} onNavigate={nav} tabIndex={open ? 0 : -1}>{so.label}</Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
