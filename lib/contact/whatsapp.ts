/** Single source of truth for WhatsApp (0790314739 → international). */
export const WHATSAPP_NUMBER_LOCAL = '0790314739';
export const WHATSAPP_NUMBER = '254790314739';
export const WHATSAPP_NUMBER_DISPLAY = '+254 790 314 739';

export function getWhatsAppUrl(message?: string): string {
  if (!message) return `https://wa.me/${WHATSAPP_NUMBER}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getProductWhatsAppLink(productName: string, price?: number): string {
  const priceBit = price != null ? ` (KES ${price.toLocaleString('en-KE')})` : '';
  const message = `Hi Trendy Fashion Zone, I'm interested in ${productName}${priceBit}. Please share availability.`;
  return getWhatsAppUrl(message);
}
