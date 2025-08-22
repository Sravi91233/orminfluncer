'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Card>
            <CardHeader>
              <CardTitle>Welcome, Admin!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is the admin dashboard. You have special privileges.</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
