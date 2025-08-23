'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { CityManagement } from '@/components/admin/city-management';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminCitiesPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AppLayout>
        <CityManagement />
      </AppLayout>
    </ProtectedRoute>
  );
}
