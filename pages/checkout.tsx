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
}

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    deliveryNotes: '',
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    
    if (!items.length || !subtotal) {
      return;
    }

    // Build WhatsApp message with order details
    const orderItems = items.map((item) => {
      const lineTotal = formatPrice(item.price * item.quantity);
      return `• ${item.quantity}x ${item.name} - ${lineTotal}`;
    }).join('\n');

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
      '',
      '*Order Items:*',
      orderItems,
      '',
      `*Total: ${formatPrice(subtotal)}*`,
      '',
      formData.deliveryNotes ? `*Delivery Notes:*\n${formData.deliveryNotes}` : '',
      '',
      'Please confirm availability and proceed with order processing.',
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank');
    
    // Clear cart after opening WhatsApp
    clearCart();
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

              <button
                type="submit"
                disabled={!items.length}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-heading font-semibold text-white shadow-medium transition hover:bg-[#20BA5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
                Submit Order via WhatsApp
              </button>
              
              <p className="text-xs font-body text-text/60 text-center">
                Clicking the button will open WhatsApp with your order details. Please complete the conversation to finalize your order.
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
              </>
            )}
          </aside>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;


