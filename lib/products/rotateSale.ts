import type { Product } from '@/data/products';

/** Fisher–Yates shuffle — never leave the same first item sticky. */
export function shuffleProducts<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/**
 * Rotate order on an interval. Always reshuffles from original `source`
 * so bias toward previously top items does not accumulate.
 */
export function createProductRotator(
  source: Product[],
  intervalMs: number,
  onChange: (next: Product[]) => void,
): () => void {
  if (!source.length) {
    onChange([]);
    return () => undefined;
  }
  onChange(shuffleProducts(source));
  const id = window.setInterval(() => {
    onChange(shuffleProducts(source));
  }, intervalMs);
  return () => window.clearInterval(id);
}

export const SALE_ROTATE_MS = 2 * 60 * 1000;
