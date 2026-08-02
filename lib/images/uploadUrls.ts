const SITE_HOSTS = new Set([
  'trendyfashionzone.co.ke',
  'www.trendyfashionzone.co.ke',
  'localhost',
  '127.0.0.1',
]);

/** Turn absolute same-origin upload URLs into root-relative paths. */
export function toLocalImageSrc(src: string | undefined | null): string {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('/')) {
    return trimmed.split('?')[0].split('#')[0];
  }

  try {
    const url = new URL(trimmed);
    if (SITE_HOSTS.has(url.hostname) || url.hostname.endsWith('.trendyfashionzone.co.ke')) {
      return `${url.pathname}${url.search}` || trimmed;
    }
  } catch {
    // keep original
  }

  return trimmed;
}

/** Insert `thumb-` before the filename for /uploads paths. */
export function toThumbnailSrc(src: string | undefined | null): string {
  const local = toLocalImageSrc(src);
  if (!local) return '';
  if (!local.includes('/uploads/')) return local;
  if (/\/thumb-[^/]+$/i.test(local)) return local;
  return local.replace(/\/([^/]+)$/, '/thumb-$1');
}

/** Strip `thumb-` prefix to recover the full upload path. */
export function toFullUploadSrc(src: string | undefined | null): string {
  const local = toLocalImageSrc(src);
  if (!local) return '';
  return local.replace(/\/thumb-([^/]+)$/i, '/$1');
}

/**
 * Identity key so full + thumb URLs of the same file dedupe.
 * e.g. /uploads/.../thumb-foo.webp and /uploads/.../foo.webp → same key
 */
export function getUploadIdentityKey(image: string | undefined | null): string {
  if (!image) return '';
  let path = toLocalImageSrc(image).toLowerCase();
  if (!path) {
    const normalized = String(image).trim().toLowerCase();
    try {
      if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
        path = decodeURIComponent(new URL(normalized).pathname);
      } else {
        path = decodeURIComponent(normalized.split('?')[0].split('#')[0]);
      }
    } catch {
      path = normalized;
    }
  }
  path = path.replace(/\/+/g, '/');
  return path.replace(/\/thumb-([^/]+)$/i, '/$1');
}

/** True when src is already a local WebP under /uploads (skip Next re-encode on the VPS). */
export function isPreoptimizedUpload(src: string): boolean {
  const local = toLocalImageSrc(src);
  return local.startsWith('/uploads/') && /\.webp($|\?)/i.test(local);
}

/**
 * Prefer full product art over tiny `thumb-*` stubs so cards and PDPs stay sharp.
 * Fall back to thumb only when nothing else exists.
 */
export function preferProductImageSrc(
  primary?: string | null,
  full?: string | null,
): string {
  const fullSrc = toFullUploadSrc(full || primary || '') || toLocalImageSrc(full || '');
  const primaryLocal = toLocalImageSrc(primary || '');
  if (fullSrc) return fullSrc;
  if (primaryLocal) return toFullUploadSrc(primaryLocal) || primaryLocal;
  return (primary || full || '').trim();
}
