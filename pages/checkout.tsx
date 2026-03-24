import { useState, FormEvent } from 'react';
import { NextSeo } from 'next-seo';
import useCart from '@/hooks/useCart';
import { formatPrice } from '@/data/products';
import { WHATSAPP_NUMBER } from '@/lib/cart-utils';

interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  deliveryNotes: string;
  shoeSize: string;
  deliveryZone: 'cbd' | 'near_cbd' | 'outside_cbd';
}

type PaymentMethod = 'whatsapp' | 'pay';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    deliveryNotes: '',
    shoeSize: '',
    deliveryZone: 'cbd',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // Get base URL for product links
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://trendyfashionzone.co.ke';
  const deliveryFee =
    formData.deliveryZone === 'cbd' ? 0 : formData.deliveryZone === 'near_cbd' ? 300 : 500;
  const totalWithDelivery = subtotal + deliveryFee;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!items.length || !subtotal) {
      return;
    }
    setPaymentError(null);

    // Build WhatsApp message with order details including product image links
    const orderItems = items.map((item) => {
      const lineTotal = formatPrice(item.price * item.quantity);
      // Create full URL to product image
      let imageLink = item.image;
      if (!imageLink.startsWith('http')) {
        // Handle relative paths
        if (imageLink.startsWith('/')) {
          imageLink = `${baseUrl}${imageLink}`;
        } else {
          imageLink = `${baseUrl}/${imageLink}`;
        }
      }
      // Create link to category page if available
      const categoryLink = item.category 
        ? `${baseUrl}/collections/${item.category}` 
        : null;
      
      let itemLine = `• ${item.quantity}x ${item.name} - ${lineTotal}`;
      itemLine += `\n  📷 Image Link: ${imageLink}`;
      if (categoryLink) {
        itemLine += `\n  🔗 View Product: ${categoryLink}`;
      }
      return itemLine;
    }).join('\n\n');

    const message = [
      '🛍️ *NEW ORDER REQUEST*',
      '',
      '*Customer Details:*',
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email || 'Not provided'}`,
      '',
      '*Delivery Address:*',
      formData.address,
      formData.city ? `City: ${formData.city}` : '',
      `Shoe Size: ${formData.shoeSize || 'Not specified'}`,
      `Delivery Zone: ${
        formData.deliveryZone === 'cbd'
          ? 'Within CBD (Free)'
          : formData.deliveryZone === 'near_cbd'
            ? 'Near CBD (KES 300)'
            : 'Outside CBD (KES 500)'
      }`,
      `Delivery Fee: ${formatPrice(deliveryFee)}`,
      '',
      '*Order Items:*',
      orderItems,
      '',
      `*Subtotal: ${formatPrice(subtotal)}*`,
      `*Total: ${formatPrice(totalWithDelivery)}*`,
      '',
      formData.deliveryNotes ? `*Delivery Notes:*\n${formData.deliveryNotes}` : '',
      '',
      'Please confirm availability and proceed with order processing.',
    ]
      .filter(Boolean)
      .join('\n');

    if (paymentMethod === 'whatsapp') {
      const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
      clearCart();
      return;
    }

    setProcessingPayment(true);
    try {
      const res = await fetch('/api/pesapal/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalWithDelivery,
          currency: 'KES',
          description: `Order payment for ${items.length} item(s)`,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            shoeSize: formData.shoeSize,
            deliveryOption:
              formData.deliveryZone === 'cbd'
                ? 'Within CBD (Free)'
                : formData.deliveryZone === 'near_cbd'
                  ? 'Near CBD (KES 300)'
                  : 'Outside CBD (KES 500)',
            deliveryFee,
          },
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.redirectUrl) {
        throw new Error(data.message || 'Failed to initialize Pesapal payment.');
      }
      window.location.href = data.redirectUrl as string;
    } catch (error: any) {
      setPaymentError(error?.message || 'Unable to process Pesapal payment.');
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <>
      <NextSeo title="Checkout | Submit Order via WhatsApp" />
      <section className="bg-light/40 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8 lg:flex-row">
          <div className="w-full rounded-2xl border border-primary/10 bg-white p-6 shadow-soft lg:w-7/12">
            <h1 className="mb-2 text-2xl font-heading font-bold text-primary">Checkout</h1>
            <p className="mb-6 text-sm font-body text-text/70">
              Fill in your details and submit your order via{' '}
              <span className="font-semibold text-[#25D366]">WhatsApp</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="e.g. 0712 345 678 or 254712345678"
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  rows={3}
                  placeholder="Enter your complete delivery address"
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40 resize-none"
                  value={formData.address}
                  onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  City/Town
                </label>
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="e.g. Nairobi, Mombasa"
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                  value={formData.city}
                  onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                />
              </div>

              <div>
                <label
                  htmlFor="shoeSize"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  Shoe Size *
                </label>
                <input
                  id="shoeSize"
                  type="text"
                  placeholder="e.g. 42 / 9 UK"
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                  value={formData.shoeSize}
                  onChange={(event) => setFormData({ ...formData, shoeSize: event.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="deliveryZone"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  Delivery Zone *
                </label>
                <select
                  id="deliveryZone"
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                  value={formData.deliveryZone}
                  onChange={(event) =>
                    setFormData({ ...formData, deliveryZone: event.target.value as CheckoutFormData['deliveryZone'] })
                  }
                >
                  <option value="cbd">Within CBD (Free)</option>
                  <option value="near_cbd">Near CBD (KES 300)</option>
                  <option value="outside_cbd">Outside CBD (KES 500)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="deliveryNotes"
                  className="mb-1 block text-sm font-body font-medium text-text"
                >
                  Delivery Notes (Optional)
                </label>
                <textarea
                  id="deliveryNotes"
                  rows={2}
                  placeholder="Any special delivery instructions..."
                  className="block w-full rounded-xl border border-primary/20 bg-light/40 px-4 py-3 text-sm font-body text-text outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40 resize-none"
                  value={formData.deliveryNotes}
                  onChange={(event) => setFormData({ ...formData, deliveryNotes: event.target.value })}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-body font-medium text-text">Payment Method *</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pay')}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      paymentMethod === 'pay'
                        ? 'border-primary bg-primary text-white'
                        : 'border-primary/20 bg-white text-primary'
                    }`}
                  >
                    Pay Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      paymentMethod === 'whatsapp'
                        ? 'border-primary bg-primary text-white'
                        : 'border-primary/20 bg-white text-primary'
                    }`}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

              {paymentError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {paymentError}
                </p>
              )}

              <button
                type="submit"
                disabled={!items.length || processingPayment}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-heading font-semibold text-white shadow-medium transition hover:bg-[#20BA5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
                {processingPayment
                  ? 'Processing payment...'
                  : paymentMethod === 'pay'
                    ? 'Proceed to Pay'
                    : 'Submit Order via WhatsApp'}
              </button>
              
              <p className="text-xs font-body text-text/60 text-center">
                {paymentMethod === 'pay'
                  ? 'You will be redirected to secure checkout.'
                  : 'Clicking the button opens WhatsApp with your order details.'}
              </p>
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
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-body text-text/70">Delivery</span>
                  <span className="text-base font-heading text-primary">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-primary/10 pt-2">
                  <span className="text-sm font-body text-text/70">Total</span>
                  <span className="text-xl font-heading font-semibold text-primary">
                    {formatPrice(totalWithDelivery)}
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


