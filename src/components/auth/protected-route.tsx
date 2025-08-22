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
    // Don't do anything while loading
    if (loading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      router.replace('/login');
      return;
    }

    // If roles are specified, check if the user has one of the required roles.
    // If not, redirect to a safe page (their dashboard).
    if (roles && !roles.includes(user.role)) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router, roles]);

  // While loading, or if the user is not authenticated or not authorized, show a loading screen.
  // This prevents a flash of content before the redirect happens.
  if (loading || !user || (roles && !roles.includes(user.role))) {
    return <PageLoading />;
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
}
