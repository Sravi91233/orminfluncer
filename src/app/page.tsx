'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { PageLoading } from '@/components/layout/page-loading';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/dashboard');
        }
      } else {
        router.replace('/landingpage');
      }
    }
  }, [user, loading, router]);

  return <PageLoading />;
}
