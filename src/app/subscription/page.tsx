
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individuals starting out.',
    features: [
      '10 searches per month',
      '50 influencer profiles',
      'Basic filters',
      'No CSV export',
    ],
    cta: 'Your Current Plan',
    isCurrent: true,
  },
  {
    name: 'Premium',
    price: '$49',
    description: 'For power users and teams.',
    features: [
      'Unlimited searches',
      'Unlimited influencer profiles',
      'Advanced filters',
      'CSV & Excel export',
      'Priority support'
    ],
    cta: 'Upgrade to Premium',
    isCurrent: false,
  },
];


export default function SubscriptionPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Our Pricing Plans</h1>
              <p className="text-muted-foreground mt-2">Choose the plan that's right for you.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                {plans.map((plan) => (
                    <Card key={plan.name} className={plan.isCurrent ? 'border-primary' : ''}>
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div>
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary"/>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={plan.isCurrent}>
                                {plan.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
