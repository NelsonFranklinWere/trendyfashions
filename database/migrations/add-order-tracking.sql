-- Order tracking: cart items, checkout stages, delivery details
ALTER TABLE orders ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'web';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS session_id VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shoe_size VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
