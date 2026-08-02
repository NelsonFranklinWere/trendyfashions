-- First-party view analytics for admin dashboard
CREATE TABLE IF NOT EXISTS page_events (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_events_created_at ON page_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_events_path ON page_events (path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_events_product ON page_events (product_id, created_at DESC)
  WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_events_session_live ON page_events (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_events_type ON page_events (event_type, created_at DESC);
