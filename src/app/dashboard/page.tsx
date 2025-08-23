'use client';

import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, FileDown, Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const searchSchema = z.object({
  query: z.string(),
});

export default function UserDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const onSearch = (values: z.infer<typeof searchSchema>) => {
    router.push(`/search?q=${values.query}`);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome, {user?.name || user?.email}!</h1>
            <p className="text-muted-foreground">Here's a quick overview of your account and tools.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Search</CardTitle>
              <CardDescription>Find your next influencer in seconds.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSearch)} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Search by keyword, e.g. 'vegan lifestyle'..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">Free Plan</div>
                    <p className="text-xs text-muted-foreground">Limited searches & exports</p>
                </CardContent>
             </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shortcuts</CardTitle>
              <CardDescription>Quick access to your most-used features.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Button asChild variant="outline" size="lg" className="justify-start">
                <Link href="/search">
                  <Search className="mr-2" />
                  Search Influencers
                  <ArrowRight className="ml-auto" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="justify-start">
                 <Link href="/search">
                  <FileDown className="mr-2" />
                  Export Data
                  <ArrowRight className="ml-auto" />
                 </Link>
              </Button>
              <Button asChild variant="default" size="lg" className="justify-start">
                <Link href="/subscription">
                  <BarChart className="mr-2" />
                  Upgrade Subscription
                  <ArrowRight className="ml-auto" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
