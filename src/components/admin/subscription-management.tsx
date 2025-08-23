'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionTable } from './subscription-table';
import { CreditCard, Users, TrendingUp, TrendingDown } from 'lucide-react';

// In a real app, this data would come from your payment provider's API
const revenueData = {
  mrr: 4550,
  activeSubscriptions: 92,
  churnRate: 0.05,
};

// In a real app, this would be a list of Subscription objects from your database
const subscriptions = [
  { id: 'sub_1', user: 'Olivia Martin', plan: 'Premium', status: 'Active', startDate: '2023-01-15', endDate: '2024-01-15' },
  { id: 'sub_2', user: 'Jackson Lee', plan: 'Premium', status: 'Active', startDate: '2023-02-01', endDate: '2024-02-01' },
  { id: 'sub_3', user: 'Isabella Nguyen', plan: 'Free', status: 'Canceled', startDate: '2023-03-20', endDate: '2023-04-20' },
  { id: 'sub_4', user: 'William Kim', plan: 'Premium', status: 'Active', startDate: '2023-04-10', endDate: '2024-04-10' },
  { id: 'sub_5', user: 'Sophia Davis', plan: 'Premium', status: 'Past Due', startDate: '2023-05-05', endDate: '2024-05-05' },
];


export function SubscriptionManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Subscriptions & Payments</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.mrr.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Represents paying customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(revenueData.churnRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Customer churn per month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
          <CardDescription>
            A list of all customer subscriptions. This data is currently mocked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionTable subscriptions={subscriptions} />
        </CardContent>
      </Card>
    </div>
  );
}
