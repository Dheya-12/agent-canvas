import React, { useCallback } from 'react';
import type { NavAction, NavItem, NavbarBrand, NavbarContent } from './types';
import { useImageFallback } from './hooks';

/**
 * Anchor that defers to a host router when `onNavigate` is supplied.
 * Every navbar routes its links through this, so router integration is
 * a single prop rather than 50 separate concerns.
 */
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string;
  item?: NavItem;
  onNavigate?: (href: string, item?: NavItem) => void;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, item, onNavigate, onClick, children, ...rest }, ref,
) {
  const handle = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (!onNavigate || !href) return;
      // Let modified clicks behave natively.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      onNavigate(href, item);
    },
    [onNavigate, href, item, onClick],
  );
  return (
    <a ref={ref} href={href || '#'} onClick={handle} {...rest}>
      {children}
    </a>
  );
});

/**
 * Brand mark. Renders the image when one is supplied and loads; falls back
 * to the wordmark on error or absence. `name` is therefore never optional.
 */
export function Brand({
  brand,
  className,
  imgClassName,
  textClassName,
  onNavigate,
  children,
}: {
  brand: NavbarBrand;
  className?: string;
  imgClassName?: string;
  textClassName?: string;
  onNavigate?: (href: string) => void;
  children?: React.ReactNode;
}) {
  const { show, onError } = useImageFallback(brand.logo);
  return (
    <Link
      href={brand.href || '/'}
      className={className}
      onNavigate={onNavigate ? (h) => onNavigate(h) : undefined}
      aria-label={brand.name}
    >
      {show ? (
        <img src={brand.logo} alt={brand.logoAlt || brand.name} className={imgClassName} onError={onError} />
      ) : (
        <span className={textClassName}>{brand.name}</span>
      )}
      {children}
    </Link>
  );
}

/** Normalizes a possibly-absent content object so no navbar has to guard. */
export function useSafeContent(content: NavbarContent): Required<
  Pick<NavbarContent, 'brand' | 'items'>
> & NavbarContent {
  const brand = content?.brand ?? { name: '' };
  const items = Array.isArray(content?.items) ? content.items.filter(Boolean) : [];
  return { ...content, brand, items };
}

export function hasCta(cta?: NavAction | null): cta is NavAction {
  return !!cta && typeof cta.label === 'string' && cta.label.length > 0;
}

export const menuLabels = (c: NavbarContent) => ({
  open: c.menuLabel?.open ?? 'Menu',
  close: c.menuLabel?.close ?? 'Close',
});
