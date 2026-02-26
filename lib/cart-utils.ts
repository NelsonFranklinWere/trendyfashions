import { CartItem } from '@/context/CartContext';
import { formatPrice } from '@/data/products';

const WHATSAPP_NUMBER = '254712417489';

export const buildWhatsAppOrderMessage = (items: CartItem[], subtotal: number): string => {
  if (!items.length) {
    return `Hello Trendy Fashion Zone,%0A%0AI'd like to know more about your footwear collection.`;
  }

  const lines = items.map((item) => {
    const lineTotal = formatPrice(item.price * item.quantity);
    return `- ${item.quantity} x ${item.name} (${lineTotal})`;
  });

  const body = [
    'Hello Trendy Fashion Zone,',
    '',
    "I'd like to order the following items:",
    ...lines,
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    '',
    'Please confirm availability and delivery options. Thank you!',
  ].join('\n');

  return encodeURIComponent(body);
};

export const createWhatsAppCheckoutLink = (items: CartItem[], subtotal: number): string => {
  const message = buildWhatsAppOrderMessage(items, subtotal);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

export const getCartAnalyticsPayload = (items: CartItem[], subtotal: number) => ({
  itemCount: items.reduce((total, item) => total + item.quantity, 0),
  subtotal,
  currency: 'KES',
  items: items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
});

export { WHATSAPP_NUMBER };


