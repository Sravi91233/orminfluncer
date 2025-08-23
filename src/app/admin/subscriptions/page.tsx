
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { SubscriptionManagement } from '@/components/admin/subscription-management';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminSubscriptionsPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AppLayout>
        <SubscriptionManagement />
      </AppLayout>
    </ProtectedRoute>
  );
}
