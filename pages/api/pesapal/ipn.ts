import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Pesapal IPN callback endpoint.
  // We acknowledge receipt and keep it lightweight to avoid callback failures.
  const payload = {
    method: req.method,
    query: req.query,
    body: req.body,
    receivedAt: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.log('[Pesapal IPN] Received notification:', payload);

  return res.status(200).json({ success: true, message: 'IPN received' });
}

