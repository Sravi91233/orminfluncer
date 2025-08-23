'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, FileText, Ban } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface Subscription {
    id: string;
    user: string;
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
}

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'canceled':
        return 'destructive';
      case 'past due':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
   const formatDate = (dateString?: string) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">{subscription.user}</TableCell>
                <TableCell>{subscription.plan}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(subscription.status)}>
                    {subscription.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(subscription.startDate)}</TableCell>
                <TableCell>{formatDate(subscription.endDate)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                       <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Subscription</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 focus:text-red-500">
                        <Ban className="mr-2 h-4 w-4" />
                        <span>Cancel Subscription</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No subscription data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
