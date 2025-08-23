'use client';

import * as React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfluencerManagementTable } from './influencer-management-table';
import type { Influencer } from '@/types';
import { PageLoading } from '../layout/page-loading';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Download, Upload } from 'lucide-react';

export function InfluencerManagement() {
  const [influencers, setInfluencers] = React.useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchInfluencers = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd fetch from a 'influencers' collection.
        // const influencersCollection = collection(db, 'influencers');
        // const influencerSnapshot = await getDocs(influencersCollection);
        // const influencersList = influencerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Influencer));
        // For now, we'll use an empty array.
        setInfluencers([]);
      } catch (error) {
        console.error("Error fetching influencers:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch influencer data.'
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencers();
  }, [toast]);
  
  const handleUpdateInfluencer = (influencerId: string, updates: Partial<Influencer>) => {
    // Placeholder for update logic
  };

  const handleDeleteInfluencer = async (influencerId: string) => {
    // Placeholder for delete logic
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Influencer Management</h1>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle>All Influencers</CardTitle>
                <CardDescription>View and manage influencers from your Firestore database.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Bulk Import
                </Button>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          <InfluencerManagementTable 
            influencers={influencers} 
            onUpdateInfluencer={handleUpdateInfluencer} 
            onDeleteInfluencer={handleDeleteInfluencer} 
            />
        </CardContent>
      </Card>
    </div>
  )
}
