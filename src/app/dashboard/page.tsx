'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageLoading } from '@/components/layout/page-loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <PageLoading />;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.name || user.email}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is your dashboard. More features coming soon!</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
