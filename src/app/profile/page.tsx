
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Profile & Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Your personal information and how you appear on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user?.photoURL || ''} />
                            <AvatarFallback>{getInitials(user?.name, user?.email)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{user?.name}</h3>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.name || ''} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                    </div>
                     <Button>Save Changes</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password or manage your login methods.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Link href="/forgot-password">
                        <Button variant="outline">Change Password</Button>
                    </Link>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>View your current plan and billing history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <h4 className="font-semibold">Current Plan</h4>
                            <p className="text-muted-foreground">Your are currently on the Free tier.</p>
                        </div>
                        <Badge variant="secondary">Free</Badge>
                    </div>
                     <Link href="/subscription">
                        <Button>Upgrade to Premium</Button>
                    </Link>
                </CardContent>
            </Card>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
