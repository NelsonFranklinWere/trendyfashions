import type { NextApiRequest, NextApiResponse } from 'next';

interface MpesaCallback {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: {
        Item?: Array<{
          Name?: string;
          Value?: string | number;
        }>;
      };
    };
  };
}

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).end();
  }

  const payload = request.body as MpesaCallback;
  const callback = payload.Body?.stkCallback;

  if (!callback) {
    // eslint-disable-next-line no-console
    console.error('Invalid M-Pesa callback payload', payload);
    return response.status(400).end();
  }

  const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } =
    callback;

  let amount: number | undefined;
  let receiptNumber: string | undefined;
  let phoneNumber: string | undefined;
  let customerName: string | undefined;

  CallbackMetadata?.Item?.forEach((item) => {
    if (!item.Name) return;
    if (item.Name === 'Amount' && typeof item.Value === 'number') {
      amount = item.Value;
    }
    if (item.Name === 'MpesaReceiptNumber' && typeof item.Value === 'string') {
      receiptNumber = item.Value;
    }
    if (item.Name === 'PhoneNumber' && typeof item.Value === 'number') {
      phoneNumber = String(item.Value);
    }
    if (item.Name === 'Name' && typeof item.Value === 'string') {
      customerName = item.Value;
    }
  });

  const paid = ResultCode === 0;

  // Basic server-side log so you can see payment status, reference code and name
  // in your server console or logs.
  // eslint-disable-next-line no-console
  console.log('M-Pesa payment callback', {
    paid,
    resultCode: ResultCode,
    resultDescription: ResultDesc,
    merchantRequestId: MerchantRequestID,
    checkoutRequestId: CheckoutRequestID,
    amount,
    receiptNumber,
    phoneNumber,
    customerName,
  });

  return response.status(200).json({
    success: true,
  });
};

export default handler;


