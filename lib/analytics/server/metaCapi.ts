import { analyticsConfig } from '@/lib/analytics/config';
import type { AnalyticsLineItem } from '@/lib/analytics/items';
import { hashEmail, hashPhone } from '@/lib/analytics/server/hash';

export type MetaCapiUserData = {
  email?: string;
  phone?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
};

export type MetaCapiEvent = {
  eventName: 'Purchase' | 'AddToCart' | 'InitiateCheckout' | 'ViewContent';
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData?: MetaCapiUserData;
  items?: AnalyticsLineItem[];
  value?: number;
  currency?: string;
  orderId?: string;
};

export async function sendMetaCapiEvent(event: MetaCapiEvent): Promise<boolean> {
  const pixelId = analyticsConfig.metaPixelId;
  const token = analyticsConfig.metaCapiToken;
  if (!pixelId || !token) return false;

  const userData: Record<string, string | string[]> = {};
  if (event.userData?.email) {
    const h = hashEmail(event.userData.email);
    if (h) userData.em = [h];
  }
  if (event.userData?.phone) {
    const h = hashPhone(event.userData.phone);
    if (h) userData.ph = [h];
  }
  if (event.userData?.clientIpAddress) userData.client_ip_address = event.userData.clientIpAddress;
  if (event.userData?.clientUserAgent) userData.client_user_agent = event.userData.clientUserAgent;
  if (event.userData?.fbc) userData.fbc = event.userData.fbc;
  if (event.userData?.fbp) userData.fbp = event.userData.fbp;

  const customData: Record<string, unknown> = {
    currency: event.currency || 'KES',
  };
  if (event.value != null) customData.value = event.value;
  if (event.orderId) customData.order_id = event.orderId;
  if (event.items?.length) {
    customData.content_ids = event.items.map((i) => i.id);
    customData.content_type = 'product';
    customData.contents = event.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      item_price: i.price,
    }));
  }

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime || Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl || analyticsConfig.siteUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: customData,
      },
    ],
    access_token: token,
  };

  if (analyticsConfig.metaTestEventCode) {
    body.test_event_code = analyticsConfig.metaTestEventCode;
  }

  const url = `https://graph.facebook.com/v21.0/${pixelId}/events`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[metaCapi]', res.status, text);
    return false;
  }
  return true;
}
