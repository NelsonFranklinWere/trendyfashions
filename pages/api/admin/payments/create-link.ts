import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { createOrder, createPayment, updatePaymentByOrderId } from '@/lib/db/orders';

interface CreateLinkBody {
  amount: number;
  currency?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shoeSize?: string;
  notes?: string;
}

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
  if (!tokenRes.ok) throw new Error(`Pesapal token request failed: ${await tokenRes.text()}`);
  const tokenData = (await tokenRes.json()) as { token?: string };
  if (!tokenData.token) throw new Error('Pesapal token missing in response');
  return tokenData.token;
}

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return;
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const body = (req.body || {}) as CreateLinkBody;
  if (!body.amount || body.amount <= 0 || !body.customerName || !body.customerPhone) {
    return res.status(400).json({ success: false, message: 'Amount, customer name and phone are required' });
  }

  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
  const callbackUrl = process.env.PESAPAL_CALLBACK_URL;
  const notificationId = process.env.PESAPAL_NOTIFICATION_ID;
  if (!consumerKey || !consumerSecret || !callbackUrl || !notificationId) {
    return res.status(500).json({ success: false, message: 'Pesapal configuration is incomplete on the server.' });
  }

  try {
    const order = await createOrder({
      customer_name: body.customerName,
      customer_email: body.customerEmail,
      customer_phone: body.customerPhone,
      shipping_address: 'In-shop physical purchase',
      notes: `Shoe size: ${body.shoeSize || 'Not specified'} | ${body.notes || ''}`.trim(),
      status: 'pending',
      total_amount: Math.round(body.amount),
      currency: body.currency || 'KES',
    });

    await createPayment({
      order_id: order.id,
      provider: 'pesapal',
      amount: Math.round(body.amount),
      currency: body.currency || 'KES',
      status: 'pending',
      raw_payload: {
        customer: {
          name: body.customerName,
          phone: body.customerPhone,
          email: body.customerEmail || '',
          shoeSize: body.shoeSize || '',
          deliveryOption: 'In-shop pickup',
          deliveryFee: 0,
        },
        items: [],
        stage: 'admin_link_created',
      },
    });

    const baseUrl = getPesapalBaseUrl();
    const token = await requestPesapalToken(baseUrl, consumerKey, consumerSecret);
    const [firstName, ...rest] = body.customerName.trim().split(' ');
    const lastName = rest.join(' ').trim();
    const callbackWithOrder = `${callbackUrl}${callbackUrl.includes('?') ? '&' : '?'}orderId=${encodeURIComponent(
      order.id
    )}`;

    const submitRes = await fetch(`${baseUrl}/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: order.id,
        currency: body.currency || 'KES',
        amount: Math.round(body.amount),
        description: 'In-shop payment link',
        callback_url: callbackWithOrder,
        notification_id: notificationId,
        billing_address: {
          phone_number: body.customerPhone,
          email_address: body.customerEmail || undefined,
          first_name: firstName || body.customerName,
          last_name: lastName || undefined,
          country_code: 'KE',
        },
      }),
    });

    const submitData = (await submitRes.json()) as {
      redirect_url?: string;
      order_tracking_id?: string;
      error?: { message?: string };
      message?: string;
    };

    if (!submitRes.ok || !submitData.redirect_url) {
      await updatePaymentByOrderId(order.id, {
        status: 'failed',
        raw_payload: { error: submitData, stage: 'admin_submit_failed' },
      });
      return res.status(502).json({
        success: false,
        message: submitData?.error?.message || submitData?.message || 'Failed to create payment link.',
      });
    }

    const promptMessage = `Hi ${body.customerName}, please complete your payment of KES ${Math.round(
      body.amount
    ).toLocaleString()} via this secure Pesapal link: ${submitData.redirect_url}`;

    return res.status(200).json({
      success: true,
      orderId: order.id,
      paymentLink: submitData.redirect_url,
      promptMessage,
      orderTrackingId: submitData.order_tracking_id,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to create payment link' });
  }
}

