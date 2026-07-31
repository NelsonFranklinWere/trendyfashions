export type OrderLineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
};

export type OrderStage =
  | 'cart'
  | 'checkout'
  | 'whatsapp'
  | 'payment_pending'
  | 'paid'
  | 'failed'
  | 'cancelled';

export type RecordOrderPayload = {
  sessionId: string;
  stage: OrderStage;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee?: number;
  total?: number;
  orderId?: string;
  paymentMethod?: 'whatsapp' | 'pesapal';
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
};
