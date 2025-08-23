'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { InfluencerManagement } from '@/components/admin/influencer-management';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminInfluencersPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AppLayout>
        <InfluencerManagement />
      </AppLayout>
    </ProtectedRoute>
  );
}
