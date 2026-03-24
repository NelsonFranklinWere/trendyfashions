import type { NextApiRequest, NextApiResponse } from 'next';

interface PesapalBillingAddress {
  email_address?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  line_1?: string;
  city?: string;
  country_code?: string;
}

interface SubmitOrderBody {
  amount: number;
  currency?: string;
  description?: string;
  customer: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
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
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Pesapal token request failed: ${text}`);
  }

  const tokenData = (await tokenRes.json()) as { token?: string };
  if (!tokenData.token) {
    throw new Error('Pesapal token missing in response');
  }

  return tokenData.token;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { amount, currency = 'KES', description, customer } = (req.body || {}) as SubmitOrderBody;

  if (!amount || amount <= 0 || !customer?.name || !customer?.phone) {
    return res.status(400).json({
      success: false,
      message: 'Amount, customer name and phone are required.',
    });
  }

  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
  const callbackUrl = process.env.PESAPAL_CALLBACK_URL;
  const notificationId = process.env.PESAPAL_NOTIFICATION_ID;

  if (!consumerKey || !consumerSecret || !callbackUrl || !notificationId) {
    return res.status(500).json({
      success: false,
      message: 'Pesapal configuration is incomplete on the server.',
    });
  }

  const baseUrl = getPesapalBaseUrl();

  try {
    const token = await requestPesapalToken(baseUrl, consumerKey, consumerSecret);
    const [firstName, ...rest] = customer.name.trim().split(' ');
    const lastName = rest.join(' ').trim();
    const orderTrackingId = `TFZ-${Date.now()}`;

    const billingAddress: PesapalBillingAddress = {
      email_address: customer.email || undefined,
      phone_number: customer.phone,
      first_name: firstName || customer.name,
      last_name: lastName || undefined,
      line_1: customer.address || undefined,
      city: customer.city || undefined,
      country_code: 'KE',
    };

    const submitRes = await fetch(`${baseUrl}/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: orderTrackingId,
        currency,
        amount: Math.round(amount),
        description: description || 'Trendy Fashion Zone order payment',
        callback_url: callbackUrl,
        notification_id: notificationId,
        billing_address: billingAddress,
      }),
    });

    const submitData = (await submitRes.json()) as {
      order_tracking_id?: string;
      merchant_reference?: string;
      redirect_url?: string;
      error?: { message?: string };
      message?: string;
    };

    if (!submitRes.ok || !submitData.redirect_url) {
      return res.status(502).json({
        success: false,
        message:
          submitData?.error?.message ||
          submitData?.message ||
          'Failed to create Pesapal payment request.',
      });
    }

    return res.status(200).json({
      success: true,
      redirectUrl: submitData.redirect_url,
      orderTrackingId: submitData.order_tracking_id,
      merchantReference: submitData.merchant_reference || orderTrackingId,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Unexpected Pesapal error.',
    });
  }
}

