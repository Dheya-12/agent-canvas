import { useCallback, useMemo } from 'react';
import type { NavItem, NavbarProps } from '../../core/types';
import { Brand, Link, hasCta, menuLabels, useSafeContent } from '../../core/primitives';
import { useCloseOnDesktop, useDisclosure, useEscape } from '../../core/hooks';
import s from './styles.module.css';

const COLUMNS = 3;
const PALETTE_SIZE = 6;

/**
 * Colour-block grid.
 *
 * Navigation is not a row of links: each item becomes a full-bleed coloured
 * strip, and the strips are laid out in three columns. The action is a tall
 * block filling the last column in the largest type in the bar. Colours are
 * assigned by position from an overridable palette, so the composition holds
 * whatever labels it is given.
 */
export default function ColourBlockGrid({ content, className, style, onNavigate }: NavbarProps) {
  const c = useSafeContent(content);
  const { open, onClose, onToggle } = useDisclosure();
  const labels = menuLabels(c);

  useEscape(open, onClose);
  useCloseOnDesktop(open, onClose, '(min-width: 1024px)');

  const nav = useCallback(
    (href: string, item?: NavItem) => { onClose(); onNavigate?.(href, item); },
    [onClose, onNavigate],
  );

  // Items are dealt into columns in order, so the reading order across a
  // column matches the source order rather than snaking between columns.
  const columns = useMemo(() => {
    const cols: NavItem[][] = Array.from({ length: COLUMNS }, () => []);
    const per = Math.ceil(c.items.length / COLUMNS) || 1;
    c.items.forEach((it, i) => {
      cols[Math.min(Math.floor(i / per), COLUMNS - 1)].push(it);
    });
    return cols;
  }, [c.items]);

  let colour = 0;
  const nextColour = () => `var(--nb-block-${(colour++ % PALETTE_SIZE) + 1})`;

  return (
    <header
      className={[s.root, className].filter(Boolean).join(' ')}
      style={style}
      data-theme={c.theme ?? 'light'}
      data-open={open ? 'true' : 'false'}
      dir={c.dir ?? 'ltr'}
    >
      {/* Below 720px the bar is this row; the blocks live in the disclosure. */}
      <div className={s.mobileRow}>
        {hasCta(c.cta) ? (
          <Link className={s.mobileCta} href={c.cta.href} onNavigate={nav}>
            <span className={s.mobileCtaLabel}>{c.cta.label}</span>
            <span aria-hidden="true">{c.cta.icon ?? '\u2198'}</span>
          </Link>
        ) : (
          <Brand brand={c.brand} className={s.mobileCta} imgClassName={s.brandImg} onNavigate={onNavigate ? (h) => nav(h) : undefined} />
        )}
        <button type="button" className={s.toggle} aria-expanded={open} aria-label={open ? labels.close : labels.open} onClick={onToggle}>
          <span>{labels.open}</span>
          <span className={s.toggleGlyph} aria-hidden="true">+</span>
        </button>
      </div>

      <div className={s.stack}>
        <div className={s.stackInner}>
      {columns.map((col, ci) => (
        <div className={s.col} key={`col-${ci}`}>
          {ci === 0 && (
            <Brand
              brand={c.brand}
              className={s.brand}
              imgClassName={s.brandImg}
              onNavigate={onNavigate ? (h) => nav(h) : undefined}
            />
          )}

          {col.map((it, i) => {
            const bg = nextColour();
            const kids = it.children?.filter(Boolean) ?? [];
            return (
              <div key={`${it.label}-${ci}-${i}`}>
                <Link
                  className={s.strip}
                  style={{ ['--strip-bg' as string]: bg }}
                  href={it.href}
                  item={it}
                  data-current={it.current ? 'true' : undefined}
                  onNavigate={nav}
                >
                  <span className={s.stripLabel}>{it.label}</span>
                  {it.badge && <span className={s.badge}>{it.badge}</span>}
                </Link>
                {kids.length > 0 && (
                  <div className={s.sub}>
                    {kids.map((k, j) => (
                      <Link
                        key={`${k.label}-${j}`}
                        className={s.subStrip}
                        style={{ ['--strip-bg' as string]: bg }}
                        href={k.href}
                        item={k}
                        onNavigate={nav}
                      >
                        {k.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {ci === COLUMNS - 1 && (
            <>
              {c.secondaryAction?.label && (
                <Link className={s.secondary} href={c.secondaryAction.href} onNavigate={nav}>
                  {c.secondaryAction.label}
                </Link>
              )}
              {hasCta(c.cta) && (
                <Link className={s.cta} href={c.cta.href} onNavigate={nav}>
                  <span className={s.ctaLabel}>{c.cta.label}</span>
                  <span className={s.ctaArrow} aria-hidden="true">{c.cta.icon ?? '↘'}</span>
                </Link>
              )}
              {!!c.socials?.length && (
                <div className={s.socials}>
                  {c.socials.map((so, i) => (
                    <Link key={`so-${i}`} className={s.social} href={so.href} onNavigate={nav}>
                      {so.label}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
        </div>
      </div>
    </header>
  );
}
