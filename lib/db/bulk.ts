/**
 * Bulk queries for static page generation — one round-trip per table.
 */
import { query } from './postgres';
import type { ProductRecord } from '@/types/database';
import type { ImageRecord } from '@/types/database';
import { ensureImageTagsColumn } from './images';

const PRODUCT_COLUMNS =
  'id, name, description, price, image, category, subcategory, gender, tags, featured, created_at, updated_at';

const IMAGE_COLUMNS =
  'id, category, subcategory, filename, url, thumbnail_url, name, price, description, tags, uploaded_at, updated_at';

export async function getAllProductsBulk(): Promise<ProductRecord[]> {
  const result = await query<ProductRecord>(
    `SELECT ${PRODUCT_COLUMNS} FROM products ORDER BY created_at DESC`,
  );
  return result.rows;
}

export async function getAllImagesBulk(): Promise<ImageRecord[]> {
  try {
    await ensureImageTagsColumn();
  } catch {
    // continue — select may still work
  }
  try {
    const result = await query<ImageRecord>(
      `SELECT ${IMAGE_COLUMNS} FROM images ORDER BY uploaded_at DESC`,
    );
    return result.rows;
  } catch {
    // Older DB without tags column
    const result = await query<ImageRecord>(
      `SELECT id, category, subcategory, filename, url, thumbnail_url, name, price, description, uploaded_at FROM images ORDER BY uploaded_at DESC`,
    );
    return result.rows;
  }
}
