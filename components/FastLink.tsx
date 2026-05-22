'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, type ReactNode } from 'react';

type FastLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
};

function pathFromHref(href: LinkProps['href']): string {
  if (typeof href === 'string') return href.split('?')[0];
  if (href && typeof href === 'object' && 'pathname' in href && href.pathname) {
    return String(href.pathname);
  }
  return '';
}

/**
 * Next.js Link with prefetch + hover/touch prefetch for faster navigation.
 */
export default function FastLink({ href, children, prefetch = true, ...props }: FastLinkProps) {
  const router = useRouter();
  const path = pathFromHref(href);

  const warmRoute = useCallback(() => {
    if (!path || !path.startsWith('/') || path.startsWith('//')) return;
    void router.prefetch(path);
  }, [router, path]);

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onMouseEnter={warmRoute}
      onTouchStart={warmRoute}
      onFocus={warmRoute}
      {...props}
    >
      {children}
    </Link>
  );
}
