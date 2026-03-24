import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface PaymentRow {
  id: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  transaction_reference: string | null;
  created_at: string;
  order: {
    id: string;
    customer_name: string | null;
    customer_phone: string | null;
    shipping_address: string | null;
    notes: string | null;
  };
}

export default function AdminPaymentsPage() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [creatingLink, setCreatingLink] = useState(false);
  const [linkResult, setLinkResult] = useState<{ paymentLink: string; promptMessage: string } | null>(null);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    amount: '',
    shoeSize: '',
    notes: '',
  });

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch('/api/admin/payments');
        const data = await res.json();
        if (res.ok) setPayments(data.payments || []);
      } finally {
        setLoadingPayments(false);
      }
    })();
  }, [user]);

  if (loading || !user) return null;

  const createPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingLink(true);
    setLinkResult(null);
    try {
      const res = await fetch('/api/admin/payments/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail || undefined,
          amount: Number(form.amount),
          shoeSize: form.shoeSize || undefined,
          notes: form.notes || undefined,
          currency: 'KES',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create payment link');
      setLinkResult({ paymentLink: data.paymentLink, promptMessage: data.promptMessage });
      setForm((f) => ({ ...f, amount: '', notes: '' }));
    } catch (error: any) {
      alert(error?.message || 'Failed to create payment link');
    } finally {
      setCreatingLink(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-600 mt-1">Monitor successful, pending and failed payments.</p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Create In-Shop Pesapal Payment Link</h2>
          <p className="mt-1 text-sm text-slate-600">
            Generate a secure payment link for physical-store customers, then send prompt message instantly.
          </p>
          <form onSubmit={createPaymentLink} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              placeholder="Customer name"
              className="rounded-lg border border-slate-300 px-3 py-2"
              required
            />
            <input
              value={form.customerPhone}
              onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
              placeholder="Customer phone (07... / 254...)"
              className="rounded-lg border border-slate-300 px-3 py-2"
              required
            />
            <input
              value={form.customerEmail}
              onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
              placeholder="Customer email (optional)"
              className="rounded-lg border border-slate-300 px-3 py-2"
              type="email"
            />
            <input
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="Amount (KES)"
              className="rounded-lg border border-slate-300 px-3 py-2"
              type="number"
              min="1"
              required
            />
            <input
              value={form.shoeSize}
              onChange={(e) => setForm((f) => ({ ...f, shoeSize: e.target.value }))}
              placeholder="Shoe size (optional)"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creatingLink}
                className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {creatingLink ? 'Creating link...' : 'Create Payment Link'}
              </button>
            </div>
          </form>

          {linkResult && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <p className="font-semibold text-emerald-800">Payment link created</p>
              <p className="mt-2 break-all text-emerald-700">{linkResult.paymentLink}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(linkResult.paymentLink)}
                  className="rounded-md bg-white px-3 py-1.5 text-emerald-700 border border-emerald-300"
                >
                  Copy Link
                </button>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(linkResult.promptMessage)}
                  className="rounded-md bg-white px-3 py-1.5 text-emerald-700 border border-emerald-300"
                >
                  Copy Prompt
                </button>
                <a
                  href={linkResult.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-white"
                >
                  Open Link
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Provider</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {loadingPayments ? (
                <tr><td className="px-4 py-4" colSpan={7}>Loading payments...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td className="px-4 py-4" colSpan={7}>No payments yet.</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.order.customer_name || 'N/A'}</div>
                      <div className="text-slate-500">{p.order.customer_phone || ''}</div>
                    </td>
                    <td className="px-4 py-3 uppercase">{p.provider}</td>
                    <td className="px-4 py-3">{p.currency} {Number(p.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-1 text-xs bg-slate-100">{p.status}</span>
                    </td>
                    <td className="px-4 py-3">{p.transaction_reference || '-'}</td>
                    <td className="px-4 py-3">{p.order.notes || p.order.shipping_address || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

