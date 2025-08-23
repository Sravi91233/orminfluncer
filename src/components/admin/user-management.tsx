'use client';

import * as React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserManagementTable } from './user-management-table';
import type { AppUser } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { PageLoading } from '../layout/page-loading';
import { useToast } from '@/hooks/use-toast';

export function UserManagement() {
  const [users, setUsers] = React.useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [subscriptionFilter, setSubscriptionFilter] = React.useState('All');
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch user data.'
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleUpdateUser = (userId: string, updates: Partial<AppUser>) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };
  
  const filteredUsers = React.useMemo(() => {
    if (subscriptionFilter === 'All') {
      return users;
    }
    return users.filter(user => user.subscription === subscriptionFilter);
  }, [users, subscriptionFilter]);
  
  if (isLoading) {
    return <PageLoading />;
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View and manage user accounts from your Firestore database.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="subscription-filter">Filter by plan:</Label>
                <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                    <SelectTrigger id="subscription-filter" className="w-[180px]">
                        <SelectValue placeholder="Filter by plan..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Plans</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Free">Free</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          <UserManagementTable users={filteredUsers} onUpdateUser={handleUpdateUser} />
        </CardContent>
      </Card>
    </div>
  )
}
