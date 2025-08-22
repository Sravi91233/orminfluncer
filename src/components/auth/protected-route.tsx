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
      return; // Wait for auth state to load
    }

    if (!user) {
      router.replace('/login'); // Redirect to login if not authenticated
      return;
    }
    
    // If roles are specified, check if the user has one of the required roles
    if (roles && !roles.includes(user.role)) {
       router.replace('/dashboard'); // Or a dedicated "access-denied" page
    }

  }, [user, loading, router, roles]);

  // While loading auth state, or if user is not authenticated, show a loading screen.
  // This prevents a flash of content before the redirect happens.
  if (loading || !user || (roles && !roles.includes(user.role))) {
    return <PageLoading />;
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
}
