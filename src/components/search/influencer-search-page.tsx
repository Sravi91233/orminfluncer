
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { searchInfluencers } from '@/ai/flows/search-influencers-flow';
import { getCachedInfluencers } from '@/ai/flows/get-cached-influencers-flow';
import type { AppCity, Influencer } from '@/types';
import { exportToCsv } from '@/lib/csv-export';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Download, LoaderCircle, Search, Youtube, Instagram, Briefcase, Maximize, User, MapPin, BarChart2, RefreshCw, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const searchFormSchema = z.object({
  city: z.string().optional(),
  category: z.string().optional(),
  platform: z.string().optional(),
  bio: z.string().optional(),
});

type SortKey = keyof Influencer;

const PlatformIcon = ({ platform }: { platform: Influencer['platform'] }) => {
    switch (platform?.toLowerCase()) {
        case 'instagram': return <Instagram className="h-4 w-4" />;
        case 'tiktok': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 8.35a4 4 0 1 0-8 0V17a4 4 0 1 0 8 0V8.35Z"></path><path d="M12 17v-4.65"></path></svg>;
        case 'youtube': return <Youtube className="h-4 w-4" />;
        default: return <Briefcase className="h-4 w-4" />;
    }
};

const uniquePlatforms: string[] = ["Instagram", "TikTok", "YouTube"];


export function InfluencerSearchPage() {
  const [results, setResults] = React.useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  
  const [availableCities, setAvailableCities] = React.useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);
  
  const [selectedInfluencer, setSelectedInfluencer] = React.useState<Influencer | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dataSource, setDataSource] = React.useState<'none' | 'cache' | 'live'>('none');

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { city: 'Any City', category: '', platform: 'any', bio: '' },
  });

  const selectedCity = form.watch('city');

  React.useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesCollection = collection(db, 'Cities');
        const citySnapshot = await getDocs(citiesCollection);
        const citiesList = citySnapshot.docs.map(doc => doc.data().name as string);
        setAvailableCities(citiesList.sort());
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch cities for search form.' });
      }
    };
    fetchCities();
  }, [toast]);
  
  React.useEffect(() => {
    const fetchCachedData = async () => {
        if (selectedCity && selectedCity !== 'Any City') {
            setIsSearching(true);
            setDataSource('none');
            setResults([]);
            try {
                const response = await getCachedInfluencers({ city: selectedCity });
                if (response.success) {
                    setResults(response.results);
                    setDataSource(response.results.length > 0 ? 'cache' : 'none');
                     if(response.results.length === 0) {
                        toast({ title: 'No cached results', description: 'No cached data found for this city. Try a live search.' });
                    }
                } else {
                    toast({ variant: 'destructive', title: 'Cache Fetch Failed', description: response.message });
                }
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch from cache.' });
            } finally {
                setIsSearching(false);
            }
        } else {
          setResults([]);
          setDataSource('none');
        }
    };
    fetchCachedData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);


  const handleSearchFromApi = async (values: z.infer<typeof searchFormSchema>, page = 1) => {
    if (page === 1) {
      setIsSearching(true);
      setResults([]); 
    } else {
      setIsLoadingMore(true);
    }
    
    const searchParams = { ...values, currentPage: page };
    if (searchParams.platform === 'any') {
      searchParams.platform = '';
    }
    
    try {
      const response = await searchInfluencers(searchParams);
      if (response.success) {
        setResults(prev => {
          const newResults = response.results || [];
          const combined = page === 1 ? newResults : [...prev, ...newResults];
          const uniqueResults = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return uniqueResults;
        });
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setDataSource('live');
      } else {
        toast({ variant: 'destructive', title: 'Search Failed', description: response.message });
        setResults([]);
      }
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'An unexpected error occurred.'});
        setResults([]);
    } finally {
        setIsSearching(false);
        setIsLoadingMore(false);
    }
  };

  const loadMoreResults = () => {
    if (currentPage < totalPages) {
      handleSearchFromApi(form.getValues(), currentPage + 1);
    }
  };
  
  const handleViewDetails = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setIsModalOpen(true);
  }

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleReset = () => {
    form.reset({ city: 'Any City', category: '', platform: 'any', bio: '' });
    setResults([]);
    setCurrentPage(1);
    setTotalPages(0);
    setDataSource('none');
  }

  const sortedResults = React.useMemo(() => {
    let sortableItems = [...results];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key] || 0;
        const bVal = b[sortConfig.key] || 0;

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [results, sortConfig]);

  const handleExport = () => {
    if (results.length === 0) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'No data to export.' });
      return;
    }
    exportToCsv(results, 'influencers.csv');
  };

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) return `${(followers / 1000000).toFixed(1)}M`;
    if (followers >= 1000) return `${(followers / 1000).toFixed(1)}K`;
    return followers;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Influencer Search</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(v => handleSearchFromApi(v, 1))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField name="city" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Any City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Any City">Any City</SelectItem>
                        {availableCities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}/>
                <FormField name="category" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., gaming, fashion, food" {...field} />
                    </FormControl>
                  </FormItem>
                )}/>
                <FormField name="platform" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Any Platform" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="any">Any Platform</SelectItem>
                        {uniquePlatforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}/>
                <FormField name="bio" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio / Description Contains</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., daily outfits" {...field} />
                    </FormControl>
                  </FormItem>
                )}/>
              </div>
              <div className="flex justify-end gap-2">
                 <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                  Search Live API
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Search Results</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CardDescription>{results.length} influencers found.</CardDescription>
                {dataSource === 'cache' && <Badge variant="secondary" className="gap-1"><Database className="h-3 w-3" />From Cache</Badge>}
                {dataSource === 'live' && <Badge variant="default" className="gap-1"><RefreshCw className="h-3 w-3" />Live Results</Badge>}
            </div>
          </div>
           <div className="flex items-center gap-2">
            {dataSource === 'cache' && (
               <Button variant="outline" size="sm" onClick={form.handleSubmit(v => handleSearchFromApi(v, 1))} disabled={isSearching}>
                 <RefreshCw className="mr-2 h-4 w-4"/>
                 Refresh from API
               </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExport} disabled={results.length === 0}>
              <Download className="mr-2 h-4 w-4"/>
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('handle')} className="cursor-pointer"><div className="flex items-center">Handle <ArrowUpDown className="ml-2 h-4 w-4" /></div></TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead onClick={() => handleSort('followers')} className="cursor-pointer"><div className="flex items-center">Followers <ArrowUpDown className="ml-2 h-4 w-4" /></div></TableHead>
                  <TableHead onClick={() => handleSort('engagementRate')} className="cursor-pointer"><div className="flex items-center">Eng. Rate <ArrowUpDown className="ml-2 h-4 w-4" /></div></TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSearching ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : sortedResults.length > 0 ? (
                  sortedResults.map((influencer) => (
                    <TableRow key={influencer.id} className="cursor-pointer" onClick={() => handleViewDetails(influencer)}>
                      <TableCell className="font-medium">{influencer.handle}</TableCell>
                      <TableCell><Badge variant="outline" className="flex items-center gap-2 capitalize"><PlatformIcon platform={influencer.platform} /> {influencer.platform}</Badge></TableCell>
                      <TableCell>{formatFollowers(influencer.followers)}</TableCell>
                      <TableCell>{influencer.engagementRate.toFixed(2)}%</TableCell>
                      <TableCell className="max-w-xs truncate">{influencer.bio}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleViewDetails(influencer); }}>
                            <Maximize className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found. Try adjusting your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {dataSource === 'live' && currentPage < totalPages && (
            <div className="flex items-center justify-center pt-4">
              <Button
                variant="outline"
                onClick={loadMoreResults}
                disabled={isLoadingMore}
              >
                {isLoadingMore && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Load More Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedInfluencer && (
            <>
              <DialogHeader>
                 <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedInfluencer.handle}`} />
                        <AvatarFallback>{selectedInfluencer.handle.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <DialogTitle className="text-2xl">{selectedInfluencer.handle}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 mt-1 capitalize">
                          <PlatformIcon platform={selectedInfluencer.platform} /> {selectedInfluencer.platform}
                        </DialogDescription>
                    </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <p className="text-sm text-muted-foreground">{selectedInfluencer.bio}</p>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <div>
                            <p className="font-semibold">{formatFollowers(selectedInfluencer.followers)}</p>
                            <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-primary" />
                        <div>
                            <p className="font-semibold">{selectedInfluencer.engagementRate.toFixed(2)}%</p>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <div>
                            <p className="font-semibold">{selectedInfluencer.city}, {selectedInfluencer.country}</p>
                            <p className="text-xs text-muted-foreground">Location</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <div>
                            <p className="font-semibold">{selectedInfluencer.category}</p>
                            <p className="text-xs text-muted-foreground">Category</p>
                        </div>
                    </div>
                 </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
