'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoading } from '@/components/layout/page-loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('admin' | 'user')[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }
    
    if (roles && !roles.includes(user.role)) {
       router.replace('/dashboard'); // Or a dedicated "access-denied" page
    }

  }, [user, loading, router, roles]);

  if (loading || !user || (roles && !roles.includes(user.role))) {
    return <PageLoading />;
  }

  return <>{children}</>;
}
