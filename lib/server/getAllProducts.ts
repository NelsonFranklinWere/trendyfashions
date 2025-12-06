import { Product } from '@/data/products';
import { getCasualImageProducts } from './casualImageProducts';
import { getOfficialImageProducts } from './officialImageProducts';
import { getAirmaxImageProducts } from './airmaxImageProducts';
import { getAirforceImageProducts } from './airforceImageProducts';
import { getCustomizedImageProducts } from './customizedImageProducts';
import { getVansImageProducts } from './vansImageProducts';
import { getJordanImageProducts } from './jordanImageProducts';
import { getSneakersImageProducts } from './sneakersImageProducts';

/**
 * Get all products from all categories
 * @returns Array of all products from all categories
 */
export async function getAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];

  try {
    const officialProducts = await getOfficialImageProducts();
    allProducts.push(...officialProducts);
  } catch (e) {
    console.warn('Failed to load official products:', e);
  }

  try {
    allProducts.push(...getSneakersImageProducts());
  } catch (e) {
    console.warn('Failed to load sneakers products:', e);
  }

  try {
    allProducts.push(...getAirmaxImageProducts());
  } catch (e) {
    console.warn('Failed to load airmax products:', e);
  }

  try {
    allProducts.push(...getCasualImageProducts());
  } catch (e) {
    console.warn('Failed to load casual products:', e);
  }

  try {
    allProducts.push(...getAirforceImageProducts());
  } catch (e) {
    console.warn('Failed to load airforce products:', e);
  }

  try {
    allProducts.push(...getCustomizedImageProducts());
  } catch (e) {
    console.warn('Failed to load customized products:', e);
  }

  try {
    allProducts.push(...getVansImageProducts());
  } catch (e) {
    console.warn('Failed to load vans products:', e);
  }

  try {
    allProducts.push(...getJordanImageProducts());
  } catch (e) {
    console.warn('Failed to load jordan products:', e);
  }

  // Remove duplicates based on image path
  const uniqueProducts = Array.from(
    new Map(allProducts.map((p) => [p.image, p])).values()
  );

  return uniqueProducts;
}
