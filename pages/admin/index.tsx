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
    comingSoon: true,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your store content and settings</p>
            <p className="text-sm text-gray-500 mt-1">Logged in as: {user.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {card.comingSoon ? (
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded">Coming Soon</span>
                  </div>
                  <div className={`${card.color} text-white rounded-lg p-4 mb-4 inline-block`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 py-2 px-4 rounded-md font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              ) : (
                <Link href={card.href}>
                  <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-transparent hover:border-primary transition-all duration-200 cursor-pointer h-full flex flex-col group">
                    <div className={`${card.color} ${card.hoverColor} text-white rounded-lg p-4 mb-4 inline-block transition-colors duration-200`}>
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">{card.description}</p>
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                      <span>Go to {card.title}</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
