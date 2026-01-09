import type { NextApiRequest, NextApiResponse } from 'next';

interface StkPushItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface StkPushRequestBody {
  phoneNumber: string;
  amount: number;
  items?: StkPushItem[];
}

const getMpesaBaseUrl = () => {
  if (process.env.MPESA_ENV === 'production') {
    return 'https://api.safaricom.co.ke';
  }

  return 'https://sandbox.safaricom.co.ke';
};

const normalizePhoneNumber = (phone: string): string | null => {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('254')) {
    return digits;
  }

  if (digits.length === 10 && digits.startsWith('07')) {
    return `254${digits.slice(1)}`;
  }

  if (digits.length === 9 && digits.startsWith('7')) {
    return `254${digits}`;
  }

  return null;
};

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { phoneNumber, amount, items } = request.body as StkPushRequestBody;

  if (!phoneNumber || !amount || amount <= 0) {
    return response.status(400).json({ success: false, message: 'Invalid phone number or amount.' });
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhone) {
    return response.status(400).json({
      success: false,
      message: 'Enter a valid Safaricom phone number (e.g. 07xx or 2547xx).',
    });
  }

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE ?? '4133452';
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
    // eslint-disable-next-line no-console
    console.error('Missing M-Pesa configuration environment variables.');
    return response.status(500).json({
      success: false,
      message: 'M-Pesa configuration is incomplete on the server.',
    });
  }

  try {
    const baseUrl = getMpesaBaseUrl();

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!tokenRes.ok) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch M-Pesa access token', await tokenRes.text());
      return response.status(502).json({
        success: false,
        message: 'Failed to reach M-Pesa gateway. Please try again.',
      });
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return response.status(502).json({
        success: false,
        message: 'M-Pesa gateway did not return a token.',
      });
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:Z.]/g, '')
      .slice(0, 14);

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const stkBody = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: 'TrendyFashionZone',
      TransactionDesc: 'Order payment',
    };

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkBody),
    });

    const stkData = (await stkRes.json()) as {
      ResponseCode?: string;
      errorMessage?: string;
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      CustomerMessage?: string;
    };

    if (!stkRes.ok || stkData.ResponseCode !== '0') {
      // eslint-disable-next-line no-console
      console.error('STK push error', stkData);
      return response.status(502).json({
        success: false,
        message: stkData.errorMessage || 'Failed to initiate M-Pesa STK push.',
      });
    }

    // Basic logging of order + MPesa identifiers for your records
    // eslint-disable-next-line no-console
    console.log('M-Pesa STK initiated', {
      amount,
      phone: normalizedPhone,
      items,
      merchantRequestId: stkData.MerchantRequestID,
      checkoutRequestId: stkData.CheckoutRequestID,
    });

    return response.status(200).json({
      success: true,
      message:
        stkData.CustomerMessage ||
        'M-Pesa STK push sent. Ask the customer to confirm on their phone to complete payment.',
      paymentStatus: 'PENDING',
      merchantRequestId: stkData.MerchantRequestID,
      checkoutRequestId: stkData.CheckoutRequestID,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unexpected M-Pesa error', error);
    return response.status(500).json({
      success: false,
      message: 'Unexpected error initiating M-Pesa payment.',
    });
  }
};

export default handler;


