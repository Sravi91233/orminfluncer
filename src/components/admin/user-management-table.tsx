'use client';

import * as React from 'react';
import { users as mockUsers } from '@/lib/mock-data';
import type { AppUser } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export function UserManagementTable() {
  const [users, setUsers] = React.useState<AppUser[]>(mockUsers);
  const { toast } = useToast();

  const handleStatusChange = (userId: string, newStatus: boolean) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus ? 'active' : 'disabled' } : u));
    toast({
        title: 'User Updated',
        description: `User status has been changed to ${newStatus ? 'active' : 'disabled'}.`
    })
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Enable/Disable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} 
                  className={user.status === 'active' ? 'border-green-500 text-green-500' : ''}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={user.status === 'active'}
                  onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
                  disabled={user.role === 'admin'}
                  aria-label={`Toggle user ${user.email}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
