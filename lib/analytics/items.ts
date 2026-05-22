import type { CartItem } from '@/context/CartContext';
import type { Product } from '@/data/products';

export type AnalyticsLineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

export function productToLineItem(product: Product, quantity = 1): AnalyticsLineItem {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity,
    category: product.category,
  };
}

export function cartToLineItems(items: CartItem[]): AnalyticsLineItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    category: item.category,
  }));
}

export function lineItemsValue(items: AnalyticsLineItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
