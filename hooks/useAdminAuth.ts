import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export function useAdminAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        // Redirect to login if not authenticated
        if (router.pathname.startsWith('/admin') && router.pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, loading, logout, checkAuth };
}
