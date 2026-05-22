import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LEGACY_COLLECTION_REDIRECTS } from '@/lib/routes/collectionLinks';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const target = LEGACY_COLLECTION_REDIRECTS[pathname];
  if (target) {
    const url = request.nextUrl.clone();
    const [destPath, destQuery] = target.split('?');
    url.pathname = destPath;
    if (destQuery) {
      url.search = `?${destQuery}`;
    } else if (search) {
      url.search = search;
    } else {
      url.search = '';
    }
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/collections/:path*'],
};
