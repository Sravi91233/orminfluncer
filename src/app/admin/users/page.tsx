'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageLoading } from '@/components/layout/page-loading';
import { UserManagementTable } from '@/components/admin/user-management-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminUsersPage() {
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage user accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagementTable />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
