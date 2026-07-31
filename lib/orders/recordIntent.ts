import type { CartItem } from '@/context/CartContext';
import type { RecordOrderPayload } from '@/lib/orders/types';
import { getOrderSessionId, getOrderSessionOrderId, setOrderSessionOrderId } from '@/lib/orders/session';

function toLineItems(items: CartItem[]) {
  return items.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
    category: i.category,
  }));
}

/** Fire-and-forget — never blocks checkout or cart UI. */
export function recordOrderIntent(
  partial: Omit<RecordOrderPayload, 'sessionId' | 'items'> & { items: CartItem[] },
): void {
  if (typeof window === 'undefined' || !partial.items?.length) return;

  const payload: RecordOrderPayload = {
    sessionId: getOrderSessionId(),
    orderId: partial.orderId || getOrderSessionOrderId() || undefined,
    items: toLineItems(partial.items),
    stage: partial.stage,
    subtotal: partial.subtotal,
    deliveryFee: partial.deliveryFee,
    total: partial.total,
    paymentMethod: partial.paymentMethod,
    customer: partial.customer,
  };

  void fetch('/api/orders/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) return;
      const data = (await res.json()) as { orderId?: string };
      if (data.orderId) setOrderSessionOrderId(data.orderId);
    })
    .catch(() => {
      // silent
    });
}
