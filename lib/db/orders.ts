import { query } from './postgres';

export interface OrderRecord {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  notes: string | null;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  transaction_reference: string | null;
  raw_payload: any;
  created_at: string;
}

export async function createOrder(data: {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  shipping_address: string;
  notes?: string;
  status?: string;
  total_amount: number;
  currency?: string;
}): Promise<OrderRecord> {
  const result = await query<OrderRecord>(
    `INSERT INTO orders
      (customer_name, customer_email, customer_phone, shipping_address, notes, status, total_amount, currency)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.customer_name,
      data.customer_email || null,
      data.customer_phone,
      data.shipping_address,
      data.notes || null,
      data.status || 'pending',
      data.total_amount,
      data.currency || 'KES',
    ]
  );
  return result.rows[0];
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, id]);
}

export async function createPayment(data: {
  order_id: string;
  provider: string;
  amount: number;
  currency?: string;
  status?: string;
  transaction_reference?: string | null;
  raw_payload?: any;
}): Promise<PaymentRecord> {
  const result = await query<PaymentRecord>(
    `INSERT INTO payments
      (order_id, provider, amount, currency, status, transaction_reference, raw_payload)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.order_id,
      data.provider,
      data.amount,
      data.currency || 'KES',
      data.status || 'pending',
      data.transaction_reference || null,
      data.raw_payload || {},
    ]
  );
  return result.rows[0];
}

export async function getPaymentByOrderId(orderId: string): Promise<PaymentRecord | null> {
  const result = await query<PaymentRecord>(
    'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
    [orderId]
  );
  return result.rows[0] || null;
}

export async function updatePaymentByOrderId(
  orderId: string,
  data: { status?: string; transaction_reference?: string; raw_payload?: any }
): Promise<PaymentRecord | null> {
  const existing = await getPaymentByOrderId(orderId);
  if (!existing) return null;
  const result = await query<PaymentRecord>(
    `UPDATE payments
     SET status = COALESCE($1, status),
         transaction_reference = COALESCE($2, transaction_reference),
         raw_payload = COALESCE($3, raw_payload)
     WHERE id = $4
     RETURNING *`,
    [data.status || null, data.transaction_reference || null, data.raw_payload || null, existing.id]
  );
  return result.rows[0] || null;
}

export async function getPaymentsWithOrders(): Promise<Array<PaymentRecord & { order: OrderRecord }>> {
  const result = await query<any>(
    `SELECT
      p.*,
      o.id as o_id, o.customer_name as o_customer_name, o.customer_email as o_customer_email,
      o.customer_phone as o_customer_phone, o.shipping_address as o_shipping_address,
      o.notes as o_notes, o.status as o_status, o.total_amount as o_total_amount,
      o.currency as o_currency, o.created_at as o_created_at, o.updated_at as o_updated_at
    FROM payments p
    JOIN orders o ON o.id = p.order_id
    ORDER BY p.created_at DESC`
  );

  return result.rows.map((row) => ({
    id: row.id,
    order_id: row.order_id,
    provider: row.provider,
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status,
    transaction_reference: row.transaction_reference,
    raw_payload: row.raw_payload,
    created_at: row.created_at,
    order: {
      id: row.o_id,
      customer_name: row.o_customer_name,
      customer_email: row.o_customer_email,
      customer_phone: row.o_customer_phone,
      shipping_address: row.o_shipping_address,
      notes: row.o_notes,
      status: row.o_status,
      total_amount: Number(row.o_total_amount),
      currency: row.o_currency,
      created_at: row.o_created_at,
      updated_at: row.o_updated_at,
    },
  }));
}

