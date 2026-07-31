import type { AdminOrderRow } from '@/lib/db/orders';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export function resolveOrderDisplayStatus(order: AdminOrderRow): {
  label: string;
  tone: StatusTone;
} {
  const payment = order.payment_status;
  const orderStatus = order.status;

  if (orderStatus === 'paid' || payment === 'success') {
    return { label: 'Paid', tone: 'success' };
  }
  if (orderStatus === 'failed' || payment === 'failed') {
    return { label: 'Payment failed', tone: 'danger' };
  }
  if (orderStatus === 'payment_pending' || payment === 'pending') {
    return { label: 'Payment pending', tone: 'warning' };
  }
  if (orderStatus === 'whatsapp') {
    return { label: 'WhatsApp order', tone: 'info' };
  }
  if (orderStatus === 'checkout') {
    return { label: 'Checkout started', tone: 'info' };
  }
  if (orderStatus === 'cart') {
    return { label: 'In cart', tone: 'neutral' };
  }
  if (orderStatus === 'cancelled') {
    return { label: 'Cancelled', tone: 'danger' };
  }
  return { label: orderStatus || 'Unknown', tone: 'neutral' };
}

export const statusToneClasses: Record<StatusTone, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-slate-100 text-slate-700',
};
