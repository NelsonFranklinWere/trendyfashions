import { query } from '@/lib/db/postgres';
import type { AnalyticsSummary } from '@/lib/analytics/summaryTypes';

export type { AnalyticsSummary } from '@/lib/analytics/summaryTypes';

let schemaReady: Promise<void> | null = null;

export async function ensureAnalyticsSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await query(`
        CREATE TABLE IF NOT EXISTS page_events (
          id BIGSERIAL PRIMARY KEY,
          path TEXT NOT NULL,
          product_id TEXT,
          product_name TEXT,
          event_type TEXT NOT NULL DEFAULT 'page_view',
          session_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await query(
        `CREATE INDEX IF NOT EXISTS idx_page_events_created_at ON page_events (created_at DESC)`,
      );
      await query(
        `CREATE INDEX IF NOT EXISTS idx_page_events_path ON page_events (path, created_at DESC)`,
      );
      await query(
        `CREATE INDEX IF NOT EXISTS idx_page_events_product ON page_events (product_id, created_at DESC)`,
      );
      await query(
        `CREATE INDEX IF NOT EXISTS idx_page_events_session_live ON page_events (session_id, created_at DESC)`,
      );
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export async function recordPageEvent(input: {
  path: string;
  productId?: string | null;
  productName?: string | null;
  eventType?: 'page_view' | 'product_view';
  sessionId?: string | null;
}): Promise<void> {
  await ensureAnalyticsSchema();
  const path = (input.path || '/').slice(0, 500);
  const eventType = input.eventType || 'page_view';
  await query(
    `INSERT INTO page_events (path, product_id, product_name, event_type, session_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      path,
      input.productId?.slice(0, 120) || null,
      input.productName?.slice(0, 255) || null,
      eventType,
      input.sessionId?.slice(0, 80) || null,
    ],
  );
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  await ensureAnalyticsSchema();

  const [live, today, week, productToday, topProducts, topPaths, last24] = await Promise.all([
    query<{ c: string }>(
      `SELECT COUNT(DISTINCT session_id)::text AS c
       FROM page_events
       WHERE created_at > NOW() - INTERVAL '5 minutes'
         AND session_id IS NOT NULL`,
    ),
    query<{ c: string }>(
      `SELECT COUNT(*)::text AS c FROM page_events
       WHERE event_type = 'page_view'
         AND created_at >= date_trunc('day', NOW())`,
    ),
    query<{ c: string }>(
      `SELECT COUNT(*)::text AS c FROM page_events
       WHERE event_type = 'page_view'
         AND created_at > NOW() - INTERVAL '7 days'`,
    ),
    query<{ c: string }>(
      `SELECT COUNT(*)::text AS c FROM page_events
       WHERE event_type = 'product_view'
         AND created_at >= date_trunc('day', NOW())`,
    ),
    query<{ product_id: string; product_name: string | null; views: string }>(
      `SELECT product_id, MAX(product_name) AS product_name, COUNT(*)::text AS views
       FROM page_events
       WHERE event_type = 'product_view'
         AND product_id IS NOT NULL
         AND created_at > NOW() - INTERVAL '7 days'
       GROUP BY product_id
       ORDER BY COUNT(*) DESC
       LIMIT 15`,
    ),
    query<{ path: string; views: string }>(
      `SELECT path, COUNT(*)::text AS views
       FROM page_events
       WHERE event_type = 'page_view'
         AND created_at > NOW() - INTERVAL '7 days'
       GROUP BY path
       ORDER BY COUNT(*) DESC
       LIMIT 10`,
    ),
    query<{ c: string }>(
      `SELECT COUNT(*)::text AS c FROM page_events
       WHERE created_at > NOW() - INTERVAL '24 hours'`,
    ),
  ]);

  return {
    liveVisitors: parseInt(live.rows[0]?.c || '0', 10),
    pageViewsToday: parseInt(today.rows[0]?.c || '0', 10),
    pageViews7d: parseInt(week.rows[0]?.c || '0', 10),
    productViewsToday: parseInt(productToday.rows[0]?.c || '0', 10),
    viewsLast24h: parseInt(last24.rows[0]?.c || '0', 10),
    topProducts: topProducts.rows.map((r) => ({
      productId: r.product_id,
      productName: r.product_name,
      views: parseInt(r.views, 10),
    })),
    topPaths: topPaths.rows.map((r) => ({
      path: r.path,
      views: parseInt(r.views, 10),
    })),
  };
}
