'use client';

import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/app-layout';
import { PageLoading } from '@/components/layout/page-loading';
import { InfluencerSearchPage } from '@/components/search/influencer-search-page';

export default function SearchPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <PageLoading />;
  }

  return (
    <AppLayout>
      <InfluencerSearchPage />
    </AppLayout>
  );
}
