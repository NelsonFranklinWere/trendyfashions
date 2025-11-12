import fs from 'fs';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { getCasualImageProducts } from '@/lib/server/casualImageProducts';

const existsSpy = vi.spyOn(fs, 'existsSync');
const readdirSpy = vi.spyOn(fs, 'readdirSync');

describe('getCasualImageProducts', () => {
  afterEach(() => {
    existsSpy.mockReset();
    readdirSpy.mockReset();
  });

  afterAll(() => {
    existsSpy.mockRestore();
    readdirSpy.mockRestore();
  });

  it('returns empty array when casual directory is missing', () => {
    existsSpy.mockReturnValue(false);

    const result = getCasualImageProducts();

    expect(result).toEqual([]);
    expect(existsSpy).toHaveBeenCalled();
    expect(readdirSpy).not.toHaveBeenCalled();
  });

  it('maps image files to product entries', () => {
    existsSpy.mockReturnValue(true);
    readdirSpy.mockReturnValue([
      'Adidas-casual-1.jpg',
      'vans_classic.jpeg',
      'relaxed-casuals.png',
      'note.txt',
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    const result = getCasualImageProducts();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 'casual-auto-adidas-casual-1',
      name: 'Adidas Casual',
      description: 'Adidas Casual — Quality casual shoes from Trendy Fashion Zone',
      image: '/images/casual/Adidas-casual-1.jpg',
      category: 'casual',
      gender: 'Unisex',
      price: 2800,
    });
    expect(result[1]).toMatchObject({
      id: 'casual-auto-relaxed-casuals',
      name: 'Relaxed Casuals',
      image: '/images/casual/relaxed-casuals.png',
    });
  });
});


