import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect legacy/non-existent pages
  const redirects: Record<string, string> = {
    '/collections/mens-shoes': '/collections/mens-officials',
    '/collections/officials': '/collections/mens-officials',
    '/collections/casuals': '/collections/casual',
    '/collections/mens-casuals': '/collections/casual',
    '/collections/mens-nike': '/collections/nike',
    '/collections/new-arrivals': '/collections?filter=New Arrivals',
    '/collections/best-sellers': '/collections?filter=Best Sellers',
    '/collections/offers-discounts': '/collections?filter=Offers',
    '/collections/unisex-collection': '/collections',
  };

  if (redirects[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = redirects[pathname];
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/collections/mens-shoes',
    '/collections/officials',
    '/collections/casuals',
    '/collections/mens-casuals',
    '/collections/mens-nike',
    '/collections/new-arrivals',
    '/collections/best-sellers',
    '/collections/offers-discounts',
    '/collections/unisex-collection',
  ],
};

