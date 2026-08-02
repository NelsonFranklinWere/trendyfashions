import { Product } from '@/data/products';

/**
 * Validate if a product has a valid image
 * @param product Product to validate
 * @returns true if product has valid image, false otherwise
 */
export function isValidProduct(product: Product | null | undefined): boolean {
  // Check if product has required fields
  if (!product || !product.id || !product.name || !product.image || product.price === null || product.price === undefined) {
    return false;
  }

  // Camera dump names (WhatsApp IMG exports shown as "Img 2026…")
  const name = String(product.name || '').trim();
  if (/^img([\s\-_0-9]|$)/i.test(name) || /^image[\s\-_0-9]/i.test(name) || /img-20\d{2}/i.test(name)) {
    return false;
  }

  // Check if image is null, undefined, or empty
  if (!product.image || product.image === 'null' || product.image.trim() === '') {
    return false;
  }

  const image = product.image.trim();

  // Local public assets (uploads, categories, legacy /images)
  if (image.startsWith('/')) {
    if (
      image.startsWith('/uploads/') ||
      image.startsWith('/categories/') ||
      image.startsWith('/images/') ||
      image.startsWith('/logo/')
    ) {
      return true;
    }
    // Other root-relative paths still allowed for storefront assets
    return true;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    try {
      new URL(image);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Filter array of products to only include valid products
 * @param products Array of products to filter
 * @returns Array of valid products
 */
export function filterValidProducts(products: Product[]): Product[] {
  return products.filter(isValidProduct);
}

