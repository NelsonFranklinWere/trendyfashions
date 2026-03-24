import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useState } from 'react';

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  outcome: string | null;
  cover_image: string | null;
  published: boolean;
}

export default function ManageCaseStudies() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    client_name: '',
    summary: '',
    challenge: '',
    solution: '',
    outcome: '',
    cover_image: '',
    published: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingItems(true);
      const res = await fetch('/api/admin/case-studies');
      const data = await res.json();
      setItems(data.caseStudies || []);
      setLoadingItems(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      client_name: '',
      summary: '',
      challenge: '',
      solution: '',
      outcome: '',
      cover_image: '',
      published: false,
    });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/case-studies/${editingId}` : '/api/admin/case-studies';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      alert('Failed to save case study');
      return;
    }
    const refresh = await fetch('/api/admin/case-studies');
    const data = await refresh.json();
    setItems(data.caseStudies || []);
    resetForm();
  };

  const startEdit = (item: CaseStudy) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      client_name: item.client_name || '',
      summary: item.summary || '',
      challenge: item.challenge || '',
      solution: item.solution || '',
      outcome: item.outcome || '',
      cover_image: item.cover_image || '',
      published: item.published,
    });
  };

  const removeItem = async (id: string) => {
    if (!confirm('Delete this case study?')) return;
    const res = await fetch(`/api/admin/case-studies/${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Failed to delete case study');
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Manage Case Studies</h1>
          <p className="text-slate-600 mt-1">Publish polished customer success stories with measurable outcomes.</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <form onSubmit={submitForm} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit case study' : 'Create case study'}</h3>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="Slug (e.g. cbd-corporate-footwear)" className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
            <input value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} placeholder="Client name (optional)" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            <input value={form.cover_image} onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))} placeholder="Cover image URL (optional)" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            <textarea value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="Summary" className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-20" />
            <textarea value={form.challenge} onChange={(e) => setForm((f) => ({ ...f, challenge: e.target.value }))} placeholder="Challenge" className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-20" />
            <textarea value={form.solution} onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))} placeholder="Solution" className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-20" />
            <textarea value={form.outcome} onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))} placeholder="Outcome" className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-20" />
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
              Published
            </label>
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-white font-medium hover:bg-primary/90">
                {editingId ? 'Update case study' : 'Create case study'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Published and drafts</h3>
            {loadingItems ? (
              <p className="text-slate-500">Loading case studies...</p>
            ) : items.length === 0 ? (
              <p className="text-slate-500">No case studies yet.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-1">/{item.slug} • {item.published ? 'Published' : 'Draft'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(item)} className="text-xs rounded-md bg-blue-600 px-3 py-1.5 text-white">Edit</button>
                        <button onClick={() => removeItem(item.id)} className="text-xs rounded-md bg-red-600 px-3 py-1.5 text-white">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
