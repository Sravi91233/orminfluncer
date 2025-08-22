'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { UserManagementTable } from '@/components/admin/user-management-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute roles={['admin']}>
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
    </ProtectedRoute>
  );
}
