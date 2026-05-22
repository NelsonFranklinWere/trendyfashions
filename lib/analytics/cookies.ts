/** Read Meta click/browser cookies for CAPI attribution. */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  const map = document.cookie.split(';').reduce<Record<string, string>>((acc, part) => {
    const [k, ...rest] = part.trim().split('=');
    if (k) acc[k] = rest.join('=');
    return acc;
  }, {});
  return {
    fbp: map._fbp,
    fbc: map._fbc,
  };
}
