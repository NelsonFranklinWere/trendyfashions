/**
 * Bulk queries for static page generation — one round-trip per table.
 */
import { query } from './postgres';
import type { ProductRecord } from '@/types/database';
import type { ImageRecord } from '@/types/database';

const PRODUCT_COLUMNS =
  'id, name, description, price, image, category, subcategory, gender, tags, featured, created_at';

const IMAGE_COLUMNS =
  'id, category, subcategory, filename, url, thumbnail_url, name, price, description, uploaded_at';

export async function getAllProductsBulk(): Promise<ProductRecord[]> {
  const result = await query<ProductRecord>(
    `SELECT ${PRODUCT_COLUMNS} FROM products ORDER BY created_at DESC`,
  );
  return result.rows;
}

export async function getAllImagesBulk(): Promise<ImageRecord[]> {
  const result = await query<ImageRecord>(
    `SELECT ${IMAGE_COLUMNS} FROM images ORDER BY uploaded_at DESC`,
  );
  return result.rows;
}
