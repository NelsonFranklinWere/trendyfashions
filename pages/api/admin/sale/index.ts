import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { getProducts, getProductById, updateProduct } from '@/lib/db/products';
import {
  ensureImageTagsColumn,
  getImageById,
  getImages,
  updateImage,
} from '@/lib/db/images';
import { ensureSaleTag } from '@/lib/products/flags';
import { clearBuildProductCache } from '@/lib/server/buildProductCache';
import { clearFeedCache } from '@/lib/catalog/loadFeedProducts';
import { toLocalImageSrc } from '@/lib/images/uploadUrls';
import type { ImageRecord, ProductRecord } from '@/types/database';

export type SaleListItem = {
  id: string;
  source: 'product' | 'image';
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string | null;
  onSale: boolean;
};

function saleTagsMatch(tags: string[] | null | undefined): boolean {
  return (tags || []).some((t) => {
    const v = String(t).toLowerCase().trim();
    return v === 'sale' || v === 'meta ads' || v === 'meta-ads' || v === 'on sale' || v === 'ads';
  });
}

function productOnSale(p: ProductRecord): boolean {
  if (p.category === 'sale') return true;
  return saleTagsMatch(p.tags);
}

function imageOnSale(img: ImageRecord): boolean {
  return saleTagsMatch(img.tags);
}

function productToItem(p: ProductRecord): SaleListItem {
  return {
    id: p.id,
    source: 'product',
    name: p.name || 'Untitled',
    price: Number(p.price) || 0,
    image: toLocalImageSrc(p.image) || p.image || '',
    category: p.category || '',
    subcategory: p.subcategory || null,
    onSale: productOnSale(p),
  };
}

function imageToItem(img: ImageRecord): SaleListItem {
  const name =
    (img.name && img.name.trim()) ||
    img.filename?.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') ||
    'Product';
  return {
    id: img.id,
    source: 'image',
    name,
    price: Number(img.price) || 0,
    image: toLocalImageSrc(img.thumbnail_url || img.url) || img.url || '',
    category: img.category || '',
    subcategory: img.subcategory || null,
    onSale: imageOnSale(img),
  };
}

function parseId(raw: string): { source: 'product' | 'image'; id: string } {
  const value = String(raw || '').trim();
  if (value.startsWith('db-')) {
    return { source: 'image', id: value.slice(3) };
  }
  if (value.startsWith('product-')) {
    return { source: 'product', id: value.slice(8) };
  }
  if (value.startsWith('image:')) {
    return { source: 'image', id: value.slice(6) };
  }
  if (value.startsWith('product:')) {
    return { source: 'product', id: value.slice(8) };
  }
  return { source: 'product', id: value };
}

async function setSaleStatus(
  rawId: string,
  sourceHint: 'product' | 'image' | undefined,
  onSale: boolean,
): Promise<SaleListItem | null> {
  let source: 'product' | 'image' = sourceHint === 'image' || sourceHint === 'product' ? sourceHint : 'product';
  let id = rawId;

  const parsed = parseId(id);
  if (sourceHint !== 'image' && sourceHint !== 'product') {
    source = parsed.source;
    id = parsed.id;
  } else {
    id = parseId(id).id;
  }

  if (source === 'image') {
    const existing = await getImageById(id);
    if (!existing) return null;
    const tags = ensureSaleTag(existing.tags, onSale);
    const updated = await updateImage(id, { tags });
    return imageToItem(updated || { ...existing, tags });
  }

  const existing = await getProductById(id);
  if (!existing) {
    const asImage = await getImageById(id);
    if (!asImage) return null;
    const tags = ensureSaleTag(asImage.tags, onSale);
    const updated = await updateImage(id, { tags });
    return imageToItem(updated || { ...asImage, tags });
  }
  const tags = ensureSaleTag(existing.tags, onSale);
  const product = await updateProduct(id, { tags });
  return productToItem(product || { ...existing, tags });
}

async function bustCaches(res: NextApiResponse) {
  clearBuildProductCache();
  clearFeedCache();
  try {
    const revalidate = (res as NextApiResponse & { revalidate?: (path: string) => Promise<void> })
      .revalidate;
    if (typeof revalidate === 'function') {
      await revalidate('/collections/sale');
    }
  } catch {
    // ignore
  }
}

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const ok = await requireAuth(req, res);
  if (!ok) return;

  if (req.method === 'GET') {
    try {
      await ensureImageTagsColumn();
      const [products, images] = await Promise.all([
        getProducts({ orderBy: 'created_at', order: 'desc' }),
        getImages({ orderBy: 'uploaded_at', order: 'desc' }),
      ]);

      const items: SaleListItem[] = [
        ...products.map(productToItem),
        ...images.map(imageToItem),
      ];

      const onSale = items.filter((i) => i.onSale);
      const available = items.filter((i) => !i.onSale);

      return res.status(200).json({
        items,
        onSale,
        available,
        counts: {
          onSale: onSale.length,
          available: available.length,
          total: items.length,
          products: products.length,
          images: images.length,
        },
      });
    } catch (error: any) {
      console.error('[api/admin/sale GET]', error);
      return res.status(500).json({ error: error.message || 'Failed to load sale products' });
    }
  }

  if (req.method === 'PATCH' || req.method === 'POST') {
    try {
      await ensureImageTagsColumn();
      const body = req.body || {};

      /**
       * Full sync: { mode: 'sync', selected: [{ productId, source }] }
       * Checked products become On Sale; everything else loses the Sale tag.
       */
      if (body.mode === 'sync' && Array.isArray(body.selected)) {
        const [products, images] = await Promise.all([
          getProducts({ orderBy: 'created_at', order: 'desc' }),
          getImages({ orderBy: 'uploaded_at', order: 'desc' }),
        ]);
        const all: SaleListItem[] = [
          ...products.map(productToItem),
          ...images.map(imageToItem),
        ];

        const wantSale = new Set<string>();
        for (const row of body.selected) {
          const rawId = typeof row?.productId === 'string' ? row.productId : row?.id;
          if (!rawId) continue;
          const source =
            row.source === 'image' || row.source === 'product' ? row.source : 'product';
          wantSale.add(`${source}:${parseId(String(rawId)).id}`);
        }

        let added = 0;
        let removed = 0;
        const errors: string[] = [];

        for (const item of all) {
          const key = `${item.source}:${item.id}`;
          const should = wantSale.has(key);
          if (item.onSale === should) continue;
          try {
            const next = await setSaleStatus(item.id, item.source, should);
            if (!next) {
              errors.push(`${key}: not found`);
              continue;
            }
            if (should) added += 1;
            else removed += 1;
          } catch (e: any) {
            errors.push(`${key}: ${e?.message || 'failed'}`);
          }
        }

        await bustCaches(res);

        // Return fresh lists
        const [products2, images2] = await Promise.all([
          getProducts({ orderBy: 'created_at', order: 'desc' }),
          getImages({ orderBy: 'uploaded_at', order: 'desc' }),
        ]);
        const items: SaleListItem[] = [
          ...products2.map(productToItem),
          ...images2.map(imageToItem),
        ];
        const onSale = items.filter((i) => i.onSale);

        return res.status(200).json({
          ok: true,
          added,
          removed,
          onSale,
          items,
          counts: {
            onSale: onSale.length,
            available: items.length - onSale.length,
            total: items.length,
          },
          errors: errors.length ? errors : undefined,
        });
      }

      const onSale = body.onSale;
      if (typeof onSale !== 'boolean') {
        return res.status(400).json({ error: 'onSale boolean is required (or use mode: sync)' });
      }

      // Batch: { items: [{ productId, source }], onSale: true }
      const batch = Array.isArray(body.items) ? body.items : null;
      if (batch && batch.length > 0) {
        const updated: SaleListItem[] = [];
        const errors: string[] = [];
        for (const row of batch) {
          const rawId = typeof row?.productId === 'string' ? row.productId : row?.id;
          if (!rawId) {
            errors.push('missing id');
            continue;
          }
          const source =
            row.source === 'image' || row.source === 'product' ? row.source : undefined;
          try {
            const item = await setSaleStatus(rawId, source, onSale);
            if (item) updated.push(item);
            else errors.push(`${rawId}: not found`);
          } catch (e: any) {
            errors.push(`${rawId}: ${e?.message || 'failed'}`);
          }
        }
        await bustCaches(res);
        return res.status(200).json({
          items: updated,
          updated: updated.length,
          errors: errors.length ? errors : undefined,
          onSale,
        });
      }

      // Single
      let id = typeof body.productId === 'string' ? body.productId : body.id;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'productId is required' });
      }
      const source =
        body.source === 'image' || body.source === 'product' ? body.source : undefined;
      const item = await setSaleStatus(id, source, onSale);
      if (!item) {
        return res.status(404).json({ error: 'Product not found' });
      }
      await bustCaches(res);
      return res.status(200).json({ item, onSale: item.onSale });
    } catch (error: any) {
      console.error('[api/admin/sale PATCH]', error);
      return res.status(500).json({ error: error.message || 'Failed to update sale product' });
    }
  }

  res.setHeader('Allow', 'GET, PATCH, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
