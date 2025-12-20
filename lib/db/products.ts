/**
 * Database service for products table
 * Replaces Supabase calls with PostgreSQL queries
 */

import { query } from './postgres';
import type { ProductRecord } from '@/types/database';

export async function getProducts(filters?: {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  limit?: number;
  orderBy?: 'created_at' | 'name' | 'price';
  order?: 'asc' | 'desc';
}): Promise<ProductRecord[]> {
  let sql = 'SELECT * FROM products WHERE 1=1';
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

  if (filters?.featured !== undefined) {
    sql += ` AND featured = $${paramIndex}`;
    params.push(filters.featured);
    paramIndex++;
  }

  const orderBy = filters?.orderBy || 'created_at';
  const order = filters?.order || 'desc';
  sql += ` ORDER BY ${orderBy} ${order.toUpperCase()}`;

  if (filters?.limit) {
    sql += ` LIMIT $${paramIndex}`;
    params.push(filters.limit);
  }

  const result = await query<ProductRecord>(sql, params);
  return result.rows;
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const result = await query<ProductRecord>(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  gender?: string;
  tags?: string[];
  featured?: boolean;
}): Promise<ProductRecord> {
  const result = await query<ProductRecord>(
    `INSERT INTO products (
      name, description, price, image, category, subcategory,
      gender, tags, featured
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      data.name,
      data.description || null,
      data.price,
      data.image,
      data.category,
      data.subcategory || null,
      data.gender || null,
      data.tags || [],
      data.featured || false,
    ]
  );
  return result.rows[0];
}

export async function updateProduct(
  id: string,
  data: Partial<ProductRecord>
): Promise<ProductRecord | null> {
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
    return await getProductById(id);
  }

  values.push(id);
  const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

  const result = await query<ProductRecord>(sql, values);
  return result.rows[0] || null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await query('DELETE FROM products WHERE id = $1', [id]);
  return result.rowCount > 0;
}

