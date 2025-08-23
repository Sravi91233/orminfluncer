'use client';

import * as React from 'react';
import type { Influencer } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface InfluencerManagementTableProps {
  influencers: Influencer[];
  onUpdateInfluencer: (influencerId: string, updates: Partial<Influencer>) => void;
  onDeleteInfluencer: (influencerId: string) => void;
}

export function InfluencerManagementTable({ influencers, onUpdateInfluencer, onDeleteInfluencer }: InfluencerManagementTableProps) {
  const { toast } = useToast();
  const [influencerToDelete, setInfluencerToDelete] = React.useState<Influencer | null>(null);

  const confirmDeleteInfluencer = () => {
    if (influencerToDelete && influencerToDelete.id) {
      onDeleteInfluencer(influencerToDelete.id.toString());
      toast({
        title: 'Influencer Deleted',
        description: `${influencerToDelete.handle} has been removed.`,
      });
      setInfluencerToDelete(null);
    }
  };

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) return `${(followers / 1000000).toFixed(1)}M`;
    if (followers >= 1000) return `${(followers / 1000).toFixed(1)}K`;
    return followers;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Handle</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Eng. Rate</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {influencers.length > 0 ? (
              influencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell className="font-medium">{influencer.handle}</TableCell>
                  <TableCell>{influencer.platform}</TableCell>
                  <TableCell>{formatFollowers(influencer.followers)}</TableCell>
                  <TableCell>{influencer.engagementRate.toFixed(2)}%</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{influencer.category}</Badge>
                  </TableCell>
                  <TableCell>{influencer.country}</TableCell>
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
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Approve</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Reject</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500 focus:bg-red-50"
                          onClick={() => setInfluencerToDelete(influencer)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No influencers found. Add some to your Firestore database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!influencerToDelete} onOpenChange={(isOpen) => !isOpen && setInfluencerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the influencer's record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInfluencerToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInfluencer}>Yes, delete influencer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
