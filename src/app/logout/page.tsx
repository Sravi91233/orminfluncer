'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { PageLoading } from '@/components/layout/page-loading';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LogoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // As soon as this page loads, sign the user out.
    signOut(auth);
  }, []);

  useEffect(() => {
    // This effect waits for the auth state to update.
    // Once loading is false and there is no user, it means sign-out is complete.
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  // Show a loading screen while the sign-out and redirect process is happening.
  return <PageLoading />;
}
