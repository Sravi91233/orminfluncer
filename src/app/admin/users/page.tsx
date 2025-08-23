'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { UserManagement } from '@/components/admin/user-management';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AppLayout>
        <UserManagement />
      </AppLayout>
    </ProtectedRoute>
  );
}
