import type { FeedProduct } from '@/lib/catalog/feedUtils';
import { formatMetaPrice } from '@/lib/catalog/feedUtils';

export type MetaCatalogPayload = {
  version: string;
  generated_at: string;
  item_count: number;
  data: Array<{
    id: string;
    title: string;
    description: string;
    availability: string;
    condition: string;
    price: string;
    link: string;
    image_link: string;
    brand: string;
    product_type: string;
  }>;
};

export function buildMetaCatalogJson(products: FeedProduct[]): MetaCatalogPayload {
  return {
    version: '1.0',
    generated_at: new Date().toISOString(),
    item_count: products.length,
    data: products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      availability: p.availability,
      condition: p.condition,
      price: formatMetaPrice(p.price, p.currency),
      link: p.link,
      image_link: p.imageLink,
      brand: p.brand,
      product_type: p.category,
    })),
  };
}

function csvEscape(value: string): string {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Meta Commerce Manager catalogue CSV (use URL upload → CSV).
 * Required columns per Meta product feed spec.
 */
export function buildMetaCatalogCsv(products: FeedProduct[]): string {
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'google_product_category',
    'product_type',
  ];

  const lines = [headers.join(',')];
  for (const p of products) {
    lines.push(
      [
        csvEscape(p.id),
        csvEscape(p.title),
        csvEscape(p.description),
        csvEscape(p.availability),
        csvEscape(p.condition),
        csvEscape(formatMetaPrice(p.price, p.currency)),
        csvEscape(p.link),
        csvEscape(p.imageLink),
        csvEscape(p.brand),
        csvEscape(p.googleProductCategory),
        csvEscape(p.category),
      ].join(','),
    );
  }

  // BOM helps Excel open UTF-8 correctly when you download, Meta ignores it fine
  return `\uFEFF${lines.join('\n')}\n`;
}
