'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import type { AnalyticsSummary } from '@/lib/analytics/summaryTypes';

const empty: AnalyticsSummary = {
  liveVisitors: 0,
  pageViewsToday: 0,
  pageViews7d: 0,
  productViewsToday: 0,
  viewsLast24h: 0,
  topProducts: [],
  topPaths: [],
};

export default function AdminAnalyticsPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsSummary>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/admin/login');
  }, [user, authLoading, router]);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed to load analytics');
      const json = await res.json();
      setData(json);
      setUpdatedAt(new Date().toLocaleTimeString());
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void load();
    const id = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(id);
  }, [user, load]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" className="text-sm text-secondary font-medium hover:underline">
          ← Back to Dashboard
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="mt-1 text-sm text-slate-600">
              Live visits (last 5 min), page views, and most-viewed products. Auto-refresh every 30s.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Refresh {updatedAt ? `(${updatedAt})` : ''}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Live visitors" value={data.liveVisitors} hint="Unique sessions · 5 min" accent />
          <StatCard label="Page views today" value={data.pageViewsToday} />
          <StatCard label="Product views today" value={data.productViewsToday} />
          <StatCard label="Views (7 days)" value={data.pageViews7d} />
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Most viewed products (7 days)</h2>
            {loading && data.topProducts.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">Loading…</p>
            ) : data.topProducts.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No product views yet. Stats fill as shoppers browse the site.
              </p>
            ) : (
              <ol className="mt-4 space-y-2">
                {data.topProducts.map((p, i) => (
                  <li
                    key={p.productId}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {p.productName || p.productId}
                        </p>
                        <Link
                          href={`/products/${encodeURIComponent(p.productId)}`}
                          className="text-xs text-secondary hover:underline"
                          target="_blank"
                        >
                          Open product
                        </Link>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-secondary tabular-nums">{p.views}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Top pages (7 days)</h2>
            {data.topPaths.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No page views recorded yet.</p>
            ) : (
              <ol className="mt-4 space-y-2">
                {data.topPaths.map((p, i) => (
                  <li
                    key={p.path}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                      <p className="text-sm font-medium text-slate-900 truncate">{p.path}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-700 tabular-nums">{p.views}</span>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-4 text-xs text-slate-500">
              Events (24h): {data.viewsLast24h.toLocaleString()} · Live = distinct sessions active in
              last 5 minutes
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        accent ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${accent ? 'text-emerald-700' : 'text-slate-900'}`}>
        {value.toLocaleString()}
      </p>
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}
