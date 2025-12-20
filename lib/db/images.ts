/**
 * Database service for images table
 * Replaces Supabase calls with PostgreSQL queries
 */

import { query } from './postgres';
import type { ImageRecord } from '@/types/database';

export async function getImages(filters?: {
  category?: string;
  subcategory?: string;
  limit?: number;
  orderBy?: 'uploaded_at' | 'created_at';
  order?: 'asc' | 'desc';
}): Promise<ImageRecord[]> {
  let sql = 'SELECT * FROM images WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (filters?.category) {
    sql += ` AND category = $${paramIndex}`;
    params.push(filters.category);
    paramIndex++;
  }

  if (filters?.subcategory) {
    sql += ` AND subcategory = $${paramIndex}`;
    params.push(filters.subcategory);
    paramIndex++;
  }

  const orderBy = filters?.orderBy || 'uploaded_at';
  const order = filters?.order || 'desc';
  sql += ` ORDER BY ${orderBy} ${order.toUpperCase()}`;

  if (filters?.limit) {
    sql += ` LIMIT $${paramIndex}`;
    params.push(filters.limit);
  }

  const result = await query<ImageRecord>(sql, params);
  return result.rows;
}

export async function getImageById(id: string): Promise<ImageRecord | null> {
  const result = await query<ImageRecord>(
    'SELECT * FROM images WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function createImage(data: {
  category: string;
  subcategory: string;
  filename: string;
  url: string;
  storage_path: string;
  thumbnail_url?: string;
  uploaded_by?: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
}): Promise<ImageRecord> {
  const result = await query<ImageRecord>(
    `INSERT INTO images (
      category, subcategory, filename, url, storage_path, thumbnail_url,
      uploaded_by, file_size, mime_type, width, height
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      data.category,
      data.subcategory,
      data.filename,
      data.url,
      data.storage_path,
      data.thumbnail_url || null,
      data.uploaded_by || null,
      data.file_size || null,
      data.mime_type || null,
      data.width || null,
      data.height || null,
    ]
  );
  return result.rows[0];
}

export async function updateImage(
  id: string,
  data: Partial<ImageRecord>
): Promise<ImageRecord | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined) {
      updates.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (updates.length === 0) {
    return await getImageById(id);
  }

  values.push(id);
  const sql = `UPDATE images SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

  const result = await query<ImageRecord>(sql, values);
  return result.rows[0] || null;
}

export async function deleteImage(id: string): Promise<boolean> {
  const result = await query('DELETE FROM images WHERE id = $1', [id]);
  return result.rowCount > 0;
}

