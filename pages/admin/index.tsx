import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const adminCards = [
  {
    id: 'products',
    title: 'Manage Products',
    description: 'Add, edit, and manage your product catalog',
    href: '/admin/products',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
  },
  {
    id: 'blogs',
    title: 'Manage Blogs',
    description: 'Create and manage blog posts',
    href: '/admin/blogs',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
  },
  {
    id: 'case-studies',
    title: 'Manage Case Studies',
    description: 'Create and manage customer success stories',
    href: '/admin/case-studies',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h8M3 7h18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      </svg>
    ),
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
  },
  {
    id: 'payments',
    title: 'Manage Payments',
    description: 'View and manage payment transactions',
    href: '/admin/payments',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
  },
];

export default function AdminDashboard() {
  const { user, loading, logout } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

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

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <h2 className="text-lg font-semibold text-slate-900">Admin Panel</h2>
          <p className="mt-1 text-xs text-slate-500 truncate">{user.email}</p>
          <nav className="mt-5 space-y-2">
            {adminCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  {card.icon}
                </span>
                <span>{card.title}</span>
              </Link>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-6 w-full rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="mt-1 text-slate-600">Manage products, blogs, case studies, and payments</p>
              </div>
              <button
                onClick={logout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors lg:hidden"
              >
                Logout
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {adminCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={card.href}>
                  <div className="group h-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                    <div className={`${card.color} ${card.hoverColor} mb-4 inline-flex rounded-xl p-3 text-white transition-colors duration-200`}>
                      {card.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="mb-4 text-slate-600">{card.description}</p>
                    <div className="flex items-center text-sm font-medium text-primary">
                      <span>Open section</span>
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
