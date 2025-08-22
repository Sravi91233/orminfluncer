'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { InfluencerSearchPage } from '@/components/search/influencer-search-page';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <InfluencerSearchPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
