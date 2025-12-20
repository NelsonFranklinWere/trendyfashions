import fs from 'fs';
import path from 'path';
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

  // Check if image is null, undefined, or empty
  if (!product.image || product.image === 'null' || product.image.trim() === '') {
    return false;
  }

  // For local images (starting with /images/), verify file exists
  if (product.image.startsWith('/images/')) {
    try {
      const imagePath = path.join(process.cwd(), 'public', product.image);
      if (!fs.existsSync(imagePath)) {
        // If file doesn't exist locally, it might be on DigitalOcean Spaces
        // Allow it to pass validation - the browser will handle 404s
        console.warn(`Local image not found: ${product.image}, but allowing for CDN fallback`);
        return true; // Allow CDN URLs even if local file doesn't exist
      }
    } catch (error) {
      // On error, still allow the product (might be CDN URL)
      return true;
    }
  } else if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
    // For external URLs (DigitalOcean Spaces CDN, etc.), validate URL format
    try {
      new URL(product.image);
      // Allow all valid URLs (DigitalOcean Spaces, etc.)
      return true;
    } catch (error) {
      return false;
    }
  } else {
    // Invalid image path format
    return false;
  }

  return true;
}

/**
 * Filter array of products to only include valid products
 * @param products Array of products to filter
 * @returns Array of valid products
 */
export function filterValidProducts(products: Product[]): Product[] {
  return products.filter(isValidProduct);
}

