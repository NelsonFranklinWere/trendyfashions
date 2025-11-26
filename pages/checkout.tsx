import { useState, FormEvent } from 'react';
import { NextSeo } from 'next-seo';
import useCart from '@/hooks/useCart';
import { formatPrice } from '@/data/products';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // M-Pesa payment is not ready yet
    setIsError(false);
    setStatusMessage('M-Pesa payment is coming soon. Please use the payment details below to complete your order.');
    return;

    // Original code commented out for when M-Pesa is ready
    /*
    if (!items.length || !subtotal) {
      setIsError(true);
      setStatusMessage('Your cart is empty.');
      return;
    }

    if (!phoneNumber.trim()) {
      setIsError(true);
      setStatusMessage('Enter the M-Pesa phone number to continue.');
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setStatusMessage(null);

      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          amount: subtotal,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message: string;
        paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
        checkoutRequestId?: string;
        merchantRequestId?: string;
      };

      if (!response.ok || !data.success) {
        setIsError(true);
        setStatusMessage(data.message || 'Failed to initiate M-Pesa payment.');
        return;
      }

      setIsError(false);
      setStatusMessage(
        data.message ||
          'STK push sent. Ask the customer to confirm on their phone. Status: NOT PAID YET.',
      );
      clearCart();
    } catch (error) {
      setIsError(true);
      setStatusMessage('Something went wrong while starting the payment. Please try again.');
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <>
      <NextSeo title="Checkout | Pay with M-Pesa" />
      <section className="bg-light/40 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8 lg:flex-row">
          <div className="w-full rounded-2xl border border-primary/10 bg-white p-6 shadow-soft lg:w-7/12">
            <h1 className="mb-2 text-2xl font-heading font-bold text-primary">Checkout</h1>
            <p className="mb-6 text-sm font-body text-text/70">
              Confirm your order and pay securely via{' '}
              <span className="font-semibold text-secondary">M-Pesa</span>.
            </p>

            {/* Payment Information */}
            <div className="mb-6 rounded-xl border-2 border-secondary/20 bg-secondary/5 p-4">
              <h3 className="mb-3 text-lg font-heading font-semibold text-primary">Payment Details</h3>
              <div className="space-y-2 text-sm font-body">
                <div className="flex items-center justify-between">
                  <span className="text-text/70">Paybill Number:</span>
                  <span className="font-semibold text-primary">542542</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text/70">Account Number:</span>
                  <span className="font-semibold text-primary">01207943936150</span>
                </div>
              </div>
              <p className="mt-3 text-xs font-body text-text/60">
                Use these details to pay via M-Pesa. After payment, contact us on WhatsApp to confirm your order.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  M-Pesa phone number (Safaricom)
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="e.g. 0712 345 678 or 254712345678"
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="mt-1 text-xs font-body text-text/60">
                  Ensure the phone is on and has M-Pesa active. You will receive a prompt to enter your PIN.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !items.length}
                className="flex w-full items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-heading font-semibold text-white shadow-medium transition hover:bg-secondary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-secondary/40"
              >
                {isLoading ? 'Processing…' : `Pay ${formatPrice(subtotal)} with M-Pesa`}
              </button>
              
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                <p className="text-sm font-body text-amber-800">
                  <span className="font-semibold">Note:</span> M-Pesa STK push is coming soon. Please use the payment details above to complete your order.
                </p>
              </div>

              {statusMessage && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm font-body ${
                    isError
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {statusMessage}
                </div>
              )}
            </form>
          </div>

          <aside className="w-full rounded-2xl border border-primary/10 bg-white p-6 shadow-soft lg:w-5/12">
            <h2 className="mb-4 text-lg font-heading font-semibold text-primary">Order summary</h2>
            {items.length === 0 ? (
              <p className="text-sm font-body text-text/70">Your cart is empty.</p>
            ) : (
              <>
                <ul className="mb-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between rounded-xl bg-light/40 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-heading text-primary">{item.name}</p>
                        <p className="text-xs font-body text-text/70">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="text-sm font-heading text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-primary/10 pt-3">
                  <span className="text-sm font-body text-text/70">Subtotal</span>
                  <span className="text-lg font-heading font-semibold text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;


