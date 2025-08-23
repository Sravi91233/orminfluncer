'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ApiManagement } from '@/components/admin/api-management';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminApiManagementPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AppLayout>
        <ApiManagement />
      </AppLayout>
    </ProtectedRoute>
  );
}
