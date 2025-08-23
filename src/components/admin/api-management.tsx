'use client';

import * as React from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiManagementTable } from './api-management-table';
import type { ApiKey } from '@/types';
import { PageLoading } from '../layout/page-loading';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ApiKeyForm } from './api-key-form';

export function ApiManagement() {
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingApiKey, setEditingApiKey] = React.useState<ApiKey | null>(null);

  const { toast } = useToast();

  const fetchApiKeys = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const keysCollection = collection(db, 'APIKeys');
      const keySnapshot = await getDocs(keysCollection);
      const keysList = keySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApiKey));
      setApiKeys(keysList);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch API key data.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleAddApiKey = async (data: { serviceName: string; keyValue: string }) => {
    try {
      await addDoc(collection(db, 'APIKeys'), { ...data, status: 'active', lastUsed: serverTimestamp() });
      toast({ title: 'API Key Added', description: `${data.serviceName} key has been added.` });
      fetchApiKeys();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding API key: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add API key.' });
    }
  };

  const handleUpdateApiKey = async (keyId: string, data: { serviceName: string; keyValue: string }) => {
    try {
      const keyRef = doc(db, 'APIKeys', keyId);
      await updateDoc(keyRef, data);
      toast({ title: 'API Key Updated', description: `${data.serviceName} key has been updated.` });
      fetchApiKeys();
      setIsFormOpen(false);
      setEditingApiKey(null);
    } catch (error) {
      console.error("Error updating API key: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update API key.' });
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      await deleteDoc(doc(db, 'APIKeys', keyId));
      toast({ title: 'API Key Deleted', description: 'The API key has been removed.' });
      fetchApiKeys();
    } catch (error) {
      console.error("Error deleting API key: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete API key.' });
    }
  };

  const openEditDialog = (apiKey: ApiKey) => {
    setEditingApiKey(apiKey);
    setIsFormOpen(true);
  };

  const openAddDialog = () => {
    setEditingApiKey(null);
    setIsFormOpen(true);
  }

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API Management</h1>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>External API Keys</CardTitle>
            <CardDescription>Manage keys for services like Instagram, YouTube, etc.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ApiManagementTable
            apiKeys={apiKeys}
            onEdit={openEditDialog}
            onDelete={handleDeleteApiKey}
          />
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingApiKey ? 'Edit API Key' : 'Add New API Key'}</DialogTitle>
                <DialogDescription>
                    {editingApiKey ? `Update the details for the ${editingApiKey.serviceName} key.` : 'Enter the details for the new API key.'}
                </DialogDescription>
            </DialogHeader>
            <ApiKeyForm 
                onSubmit={editingApiKey ? (data) => handleUpdateApiKey(editingApiKey.id, data) : handleAddApiKey}
                initialData={editingApiKey}
                onCancel={() => setIsFormOpen(false)}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
