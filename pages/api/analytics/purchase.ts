import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import type { AnalyticsLineItem } from '@/lib/analytics/items';
import { lineItemsValue } from '@/lib/analytics/items';
import { sendMetaCapiEvent } from '@/lib/analytics/server/metaCapi';
import { analyticsConfig } from '@/lib/analytics/config';

type PurchaseBody = {
  orderId: string;
  items: AnalyticsLineItem[];
  value?: number;
  email?: string;
  phone?: string;
  eventId?: string;
  fbc?: string;
  fbp?: string;
};

/**
 * Server-side Meta Conversions API — Purchase (dedupe with browser via eventId).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as PurchaseBody;
  if (!body?.orderId || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: 'orderId and items are required' });
  }

  const eventId = body.eventId || `purchase_${body.orderId}_${randomUUID()}`;
  const value = body.value ?? lineItemsValue(body.items);

  let capiSent = false;
  if (analyticsConfig.metaCapiEnabled) {
    capiSent = await sendMetaCapiEvent({
      eventName: 'Purchase',
      eventId,
      orderId: body.orderId,
      items: body.items,
      value,
      currency: 'KES',
      eventSourceUrl: `${analyticsConfig.siteUrl}/checkout/complete`,
      userData: {
        email: body.email,
        phone: body.phone,
        clientIpAddress:
          (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
          req.socket.remoteAddress,
        clientUserAgent: req.headers['user-agent'],
        fbc: body.fbc,
        fbp: body.fbp,
      },
    });
  }

  return res.status(200).json({ ok: true, eventId, capiSent });
}
