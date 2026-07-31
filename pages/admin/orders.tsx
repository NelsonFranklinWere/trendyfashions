import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import type { AdminOrderRow } from '@/lib/db/orders';
import type { OrderLineItem } from '@/lib/orders/types';
import { resolveOrderDisplayStatus, statusToneClasses } from '@/lib/orders/displayStatus';

function formatMoney(amount: number, currency = 'KES') {
  return `${currency} ${Number(amount).toLocaleString()}`;
}

function itemCount(items: OrderLineItem[] | null | undefined) {
  return (items || []).reduce((n, i) => n + (i.quantity || 1), 0);
}

export default function AdminOrdersPage() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'paid' | 'failed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load orders');
        setOrders(data.orders || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load orders');
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, [user]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const { label } = resolveOrderDisplayStatus(o);
      if (filter === 'all') return true;
      if (filter === 'paid') return label === 'Paid';
      if (filter === 'failed') return label === 'Payment failed';
      if (filter === 'active') return ['In cart', 'Checkout started', 'Payment pending', 'WhatsApp order'].includes(label);
      return true;
    });
  }, [orders, filter]);

  const stats = useMemo(() => {
    let paid = 0;
    let failed = 0;
    let active = 0;
    for (const o of orders) {
      const { label } = resolveOrderDisplayStatus(o);
      if (label === 'Paid') paid += 1;
      else if (label === 'Payment failed') failed += 1;
      else if (['In cart', 'Checkout started', 'Payment pending', 'WhatsApp order'].includes(label)) active += 1;
    }
    return { total: orders.length, paid, failed, active };
  }, [orders]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Customer Orders</h1>
        <p className="text-slate-600 mt-1">
          Cart activity, checkout attempts, WhatsApp orders, and payment outcomes.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total recorded', value: stats.total },
            { label: 'Active / trying', value: stats.active },
            { label: 'Paid', value: stats.paid },
            { label: 'Failed', value: stats.failed },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(['all', 'active', 'paid', 'failed'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                filter === f ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 space-y-3">
          {loadingOrders ? (
            <p className="text-slate-600">Loading orders...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-600">No orders match this filter yet.</p>
          ) : (
            filtered.map((order) => {
              const status = resolveOrderDisplayStatus(order);
              const items = order.line_items || [];
              const open = expandedId === order.id;

              return (
                <div key={order.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedId(open ? null : order.id)}
                    className="w-full text-left px-4 py-4 sm:px-5 flex flex-wrap items-start justify-between gap-3 hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusToneClasses[status.tone]}`}>
                          {status.label}
                        </span>
                        {order.payment_method && (
                          <span className="text-xs text-slate-500 uppercase">{order.payment_method}</span>
                        )}
                      </div>
                      <p className="mt-2 font-semibold text-slate-900">
                        {order.customer_name || 'Guest shopper'}
                      </p>
                      <p className="text-sm text-slate-600">
                        {order.customer_phone || 'No phone'}
                        {order.customer_email ? ` · ${order.customer_email}` : ''}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(order.created_at).toLocaleString()} · {itemCount(items)} item(s) ·{' '}
                        {formatMoney(order.total_amount, order.currency)}
                      </p>
                    </div>
                    <span className="text-slate-400 text-sm">{open ? '▲' : '▼'}</span>
                  </button>

                  {open && (
                    <div className="border-t border-slate-100 px-4 py-4 sm:px-5 bg-slate-50/50 text-sm space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">Delivery</h3>
                          <ul className="mt-2 space-y-1 text-slate-600">
                            <li>Address: {order.shipping_address || '—'}</li>
                            <li>City: {order.city || '—'}</li>
                            <li>Zone: {order.delivery_zone || '—'}</li>
                            <li>Shoe size: {order.shoe_size || '—'}</li>
                            <li>Delivery fee: {order.delivery_fee != null ? formatMoney(order.delivery_fee) : '—'}</li>
                            <li>Notes: {order.delivery_notes || order.notes || '—'}</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Payment</h3>
                          <ul className="mt-2 space-y-1 text-slate-600">
                            <li>Provider: {order.payment_provider || '—'}</li>
                            <li>Payment status: {order.payment_status || '—'}</li>
                            <li>Reference: {order.transaction_reference || '—'}</li>
                            <li>Order ID: <span className="font-mono text-xs">{order.id}</span></li>
                            <li>Session: {order.session_id || '—'}</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">Items</h3>
                        {items.length === 0 ? (
                          <p className="mt-2 text-slate-500">No line items stored.</p>
                        ) : (
                          <ul className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                            {items.map((item) => (
                              <li key={`${order.id}-${item.id}`} className="flex gap-3 p-3">
                                {item.image && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="h-14 w-14 rounded object-cover bg-slate-100 shrink-0"
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-slate-900 truncate">{item.name}</p>
                                  <p className="text-slate-600">
                                    {item.quantity} × {formatMoney(item.price)} ={' '}
                                    {formatMoney(item.price * item.quantity)}
                                  </p>
                                  {item.category && (
                                    <p className="text-xs text-slate-500">Category: {item.category}</p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
