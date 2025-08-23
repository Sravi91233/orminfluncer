'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Users, Database, Search, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminDashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [premiumCount, setPremiumCount] = useState(0);
  const [freeCount, setFreeCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      let premium = 0;
      let free = 0;
      userSnapshot.docs.forEach(doc => {
        const user = doc.data();
        if (user.subscription === 'Premium') {
          premium++;
        } else {
          free++;
        }
      });
      setUserCount(userSnapshot.size);
      setPremiumCount(premium);
      setFreeCount(free);
    };
    fetchUsers();
  }, []);


  return (
    <ProtectedRoute roles={['admin']}>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
                <p className="text-xs text-muted-foreground">{freeCount} Free | {premiumCount} Premium</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">from database</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">coming soon</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{premiumCount}</div>
                <p className="text-xs text-muted-foreground">Represents active premium users</p>
              </CardContent>
            </Card>
          </div>
          
           <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Recent activity feed coming soon...</p>
            </CardContent>
          </Card>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
