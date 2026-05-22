'use client';

import type { AnalyticsLineItem } from '@/lib/analytics/items';
import { lineItemsValue } from '@/lib/analytics/items';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function fbq(...args: unknown[]): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq(...args);
}

function toMetaContents(items: AnalyticsLineItem[]) {
  return items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    item_price: item.price,
  }));
}

export function trackMetaPageView(): void {
  fbq('track', 'PageView');
}

export function trackMetaViewContent(product: AnalyticsLineItem): void {
  fbq('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'KES',
  });
}

export function trackMetaAddToCart(items: AnalyticsLineItem[]): void {
  fbq('track', 'AddToCart', {
    content_ids: items.map((i) => i.id),
    content_type: 'product',
    value: lineItemsValue(items),
    currency: 'KES',
    contents: toMetaContents(items),
  });
}

export function trackMetaInitiateCheckout(items: AnalyticsLineItem[]): void {
  fbq('track', 'InitiateCheckout', {
    content_ids: items.map((i) => i.id),
    content_type: 'product',
    value: lineItemsValue(items),
    currency: 'KES',
    contents: toMetaContents(items),
  });
}

export function trackMetaPurchase(
  items: AnalyticsLineItem[],
  orderId: string,
  value?: number,
  eventId?: string,
): void {
  const payload: Record<string, unknown> = {
    content_ids: items.map((i) => i.id),
    content_type: 'product',
    value: value ?? lineItemsValue(items),
    currency: 'KES',
    contents: toMetaContents(items),
    order_id: orderId,
  };
  if (eventId) {
    fbq('track', 'Purchase', payload, { eventID: eventId });
  } else {
    fbq('track', 'Purchase', payload);
  }
}
