'use client';

import { useCallback, useEffect, useId, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/router';
import FastLink from '@/components/FastLink';
import SmartImage from '@/components/SmartImage';
import { formatPrice } from '@/data/products';
import { cn } from '@/lib/utils';
import type { ProductSearchHit } from '@/lib/search/types';

type SearchResponse = {
  query: string;
  results: ProductSearchHit[];
  count: number;
};

interface AsyncProductSearchProps {
  /** Compact for navbar */
  compact?: boolean;
  className?: string;
  placeholder?: string;
  /** Optional: lock results to a category label display only */
  categoryHint?: string;
}

const DEBOUNCE_MS = 280;
const MIN_CHARS = 1;

export default function AsyncProductSearch({
  compact = false,
  className,
  placeholder = 'Search shoes, brands, clothing…',
  categoryHint,
}: AsyncProductSearchProps) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const seqRef = useRef(0);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductSearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPending, startTransition] = useTransition();

  const runSearch = useCallback(async (value: string) => {
    const q = value.trim();
    if (q.length < MIN_CHARS) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const seq = ++seqRef.current;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&limit=10`,
        { signal: controller.signal },
      );
      if (!res.ok) throw new Error('Search failed');
      const data = (await res.json()) as SearchResponse;
      if (seq !== seqRef.current) return;
      startTransition(() => {
        setResults(data.results || []);
        setOpen(true);
        setActiveIndex(-1);
      });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      if (seq !== seqRef.current) return;
      setError('Could not search. Try again.');
      setResults([]);
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_CHARS) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const t = window.setTimeout(() => {
      void runSearch(q);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [query, runSearch]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const goTo = (href: string) => {
    setOpen(false);
    void router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter') && results.length) {
      setOpen(true);
    }
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        void runSearch(query);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      setOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (hit) goTo(hit.href);
    }
  };

  const showPanel = open && query.trim().length >= MIN_CHARS;

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) goTo(results[0].href);
          else void runSearch(query);
        }}
        className="relative"
      >
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= MIN_CHARS) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showPanel}
          aria-activedescendant={
            activeIndex >= 0 && results[activeIndex]
              ? `${listId}-opt-${activeIndex}`
              : undefined
          }
          className={cn(
            'w-full rounded-full border border-light bg-white text-text font-body shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/40',
            compact
              ? 'pl-9 pr-16 py-1.5 text-xs lg:text-sm min-w-[9.5rem] lg:min-w-[12rem]'
              : 'pl-11 pr-24 py-2.5 text-sm',
          )}
        />
        <span
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text/50',
            compact ? 'left-2.5' : 'left-3.5',
          )}
          aria-hidden
        >
          <svg
            className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <button
          type="submit"
          className={cn(
            'absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-secondary text-white font-body font-semibold',
            'hover:bg-[#d35400] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50',
            compact ? 'px-2.5 py-1 text-[10px] lg:text-xs' : 'px-3.5 py-1.5 text-xs sm:text-sm',
          )}
          aria-label="Search products"
        >
          {loading || isPending ? '…' : 'Search'}
        </button>
      </form>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          className={cn(
            'absolute z-[60] left-0 right-0 mt-2 overflow-hidden rounded-xl border border-light bg-white shadow-2xl',
            compact ? 'min-w-[16rem] max-w-[22rem] sm:right-auto' : '',
          )}
        >
          {categoryHint && (
            <p className="border-b border-light px-3 py-1.5 text-[11px] text-text/60 font-body">
              Searching {categoryHint}
            </p>
          )}

          {loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-text/70 font-body">Searching…</p>
          )}

          {error && (
            <p className="px-4 py-3 text-sm text-red-600 font-body">{error}</p>
          )}

          {!loading && !error && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-text/70 font-body">
              No products match &ldquo;{query.trim()}&rdquo;
            </p>
          )}

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((hit, index) => {
                const active = index === activeIndex;
                return (
                  <li key={hit.id} role="option" aria-selected={active} id={`${listId}-opt-${index}`}>
                    <FastLink
                      href={hit.href}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 transition-colors',
                        active ? 'bg-light' : 'hover:bg-light/70',
                      )}
                    >
                      <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-md bg-light">
                        <SmartImage
                          src={hit.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="44px"
                          quality={40}
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        {hit.brand && (
                          <p className="text-[10px] uppercase tracking-wide text-secondary font-semibold truncate">
                            {hit.brand}
                          </p>
                        )}
                        <p className="text-sm font-medium text-primary truncate">{hit.name}</p>
                        <p className="text-xs text-text/70 capitalize">
                          {hit.category} ·{' '}
                          <span className="text-secondary font-semibold">
                            {formatPrice(hit.price)}
                          </span>
                        </p>
                      </div>
                    </FastLink>
                  </li>
                );
              })}
            </ul>
          )}

          {results.length > 0 && (
            <div className="border-t border-light px-3 py-2 text-[11px] text-text/50 font-body">
              {results.length} result{results.length === 1 ? '' : 's'} · type to refine
            </div>
          )}
        </div>
      )}
    </div>
  );
}
