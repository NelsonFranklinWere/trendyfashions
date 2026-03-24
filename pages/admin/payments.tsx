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

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-600 mt-1">Monitor successful, pending and failed payments.</p>

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

