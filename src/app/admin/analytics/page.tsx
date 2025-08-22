'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageLoading } from '@/components/layout/page-loading';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return <PageLoading />;
  }

  return (
    <AppLayout>
        <AnalyticsDashboard />
    </AppLayout>
  );
}
