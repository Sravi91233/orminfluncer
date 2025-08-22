'use client';

import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.name || user?.email}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is your dashboard. More features coming soon!</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
