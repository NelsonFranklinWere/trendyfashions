import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CheckoutCompletePage() {
  const router = useRouter();
  const [message, setMessage] = useState('Confirming payment...');

  useEffect(() => {
    if (!router.isReady) return;
    const orderTrackingId =
      (router.query.OrderTrackingId as string) ||
      (router.query.orderTrackingId as string) ||
      (router.query.OrderTrackingID as string);
    const orderId = (router.query.orderId as string) || (router.query.merchant_reference as string);

    if (!orderTrackingId || !orderId) {
      setMessage('Missing payment reference. Please contact support.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/pesapal/confirm?orderTrackingId=${encodeURIComponent(orderTrackingId)}&orderId=${encodeURIComponent(
            orderId
          )}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Payment confirmation failed');
        if (data.status === 'success' && data.whatsappUrl) {
          setMessage('Payment successful. Redirecting to WhatsApp...');
          window.location.href = data.whatsappUrl;
          return;
        }
        if (data.status === 'failed') {
          setMessage('Payment failed or cancelled. Please try again.');
          return;
        }
        setMessage('Payment is pending. We will update you shortly.');
      } catch (error: any) {
        setMessage(error?.message || 'Unable to verify payment.');
      }
    })();
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Payment Status</h1>
        <p className="mt-3 text-slate-600">{message}</p>
      </div>
    </div>
  );
}

