'use client';

import * as React from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CityManagementTable } from './city-management-table';
import type { AppCity } from '@/types';
import { PageLoading } from '../layout/page-loading';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Download, Upload, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CityForm } from './city-form';
import Papa from 'papaparse';

export function CityManagement() {
  const [cities, setCities] = React.useState<AppCity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingCity, setEditingCity] = React.useState<AppCity | null>(null);

  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchCities = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const citiesCollection = collection(db, 'Cities');
      const citySnapshot = await getDocs(citiesCollection);
      const citiesList = citySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppCity));
      setCities(citiesList);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch city data.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleAddCity = async (data: { name: string; state: string }) => {
    try {
      await addDoc(collection(db, 'Cities'), data);
      toast({ title: 'City Added', description: `${data.name} has been added.` });
      fetchCities();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding city: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add city.' });
    }
  };

  const handleUpdateCity = async (cityId: string, data: { name: string; state: string }) => {
    try {
      const cityRef = doc(db, 'Cities', cityId);
      await updateDoc(cityRef, data);
      toast({ title: 'City Updated', description: `${data.name} has been updated.` });
      fetchCities();
      setIsFormOpen(false);
      setEditingCity(null);
    } catch (error) {
      console.error("Error updating city: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update city.' });
    }
  };

  const handleDeleteCity = async (cityId: string) => {
    try {
      await deleteDoc(doc(db, 'Cities', cityId));
      toast({ title: 'City Deleted', description: 'The city has been removed.' });
      fetchCities();
    } catch (error) {
      console.error("Error deleting city: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete city.' });
    }
  };

  const handleDownloadTemplate = () => {
    const csv = 'City,State\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'cities_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const uploadedCities = results.data as { City: string; State: string }[];
          try {
            for (const cityData of uploadedCities) {
                if(cityData.City && cityData.State) {
                    await addDoc(collection(db, 'Cities'), { name: cityData.City, state: cityData.State });
                }
            }
            toast({ title: 'Upload Successful', description: 'Cities have been imported.' });
            fetchCities();
          } catch (error) {
            console.error('Error importing cities:', error);
            toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not import cities.' });
          }
        },
        error: (error: any) => {
          toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
        },
      });
    }
  };


  const openEditDialog = (city: AppCity) => {
    setEditingCity(city);
    setIsFormOpen(true);
  };

  const openAddDialog = () => {
    setEditingCity(null);
    setIsFormOpen(true);
  }

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">City Management</h1>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>All Cities</CardTitle>
            <CardDescription>Add, edit, or delete cities for influencer searches.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
             <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CityManagementTable
            cities={cities}
            onEdit={openEditDialog}
            onDelete={handleDeleteCity}
          />
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingCity ? 'Edit City' : 'Add New City'}</DialogTitle>
                <DialogDescription>
                    {editingCity ? `Update the details for ${editingCity.name}.` : 'Enter the details for the new city.'}
                </DialogDescription>
            </DialogHeader>
            <CityForm 
                onSubmit={editingCity ? (data) => handleUpdateCity(editingCity.id, data) : handleAddCity}
                initialData={editingCity}
                onCancel={() => setIsFormOpen(false)}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
