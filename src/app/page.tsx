'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);


  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Bot className="h-6 w-6" />
          <span className="sr-only">Influencer Finder</span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2">
            <Bot className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Influencer Finder
            </h1>
          </div>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Find and analyze influencers with smart search
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
          <Button asChild size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Influencer Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
