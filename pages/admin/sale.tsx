'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type SaleListItem = {
  id: string;
  source: 'product' | 'image';
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string | null;
  onSale: boolean;
};

function itemKey(item: Pick<SaleListItem, 'source' | 'id'>) {
  return `${item.source}:${item.id}`;
}

export default function AdminSalePage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  /** Full catalog (for Add dialog). Main view only uses on-sale ones. */
  const [items, setItems] = useState<SaleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [removingKey, setRemovingKey] = useState<string | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  /** Keys of checked products in the Add dialog */
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !user) router.push('/admin/login');
  }, [user, authLoading, router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/sale');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      const list: SaleListItem[] =
        data.items || [...(data.onSale || []), ...(data.available || [])];
      setItems(list);
    } catch (e: any) {
      setError(e.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  /** Only products currently on the public sale page */
  const onSaleItems = useMemo(
    () => items.filter((i) => i.onSale).sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );

  /** All catalog products, aligned A–Z for the picker */
  const allSorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );

  const filteredPicker = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    if (!q) return allSorted;
    return allSorted.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q),
    );
  }, [allSorted, pickerQuery]);

  const openAdd = () => {
    // Pre-check everything already on sale
    setChecked(new Set(onSaleItems.map(itemKey)));
    setPickerQuery('');
    setError(null);
    setMsg(null);
    setPickerOpen(true);
  };

  const closeAdd = () => {
    if (saving) return;
    setPickerOpen(false);
    setPickerQuery('');
  };

  const toggleCheck = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /** Apply checkboxes: checked = on sale, unchecked = removed from sale */
  const applyUpdate = async () => {
    setSaving(true);
    setError(null);
    setMsg(null);

    const selected = items
      .filter((p) => checked.has(itemKey(p)))
      .map((p) => ({ productId: p.id, source: p.source }));

    try {
      const res = await fetch('/api/admin/sale', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'sync', selected }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Update failed');

      if (Array.isArray(data.items)) {
        setItems(data.items);
      } else {
        await load();
      }

      const added = data.added ?? 0;
      const removed = data.removed ?? 0;
      setMsg(
        `Sale page updated. On sale now: ${
          data.counts?.onSale ?? selected.length
        }${added || removed ? ` (+${added} / −${removed})` : ''}.`,
      );
      setPickerOpen(false);
    } catch (e: any) {
      setError(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const removeOne = async (item: SaleListItem) => {
    const key = itemKey(item);
    setRemovingKey(key);
    setError(null);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/sale', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.id,
          source: item.source,
          onSale: false,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Remove failed');
      }
      setItems((prev) =>
        prev.map((p) => (itemKey(p) === key ? { ...p, onSale: false } : p)),
      );
      setMsg(`Removed “${item.name}” from sale`);
    } catch (e: any) {
      setError(e.message || 'Remove failed');
    } finally {
      setRemovingKey(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin" className="text-sm text-secondary font-medium hover:underline">
          ← Back to Dashboard
        </Link>

        {/* Header: title left, Add right */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sale page</h1>
            <p className="mt-1 text-sm text-slate-600">
              Only products shown on the public sale page. Use <strong>Add</strong> to choose from
              your full catalog.
            </p>
            <a
              href="/collections/sale"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm text-secondary underline"
            >
              Open public sale page →
            </a>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 flex-shrink-0"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {msg && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {msg}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center justify-between">
          <span className="text-sm text-slate-600">Products on sale right now</span>
          <span className="text-lg font-bold text-rose-600">{onSaleItems.length}</span>
        </div>

        <section className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-500 py-12 text-center">Loading…</p>
          ) : onSaleItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm text-slate-600">No products on the sale page yet.</p>
              <button
                type="button"
                onClick={openAdd}
                className="mt-4 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Add
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {onSaleItems.map((p) => {
                const key = itemKey(p);
                const busy = removingKey === key;
                return (
                  <li key={key} className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-200" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 capitalize">
                        {p.category}
                        {p.price > 0 ? ` · KES ${Number(p.price).toLocaleString('en-KE')}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void removeOne(p)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      {busy ? '…' : 'Remove'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Add / update dialog — full catalog with checkboxes */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sale-add-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAdd();
          }}
        >
          <div className="flex w-full max-w-2xl max-h-[92vh] flex-col rounded-t-2xl sm:rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
              <div>
                <h2 id="sale-add-title" className="text-lg font-bold text-slate-900">
                  Choose sale products
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tick products for the public sale page. Untick to remove. Then press{' '}
                  <strong>Update</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={closeAdd}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void applyUpdate()}
                  disabled={saving}
                  className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Update'}
                </button>
              </div>
            </div>

            <div className="border-b border-slate-100 px-4 py-3 sm:px-5 space-y-2">
              <input
                type="search"
                value={pickerQuery}
                onChange={(e) => setPickerQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                autoFocus
              />
              <p className="text-xs text-slate-500">
                {checked.size} selected for sale · {filteredPicker.length} shown
                {pickerQuery ? ' (filtered)' : ` · ${allSorted.length} total`}
              </p>
            </div>

            <ul className="flex-1 overflow-y-auto divide-y divide-slate-50 min-h-[14rem]">
              {filteredPicker.length === 0 ? (
                <li className="px-4 py-12 text-center text-sm text-slate-500">
                  No products match your search.
                </li>
              ) : (
                filteredPicker.map((p) => {
                  const key = itemKey(p);
                  const isChecked = checked.has(key);
                  return (
                    <li key={key}>
                      <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheck(key)}
                          className="h-4 w-4 rounded border-slate-300 text-secondary focus:ring-secondary flex-shrink-0"
                        />
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized
                            />
                          ) : (
                            <div className="h-full w-full bg-slate-200" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                          <p className="text-xs text-slate-500 capitalize truncate">
                            {p.category}
                            {p.price > 0
                              ? ` · KES ${Number(p.price).toLocaleString('en-KE')}`
                              : ''}
                          </p>
                        </div>
                        {p.onSale && (
                          <span className="text-[10px] uppercase tracking-wide font-semibold text-rose-600 flex-shrink-0">
                            On sale
                          </span>
                        )}
                      </label>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:px-5 bg-slate-50 rounded-b-2xl">
              <p className="text-xs text-slate-500">
                Checked = show on sale page. Unchecked = not on sale.
              </p>
              <button
                type="button"
                onClick={() => void applyUpdate()}
                disabled={saving}
                className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
