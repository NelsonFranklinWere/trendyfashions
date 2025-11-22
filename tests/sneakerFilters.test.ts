import { describe, expect, it } from 'vitest';

import type { Product } from '@/data/products';
import {
  DEFAULT_SNEAKER_FILTER,
  SNEAKER_BRAND_FILTERS,
  filterSneakerProducts,
} from '@/lib/filters/sneakers';

const buildProduct = (overrides: Partial<Product>): Product => ({
  id: 'test',
  name: 'Default Sneaker',
  description: 'Default sneaker description',
  price: 2800,
  image: '/images/sneakers/default.jpg',
  category: 'casual',
  gender: 'Unisex',
  ...overrides,
});

const SAMPLE_PRODUCTS: Product[] = [
  buildProduct({
    id: 'adidas-1',
    name: 'Adidas Samba OG',
    description: 'Adidas classic samba with gum sole',
    image: '/images/sneakers/AdidasSamba-1.jpg',
  }),
  buildProduct({
    id: 'adidas-2',
    name: 'Addidas Gazele Frost',
    description: 'Gazele suede special edition from Adidas',
    image: '/images/sneakers/AdidasGazele.jpg',
  }),
  buildProduct({
    id: 'newbalance-1',
    name: 'New Balance 530',
    description: 'New Balance cushioned runner',
    image: '/images/sneakers/New-Balance-530.jpg',
  }),
  buildProduct({
    id: 'newbalance-2',
    name: 'NB530 Steel',
    description: 'NB530 lifestyle sneaker',
    image: '/images/sneakers/NewBalance530.jpg',
  }),
  buildProduct({
    id: 'nike-1',
    name: 'Nike Air Force 1 Low',
    description: 'Nike Air Force 1 classic white',
    image: '/images/sneakers/Nike-Air-Force-1.jpg',
  }),
  buildProduct({
    id: 'nike-2',
    name: 'Nike SB Dunk Shadow',
    description: 'Nike SB skate sneaker',
    image: '/images/sneakers/NikeSB.jpg',
  }),
];

describe('filterSneakerProducts', () => {
  it('defaults to the first filter (Adidas)', () => {
    const results = filterSneakerProducts(SAMPLE_PRODUCTS, DEFAULT_SNEAKER_FILTER);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.id).toBe('adidas-1');
  });

  it('filters adidas sneakers correctly', () => {
    const results = filterSneakerProducts(SAMPLE_PRODUCTS, 'Adidas');
    expect(results).toHaveLength(2);
    expect(results[0]?.id).toBe('adidas-1');
  });

  it('filters new balance sneakers correctly', () => {
    const results = filterSneakerProducts(SAMPLE_PRODUCTS, 'New Balance');
    expect(results).toHaveLength(2);
    expect(results[0]?.id).toBe('newbalance-1');
  });

  it('filters nike sneakers correctly', () => {
    const results = filterSneakerProducts(SAMPLE_PRODUCTS, 'Nike');
    expect(results).toHaveLength(2);
    expect(results[0]?.id).toBe('nike-1');
  });

  it('includes expected filter labels', () => {
    expect(SNEAKER_BRAND_FILTERS).toEqual(['Adidas', 'New Balance', 'Nike']);
  });
});

