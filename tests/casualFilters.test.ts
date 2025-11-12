import { describe, expect, it } from 'vitest';

import type { Product } from '@/data/products';
import {
  CASUAL_BRAND_FILTERS,
  DEFAULT_CASUAL_FILTER,
  filterCasualProducts,
  hasCasualMatches,
} from '@/lib/filters/casuals';

const createProduct = (overrides: Partial<Product>): Product => {
  return {
    id: 'id',
    name: 'Sample Shoe',
    description: 'Sample description',
    price: 2800,
    image: '/images/casual/sample.jpg',
    category: 'casual',
    gender: 'Unisex',
    ...overrides,
  };
};

const SAMPLE_PRODUCTS: Product[] = [
  createProduct({
    id: 'lacoste-1',
    name: 'Lacoste Lounge Slip',
    description: 'Lacoste casual loafer for relaxed days',
    image: '/images/casual/LacosteLoafers1.jpg',
  }),
  createProduct({
    id: 'timberland-1',
    name: 'Timberland Casual Crest',
    description: 'Timberland casual shoe with premium leather finish',
    image: '/images/casual/TimberCasuall1.jpg',
  }),
  createProduct({
    id: 'tommy-1',
    name: 'TommyHilfigerCasuals',
    description: 'Tommy Hilfiggr inspired casual sneaker',
    image: '/images/casual/TommyHilfigerCasuals1.jpg',
  }),
  createProduct({
    id: 'boss-1',
    name: 'Boss Signature Casual',
    description: 'Boss branded casual shoe with refined edge',
    image: '/images/casual/BossCasual1.jpg',
  }),
];

describe('casual filters', () => {
  it('exposes expected brand filters', () => {
    expect(CASUAL_BRAND_FILTERS).toEqual(['Lacoste', 'Timberland', 'Tommy Hilfiggr', 'Boss', 'Other']);
    expect(DEFAULT_CASUAL_FILTER).toBe('Lacoste');
  });

  it('filters Lacoste products', () => {
    const result = filterCasualProducts(SAMPLE_PRODUCTS, 'Lacoste');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('lacoste-1');
  });

  it('filters Timberland products', () => {
    const result = filterCasualProducts(SAMPLE_PRODUCTS, 'Timberland');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('timberland-1');
  });

  it('filters Tommy Hilfiggr products', () => {
    const result = filterCasualProducts(SAMPLE_PRODUCTS, 'Tommy Hilfiggr');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('tommy-1');
  });

  it('filters Boss products', () => {
    const result = filterCasualProducts(SAMPLE_PRODUCTS, 'Boss');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('boss-1');
  });

  it('filters Other products', () => {
    const others = [
      ...SAMPLE_PRODUCTS,
      createProduct({
        id: 'other-1',
        name: 'Easy Casual Slip',
        description: 'Relaxed casual slip-on shoe',
        image: '/images/casual/Casuals013.jpg',
      }),
    ];
    const result = filterCasualProducts(others, 'Other');
    expect(result.map((item) => item.id)).toContain('other-1');
    expect(result.map((item) => item.id)).not.toContain('lacoste-1');
  });

  it('indicates when matches exist for a filter', () => {
    expect(hasCasualMatches(SAMPLE_PRODUCTS, 'Lacoste')).toBe(true);
    expect(hasCasualMatches(SAMPLE_PRODUCTS, 'Boss')).toBe(true);
  });

  it('returns empty array when no matches are found', () => {
    const result = filterCasualProducts([], 'Lacoste');
    expect(result).toEqual([]);
  });
});


