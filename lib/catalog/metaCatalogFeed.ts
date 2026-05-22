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
