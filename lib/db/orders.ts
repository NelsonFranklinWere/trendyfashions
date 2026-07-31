import { query } from './postgres';
import type { OrderLineItem, OrderStage } from '@/lib/orders/types';

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
  line_items?: OrderLineItem[] | null;
  payment_method?: string | null;
  source?: string | null;
  session_id?: string | null;
  delivery_fee?: number | null;
  delivery_zone?: string | null;
  shoe_size?: string | null;
  city?: string | null;
  delivery_notes?: string | null;
}

export interface AdminOrderRow extends OrderRecord {
  payment_id: string | null;
  payment_provider: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  transaction_reference: string | null;
  payment_payload: Record<string, unknown> | null;
  payment_created_at: string | null;
}

let orderSchemaReady = false;

async function ensureOrderTrackingColumns(): Promise<void> {
  if (orderSchemaReady) return;
  await query(`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'web';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS session_id VARCHAR(100);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone VARCHAR(50);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS shoe_size VARCHAR(20);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS city VARCHAR(100);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;
  `);
  orderSchemaReady = true;
}

function mapOrderRow(row: Record<string, unknown>): OrderRecord {
  return {
    id: String(row.id),
    customer_name: (row.customer_name as string) ?? null,
    customer_email: (row.customer_email as string) ?? null,
    customer_phone: (row.customer_phone as string) ?? null,
    shipping_address: (row.shipping_address as string) ?? null,
    notes: (row.notes as string) ?? null,
    status: String(row.status || 'pending'),
    total_amount: Number(row.total_amount) || 0,
    currency: String(row.currency || 'KES'),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    line_items: (row.line_items as OrderLineItem[]) || [],
    payment_method: (row.payment_method as string) ?? null,
    source: (row.source as string) ?? null,
    session_id: (row.session_id as string) ?? null,
    delivery_fee: row.delivery_fee != null ? Number(row.delivery_fee) : null,
    delivery_zone: (row.delivery_zone as string) ?? null,
    shoe_size: (row.shoe_size as string) ?? null,
    city: (row.city as string) ?? null,
    delivery_notes: (row.delivery_notes as string) ?? null,
  };
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
  line_items?: OrderLineItem[];
  payment_method?: string;
  source?: string;
  session_id?: string;
  delivery_fee?: number;
  delivery_zone?: string;
  shoe_size?: string;
  city?: string;
  delivery_notes?: string;
}): Promise<OrderRecord> {
  await ensureOrderTrackingColumns();
  const result = await query(
    `INSERT INTO orders
      (customer_name, customer_email, customer_phone, shipping_address, notes, status, total_amount, currency,
       line_items, payment_method, source, session_id, delivery_fee, delivery_zone, shoe_size, city, delivery_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13, $14, $15, $16, $17)
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
      JSON.stringify(data.line_items || []),
      data.payment_method || null,
      data.source || 'web',
      data.session_id || null,
      data.delivery_fee ?? 0,
      data.delivery_zone || null,
      data.shoe_size || null,
      data.city || null,
      data.delivery_notes || null,
    ]
  );
  return mapOrderRow(result.rows[0]);
}

export async function upsertOrderIntent(data: {
  sessionId: string;
  orderId?: string;
  stage: OrderStage;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee?: number;
  total?: number;
  paymentMethod?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    shoeSize?: string;
    deliveryZone?: string;
    deliveryNotes?: string;
  };
}): Promise<OrderRecord> {
  await ensureOrderTrackingColumns();

  const total = data.total ?? data.subtotal + (data.deliveryFee || 0);
  const customerName = data.customer?.name?.trim() || 'Guest shopper';
  const customerPhone = data.customer?.phone?.trim() || null;
  const shippingAddress = data.customer?.address?.trim() || null;
  const notesParts = [
    data.customer?.deliveryZone ? `Zone: ${data.customer.deliveryZone}` : '',
    data.customer?.shoeSize ? `Size: ${data.customer.shoeSize}` : '',
  ].filter(Boolean);

  if (data.orderId) {
    const existing = await query('SELECT id FROM orders WHERE id = $1', [data.orderId]);
    if (existing.rows[0]) {
      const updated = await query(
        `UPDATE orders SET
          status = $1,
          total_amount = $2,
          line_items = $3::jsonb,
          payment_method = COALESCE($4, payment_method),
          session_id = COALESCE($5, session_id),
          delivery_fee = COALESCE($6, delivery_fee),
          delivery_zone = COALESCE($7, delivery_zone),
          shoe_size = COALESCE($8, shoe_size),
          city = COALESCE($9, city),
          delivery_notes = COALESCE($10, delivery_notes),
          customer_name = COALESCE($11, customer_name),
          customer_email = COALESCE($12, customer_email),
          customer_phone = COALESCE($13, customer_phone),
          shipping_address = COALESCE($14, shipping_address),
          notes = COALESCE($15, notes),
          updated_at = NOW()
        WHERE id = $16
        RETURNING *`,
        [
          data.stage,
          total,
          JSON.stringify(data.items),
          data.paymentMethod || null,
          data.sessionId,
          data.deliveryFee ?? null,
          data.customer?.deliveryZone || null,
          data.customer?.shoeSize || null,
          data.customer?.city || null,
          data.customer?.deliveryNotes || null,
          data.customer?.name || null,
          data.customer?.email || null,
          customerPhone,
          shippingAddress,
          notesParts.length ? notesParts.join(' | ') : null,
          data.orderId,
        ]
      );
      return mapOrderRow(updated.rows[0]);
    }
  }

  if (data.sessionId) {
    const draft = await query(
      `SELECT id FROM orders
       WHERE session_id = $1
         AND status IN ('cart', 'checkout', 'whatsapp', 'payment_pending', 'pending')
         AND created_at > NOW() - INTERVAL '48 hours'
       ORDER BY updated_at DESC
       LIMIT 1`,
      [data.sessionId]
    );
    if (draft.rows[0]) {
      return upsertOrderIntent({ ...data, orderId: String(draft.rows[0].id) });
    }
  }

  const inserted = await query(
    `INSERT INTO orders
      (customer_name, customer_email, customer_phone, shipping_address, notes, status, total_amount, currency,
       line_items, payment_method, source, session_id, delivery_fee, delivery_zone, shoe_size, city, delivery_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'KES', $8::jsonb, $9, 'web', $10, $11, $12, $13, $14, $15)
     RETURNING *`,
    [
      customerName,
      data.customer?.email || null,
      customerPhone,
      shippingAddress,
      notesParts.length ? notesParts.join(' | ') : null,
      data.stage,
      total,
      JSON.stringify(data.items),
      data.paymentMethod || null,
      data.sessionId,
      data.deliveryFee ?? 0,
      data.customer?.deliveryZone || null,
      data.customer?.shoeSize || null,
      data.customer?.city || null,
      data.customer?.deliveryNotes || null,
    ]
  );
  return mapOrderRow(inserted.rows[0]);
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  await ensureOrderTrackingColumns();
  const result = await query('SELECT * FROM orders WHERE id = $1', [id]);
  return result.rows[0] ? mapOrderRow(result.rows[0]) : null;
}

export async function getAllOrdersForAdmin(limit = 250): Promise<AdminOrderRow[]> {
  await ensureOrderTrackingColumns();
  const result = await query(
    `SELECT
      o.*,
      p.id AS payment_id,
      p.provider AS payment_provider,
      p.status AS payment_status,
      p.amount AS payment_amount,
      p.transaction_reference,
      p.raw_payload AS payment_payload,
      p.created_at AS payment_created_at
    FROM orders o
    LEFT JOIN LATERAL (
      SELECT * FROM payments WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1
    ) p ON true
    ORDER BY o.created_at DESC
    LIMIT $1`,
    [limit]
  );

  return result.rows.map((row) => ({
    ...mapOrderRow(row),
    payment_id: row.payment_id ? String(row.payment_id) : null,
    payment_provider: row.payment_provider ? String(row.payment_provider) : null,
    payment_status: row.payment_status ? String(row.payment_status) : null,
    payment_amount: row.payment_amount != null ? Number(row.payment_amount) : null,
    transaction_reference: row.transaction_reference ? String(row.transaction_reference) : null,
    payment_payload: (row.payment_payload as Record<string, unknown>) || null,
    payment_created_at: row.payment_created_at ? String(row.payment_created_at) : null,
  }));
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await query(`UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`, [status, id]);
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

