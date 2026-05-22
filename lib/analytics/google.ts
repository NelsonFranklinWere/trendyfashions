'use client';

import type { AnalyticsLineItem } from '@/lib/analytics/items';
import { lineItemsValue } from '@/lib/analytics/items';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtagShim(...a: unknown[]) {
      window.dataLayer?.push(a);
    };
  window.gtag(...args);
}

function toGaItems(items: AnalyticsLineItem[]) {
  return items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
    item_category: item.category,
  }));
}

export function trackPageView(path: string): void {
  gtag('event', 'page_view', { page_path: path });
}

export function trackViewItem(product: AnalyticsLineItem): void {
  gtag('event', 'view_item', {
    currency: 'KES',
    value: product.price * product.quantity,
    items: toGaItems([product]),
  });
}

export function trackAddToCart(items: AnalyticsLineItem[]): void {
  gtag('event', 'add_to_cart', {
    currency: 'KES',
    value: lineItemsValue(items),
    items: toGaItems(items),
  });
}

export function trackBeginCheckout(items: AnalyticsLineItem[]): void {
  gtag('event', 'begin_checkout', {
    currency: 'KES',
    value: lineItemsValue(items),
    items: toGaItems(items),
  });
}

export function trackPurchase(
  items: AnalyticsLineItem[],
  transactionId: string,
  value?: number,
  userData?: { email?: string; phone?: string },
): void {
  const purchaseValue = value ?? lineItemsValue(items);
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'KES',
    value: purchaseValue,
    items: toGaItems(items),
  });

  if (userData?.email || userData?.phone) {
    gtag('set', 'user_data', {
      email: userData.email,
      phone_number: userData.phone,
    });
  }
}
