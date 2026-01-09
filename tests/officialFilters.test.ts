import { describe, expect, it } from 'vitest';

import type { Product } from '@/data/products';
import {
  DEFAULT_OFFICIAL_FILTER,
  OFFICIAL_SUBCATEGORY_FILTERS,
  filterOfficialsProducts,
} from '@/lib/filters/officials';

const buildProduct = (overrides: Partial<Product>): Product => ({
  id: 'test',
  name: 'Default',
  description: 'Default description',
  price: 2800,
  image: '/images/officials/default.jpg',
  category: 'formal',
  gender: 'Unisex',
  ...overrides,
});

const SAMPLE_PRODUCTS: Product[] = [
  buildProduct({
    id: 'boots-1',
    name: 'Official Timber Boots',
    description: 'Premium timber boots for formal looks',
    image: '/images/officials/OfficialTimberBoots-1.jpg',
  }),
  buildProduct({
    id: 'empire-1',
    name: 'Empire Officials 1',
    description: 'Empire signature line',
    image: '/images/officials/Empire-Officials-1.jpg',
  }),
  buildProduct({
    id: 'casual-1',
    name: 'Official Casual Loafers',
    description: 'Official casual loafers for relaxed boardroom days',
    image: '/images/officials/OfficialCasuals-3.jpg',
  }),
  buildProduct({
    id: 'mules-1',
    name: 'Mules 1',
    description: 'Premium leather mules for effortless executives',
    image: '/images/officials/Mules-1.jpg',
  }),
  buildProduct({
    id: 'clarks-1',
    name: 'Clarks',
    description: 'Clarks signature officials with Nairobi-ready comfort',
    image: '/images/officials/Clarks.jpg',
  }),
];

describe('filterOfficialsProducts', () => {
  it('defaults to the first filter (Boots)', () => {
    const results = filterOfficialsProducts(SAMPLE_PRODUCTS, DEFAULT_OFFICIAL_FILTER);
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('boots-1');
  });

  it('filters boots products correctly', () => {
    const results = filterOfficialsProducts(SAMPLE_PRODUCTS, 'Boots');
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('boots-1');
  });

  it('filters empire products correctly', () => {
    const results = filterOfficialsProducts(SAMPLE_PRODUCTS, 'Empire');
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('empire-1');
  });

  it('filters casual products correctly', () => {
    const results = filterOfficialsProducts(SAMPLE_PRODUCTS, 'Casuals');
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('casual-1');
  });

  it('filters mules products correctly', () => {
    const results = filterOfficialsProducts(SAMPLE_PRODUCTS, 'Mules');
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('mules-1');
  });

  it('filters clarks products correctly', () => {
    const results = filterOfficialsProducts(SAMPLE_PRODUCTS, 'Clarks');
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('clarks-1');
  });

  it('includes expected filter labels', () => {
    expect(OFFICIAL_SUBCATEGORY_FILTERS).toEqual([
      'Boots',
      'Empire',
      'Casuals',
      'Mules',
      'Clarks',
    ]);
  });
});


