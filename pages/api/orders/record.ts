import type { NextApiRequest, NextApiResponse } from 'next';
import { upsertOrderIntent } from '@/lib/db/orders';
import type { OrderLineItem, OrderStage } from '@/lib/orders/types';

const MAX_ITEMS = 50;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const sessionId = String(body.sessionId || '').trim();
    const stage = String(body.stage || 'cart') as OrderStage;
    const items = (Array.isArray(body.items) ? body.items : []) as OrderLineItem[];

    if (!sessionId || items.length === 0) {
      return res.status(400).json({ error: 'sessionId and items are required' });
    }
    if (items.length > MAX_ITEMS) {
      return res.status(400).json({ error: 'Too many items' });
    }

    const sanitizedItems = items
      .filter((i) => i?.id && i?.name && i?.price != null)
      .map((i) => ({
        id: String(i.id),
        name: String(i.name).slice(0, 255),
        price: Number(i.price),
        quantity: Math.min(Math.max(Number(i.quantity) || 1, 1), 99),
        image: i.image ? String(i.image) : undefined,
        category: i.category ? String(i.category) : undefined,
      }));

    if (!sanitizedItems.length) {
      return res.status(400).json({ error: 'No valid items' });
    }

    const subtotal = Number(body.subtotal) || sanitizedItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await upsertOrderIntent({
      sessionId,
      orderId: body.orderId ? String(body.orderId) : undefined,
      stage,
      items: sanitizedItems,
      subtotal,
      deliveryFee: body.deliveryFee != null ? Number(body.deliveryFee) : undefined,
      total: body.total != null ? Number(body.total) : undefined,
      paymentMethod: body.paymentMethod,
      customer: body.customer,
    });

    return res.status(200).json({ ok: true, orderId: order.id, status: order.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to record order';
    console.error('[orders/record]', error);
    return res.status(500).json({ error: message });
  }
}
