import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { updateOrderStatus, getPaymentByOrderId, updatePaymentByOrderId } from '@/lib/db/orders';
import { WHATSAPP_NUMBER } from '@/lib/cart-utils';

function getPesapalBaseUrl() {
  return process.env.PESAPAL_ENV === 'production'
    ? 'https://pay.pesapal.com/v3/api'
    : 'https://cybqa.pesapal.com/pesapalv3/api';
}

async function requestPesapalToken(baseUrl: string, consumerKey: string, consumerSecret: string) {
  const tokenRes = await fetch(`${baseUrl}/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consumer_key: consumerKey, consumer_secret: consumerSecret }),
  });
  if (!tokenRes.ok) throw new Error(`Token request failed: ${await tokenRes.text()}`);
  const tokenData = (await tokenRes.json()) as { token?: string };
  if (!tokenData.token) throw new Error('Missing Pesapal token');
  return tokenData.token;
}

function mapPesapalStatus(status?: string): 'success' | 'failed' | 'pending' {
  const normalized = (status || '').toUpperCase();
  if (['COMPLETED', 'SUCCESS', 'PAID'].includes(normalized)) return 'success';
  if (['FAILED', 'INVALID', 'CANCELLED'].includes(normalized)) return 'failed';
  return 'pending';
}

function createWhatsAppMessage(payment: any): string {
  const payload = payment?.raw_payload || {};
  const customer = payload.customer || {};
  const items = payload.items || [];
  const lines = items.map((item: any) => {
    const imageLink = item.image?.startsWith('http')
      ? item.image
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${item.image}`;
    return `• ${item.quantity}x ${item.name} - KES ${item.price * item.quantity}\n  📷 ${imageLink}`;
  });

  return encodeURIComponent(
    [
      'Hello Trendy Fashion Zone, payment completed.',
      `Customer: ${customer.name || ''}`,
      `Phone: ${customer.phone || ''}`,
      `Shoe Size: ${customer.shoeSize || 'Not specified'}`,
      `Delivery: ${customer.deliveryOption || ''}`,
      `Address: ${customer.address || ''}, ${customer.city || ''}`,
      '',
      'Order Items:',
      ...lines,
    ].join('\n')
  );
}

async function sendOrderEmail(payment: any) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const payload = payment?.raw_payload || {};
  const customer = payload.customer || {};
  const items = payload.items || [];
  const to = process.env.RESEND_TO_EMAIL || 'nelsonochieng516@gmail.com';
  const from = process.env.RESEND_FROM || 'Trendy Fashion Zone <onboarding@resend.dev>';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const itemText = items
    .map(
      (item: any) =>
        `${item.quantity}x ${item.name} - KES ${item.price * item.quantity}\nImage: ${
          item.image?.startsWith('http') ? item.image : `${baseUrl}${item.image}`
        }`
    )
    .join('\n\n');
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to,
    replyTo: customer.email || process.env.RESEND_REPLY_TO || to,
    subject: `Paid Order: ${customer.name || 'Customer'} (${payment.order_id})`,
    text: `Payment status: SUCCESS\n\nCustomer: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${
      customer.email || ''
    }\nShoe Size: ${customer.shoeSize || 'Not specified'}\nDelivery: ${
      customer.deliveryOption || ''
    }\nDelivery Fee: KES ${customer.deliveryFee || 0}\nAddress: ${customer.address || ''}, ${
      customer.city || ''
    }\n\nItems:\n${itemText}`,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const orderTrackingId = req.query.orderTrackingId as string | undefined;
  const orderId = req.query.orderId as string | undefined;
  if (!orderTrackingId || !orderId) {
    return res.status(400).json({ success: false, message: 'orderTrackingId and orderId are required' });
  }

  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
  if (!consumerKey || !consumerSecret) {
    return res.status(500).json({ success: false, message: 'Pesapal configuration is incomplete' });
  }

  try {
    const baseUrl = getPesapalBaseUrl();
    const token = await requestPesapalToken(baseUrl, consumerKey, consumerSecret);
    const statusRes = await fetch(
      `${baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const statusData = await statusRes.json();
    const mapped = mapPesapalStatus(statusData?.payment_status_description || statusData?.status);

    const existingPayment = await getPaymentByOrderId(orderId);
    await updatePaymentByOrderId(orderId, {
      status: mapped,
      transaction_reference: orderTrackingId,
      raw_payload: { ...(existingPayment?.raw_payload || {}), pesapalStatus: statusData },
    });
    await updateOrderStatus(orderId, mapped === 'success' ? 'paid' : mapped);

    if (mapped === 'success' && existingPayment?.status !== 'success') {
      await sendOrderEmail(existingPayment);
    }

    const whatsappUrl =
      mapped === 'success'
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${createWhatsAppMessage(existingPayment)}`
        : null;

    return res.status(200).json({ success: true, status: mapped, whatsappUrl });
  } catch (error: any) {
    await updatePaymentByOrderId(orderId, { status: 'pending' });
    return res.status(500).json({ success: false, message: error?.message || 'Failed to confirm payment' });
  }
}

