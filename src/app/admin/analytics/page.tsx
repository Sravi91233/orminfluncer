'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AppLayout>
          <AnalyticsDashboard />
      </AppLayout>
    </ProtectedRoute>
  );
}
