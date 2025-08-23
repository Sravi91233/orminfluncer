'use client';

import * as React from 'react';
import type { AppUser } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MoreHorizontal, UserCog, MailWarning, Trash2, UserX, UserCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { sendPasswordReset } from '@/ai/flows/send-password-reset-flow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


interface UserManagementTableProps {
  users: AppUser[];
  onUpdateUser: (userId: string, updates: Partial<AppUser>) => void;
  onDeleteUser: (userId: string) => void;
}


export function UserManagementTable({ users, onUpdateUser, onDeleteUser }: UserManagementTableProps) {
  const { toast } = useToast();
  const [userToDelete, setUserToDelete] = React.useState<AppUser | null>(null);

  const handleStatusChange = (user: AppUser, newStatus: 'active' | 'disabled') => {
    onUpdateUser(user.id, { status: newStatus });
    toast({
        title: 'User Updated',
        description: `${user.name}'s status has been changed to ${newStatus}.`
    })
  };
  
  const handleRoleChange = (user: AppUser, newRole: 'admin' | 'user') => {
    onUpdateUser(user.id, { role: newRole });
     toast({
        title: 'User Updated',
        description: `${user.name}'s role has been changed to ${newRole}.`
    })
  }
  
  const handleSendResetLink = async (email: string) => {
    toast({
      title: 'Sending Email...',
      description: `Sending password reset link to ${email}.`,
    });
    try {
      const result = await sendPasswordReset({ email });
       toast({
        title: result.success ? 'Email Sent' : 'Email Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive'
      });
    } catch (error: any) {
       toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };
  
  const confirmDeleteUser = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      toast({
        title: 'User Deleted',
        description: `${userToDelete.name} has been removed.`,
      });
      setUserToDelete(null);
    }
  };


  const getInitials = (name?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    }
    return 'U';
  };
  
  const formatDate = (dateString?: string) => {
      if (!dateString) return 'N/A';
      try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch {
          return 'Invalid Date';
      }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || undefined} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                          <span className="font-semibold">{user.name}</span>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                      </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.subscription === 'Premium' ? 'default' : 'secondary'}>
                    {user.subscription}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} 
                    className={user.status === 'active' ? 'border-green-500 text-green-500' : ''}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(user.lastLogin)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">User Actions</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions for {user.name}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRoleChange(user, user.role === 'admin' ? 'user' : 'admin')}>
                              <UserCog className="mr-2 h-4 w-4" />
                              <span>{user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendResetLink(user.email)}>
                              <MailWarning className="mr-2 h-4 w-4" />
                              <span>Send Password Reset</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user, user.status === 'active' ? 'disabled' : 'active')}>
                             {user.status === 'active' ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                              <span>{user.status === 'active' ? 'Disable User' : 'Enable User'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                              className="text-red-500 focus:text-red-500 focus:bg-red-50"
                              onClick={() => setUserToDelete(user)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete User</span>
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser}>Yes, delete user</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
