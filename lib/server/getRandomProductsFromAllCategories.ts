import { Product } from '@/data/products';
import { getCasualImageProducts } from './casualImageProducts';
import { getOfficialImageProducts } from './officialImageProducts';
import { getAirmaxImageProducts } from './airmaxImageProducts';
import { getAirforceImageProducts } from './airforceImageProducts';
import { getCustomizedImageProducts } from './customizedImageProducts';

/**
 * Get random products from selected categories with weighted distribution:
 * - Mostly officials (50%)
 * - Airmax, Casuals (30%)
 * - Airforce, Custom (20%)
 * @param count - Number of products to return (default: 30)
 * @returns Array of random products from different categories
 */
export function getRandomProductsFromAllCategories(count: number = 30): Product[] {
  const categoryProducts: {
    officials: Product[];
    airmax: Product[];
    casuals: Product[];
    airforce: Product[];
    custom: Product[];
  } = {
    officials: [],
    airmax: [],
    casuals: [],
    airforce: [],
    custom: [],
  };

  // Collect products from selected categories only
  try {
    const officialProducts = getOfficialImageProducts();
    categoryProducts.officials = officialProducts;
  } catch (e) {
    console.warn('Failed to load official products:', e);
  }

  try {
    const airmaxProducts = getAirmaxImageProducts();
    categoryProducts.airmax = airmaxProducts;
  } catch (e) {
    console.warn('Failed to load airmax products:', e);
  }

  try {
    const casualProducts = getCasualImageProducts();
    categoryProducts.casuals = casualProducts;
  } catch (e) {
    console.warn('Failed to load casual products:', e);
  }

  try {
    const airforceProducts = getAirforceImageProducts();
    categoryProducts.airforce = airforceProducts;
  } catch (e) {
    console.warn('Failed to load airforce products:', e);
  }

  try {
    const customizedProducts = getCustomizedImageProducts();
    categoryProducts.custom = customizedProducts;
  } catch (e) {
    console.warn('Failed to load customized products:', e);
  }

  // Remove duplicates based on image path for each category
  const uniqueOfficials = Array.from(
    new Map(categoryProducts.officials.map((p) => [p.image, p])).values()
  );
  const uniqueAirmax = Array.from(
    new Map(categoryProducts.airmax.map((p) => [p.image, p])).values()
  );
  const uniqueCasuals = Array.from(
    new Map(categoryProducts.casuals.map((p) => [p.image, p])).values()
  );
  const uniqueAirforce = Array.from(
    new Map(categoryProducts.airforce.map((p) => [p.image, p])).values()
  );
  const uniqueCustom = Array.from(
    new Map(categoryProducts.custom.map((p) => [p.image, p])).values()
  );

  // Shuffle each category
  const shuffledOfficials = uniqueOfficials.sort(() => Math.random() - 0.5);
  const shuffledAirmax = uniqueAirmax.sort(() => Math.random() - 0.5);
  const shuffledCasuals = uniqueCasuals.sort(() => Math.random() - 0.5);
  const shuffledAirforce = uniqueAirforce.sort(() => Math.random() - 0.5);
  const shuffledCustom = uniqueCustom.sort(() => Math.random() - 0.5);

  // Weighted distribution: 50% officials, 20% airmax, 20% casuals, 5% airforce, 5% custom
  const officialsCount = Math.floor(count * 0.5);
  const airmaxCount = Math.floor(count * 0.2);
  const casualsCount = Math.floor(count * 0.2);
  const airforceCount = Math.floor(count * 0.05);
  const customCount = count - officialsCount - airmaxCount - casualsCount - airforceCount;

  const selectedProducts: Product[] = [];

  // Add officials (mostly)
  selectedProducts.push(...shuffledOfficials.slice(0, Math.min(officialsCount, shuffledOfficials.length)));

  // Add airmax
  selectedProducts.push(...shuffledAirmax.slice(0, Math.min(airmaxCount, shuffledAirmax.length)));

  // Add casuals
  selectedProducts.push(...shuffledCasuals.slice(0, Math.min(casualsCount, shuffledCasuals.length)));

  // Add airforce (less)
  selectedProducts.push(...shuffledAirforce.slice(0, Math.min(airforceCount, shuffledAirforce.length)));

  // Add custom (less)
  selectedProducts.push(...shuffledCustom.slice(0, Math.min(customCount, shuffledCustom.length)));

  // Final shuffle to randomize order
  const finalShuffled = selectedProducts.sort(() => Math.random() - 0.5);

  return finalShuffled.slice(0, Math.min(count, finalShuffled.length));
}

