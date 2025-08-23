'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { suggestSearchTerms } from '@/ai/flows/suggest-search-terms';
import type { Influencer } from '@/types';
import { influencers } from '@/lib/mock-data';
import { exportToCsv } from '@/lib/csv-export';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Download, LoaderCircle, Search, Twitter, Youtube, Instagram, Briefcase, Maximize, User, MapPin, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSearchParams } from 'next/navigation';

const searchFormSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  category: z.string().optional(),
  followerCount: z.coerce.number().min(0).optional(),
  currentSearchTerms: z.string().optional(),
});

type SortKey = keyof Influencer;

const PlatformIcon = ({ platform }: { platform: Influencer['platform'] }) => {
    switch (platform) {
        case 'Instagram': return <Instagram className="h-4 w-4" />;
        case 'TikTok': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 8.35a4 4 0 1 0-8 0V17a4 4 0 1 0 8 0V8.35Z"></path><path d="M12 17v-4.65"></path></svg>;
        case 'YouTube': return <Youtube className="h-4 w-4" />;
        default: return <Briefcase className="h-4 w-4" />;
    }
}

export function InfluencerSearchPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = React.useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);
  const resultsPerPage = 10;
  
  const [selectedInfluencer, setSelectedInfluencer] = React.useState<Influencer | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { city: '', country: '', category: '', followerCount: 0, currentSearchTerms: searchParams.get('q') || '' },
  });
  
  React.useEffect(() => {
    if (form.getValues('currentSearchTerms')) {
      handleSearch(form.getValues());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (values: z.infer<typeof searchFormSchema>) => {
    setIsLoading(true);
    setIsAiLoading(true);
    setSuggestions([]);

    // Simulate API call for search
    setTimeout(() => {
      let filtered = influencers;
      if (values.city) {
        filtered = filtered.filter((i) => i.city.toLowerCase().includes(values.city!.toLowerCase()));
      }
      if (values.country) {
        filtered = filtered.filter((i) => i.country?.toLowerCase().includes(values.country!.toLowerCase()));
      }
      if (values.category) {
        filtered = filtered.filter((i) => i.category === values.category);
      }
      if (values.followerCount) {
        filtered = filtered.filter((i) => i.followers >= values.followerCount!);
      }
      if (values.currentSearchTerms) {
        const terms = values.currentSearchTerms.toLowerCase().split(' ');
        filtered = filtered.filter((i) => terms.every(term => 
          i.handle.toLowerCase().includes(term) || i.bio.toLowerCase().includes(term)
        ));
      }
      setResults(filtered);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);

    // AI Suggestions
    try {
      const aiResult = await suggestSearchTerms(values);
      setSuggestions(aiResult.suggestedSearchTerms);
    } catch (error) {
      console.error('AI suggestion error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not fetch search suggestions.',
      });
    } finally {
      setIsAiLoading(false);
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

  const sortedResults = React.useMemo(() => {
    let sortableItems = [...results];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [results, sortConfig]);

  const paginatedResults = sortedResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
  const totalPages = Math.ceil(results.length / resultsPerPage);

  const handleSuggestionClick = (suggestion: string) => {
    const currentTerms = form.getValues('currentSearchTerms');
    form.setValue('currentSearchTerms', `${currentTerms} ${suggestion}`.trim());
    form.handleSubmit(handleSearch)();
  };

  const handleExport = () => {
    if (results.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'No data to export.',
      });
      return;
    }
    exportToCsv(results, 'influencers.csv');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Influencer Search</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSearch)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
              <FormField name="currentSearchTerms" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. vegan lifestyle" {...field} />
                  </FormControl>
                </FormItem>
              )}/>
              <FormField name="city" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New York" {...field} />
                  </FormControl>
                </FormItem>
              )}/>
              <FormField name="country" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. USA" {...field} />
                  </FormControl>
                </FormItem>
              )}/>
              <FormField name="category" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}/>
              <FormField name="followerCount" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Followers</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 10000" {...field} />
                  </FormControl>
                </FormItem>
              )}/>
              <div className="lg:col-span-full flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                  Search
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isAiLoading || suggestions.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              AI Suggestions
              {isAiLoading && <LoaderCircle className="h-4 w-4 animate-spin text-primary" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-accent" onClick={() => handleSuggestionClick(s)}>{s}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>{results.length} influencers found.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={results.length === 0}>
            <Download className="mr-2 h-4 w-4"/>
            Export CSV
          </Button>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : paginatedResults.length > 0 ? (
                  paginatedResults.map((influencer) => (
                    <TableRow key={influencer.id} className="cursor-pointer" onClick={() => handleViewDetails(influencer)}>
                      <TableCell className="font-medium">{influencer.handle}</TableCell>
                      <TableCell><Badge variant="outline" className="flex items-center gap-2"><PlatformIcon platform={influencer.platform} /> {influencer.platform}</Badge></TableCell>
                      <TableCell>{(influencer.followers / 1000).toFixed(1)}k</TableCell>
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
                      No results found. Try a different search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
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
                        <AvatarFallback>{selectedInfluencer.handle.substring(1,3).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <DialogTitle className="text-2xl">{selectedInfluencer.handle}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 mt-1">
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
                            <p className="font-semibold">{(selectedInfluencer.followers / 1000).toFixed(1)}k</p>
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
