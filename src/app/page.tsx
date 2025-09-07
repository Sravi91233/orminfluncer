
'use client';

import Link from 'next/link';
import { Bot, BarChart, Search, FileDown, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoading } from '@/components/layout/page-loading';
import Image from 'next/image';

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

  if (loading || user) {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Influencer Finder</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="absolute inset-0 z-0">
             <Image
                src="https://picsum.photos/1600/900"
                alt="Marketing campaign"
                fill
                className="object-cover"
                data-ai-hint="social media marketing"
              />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Find Your Perfect Influencer Match
              </h1>
              <p className="max-w-xl mx-auto text-lg text-primary-foreground/80">
                Our powerful AI-driven platform connects you with the ideal influencers for your brand, saving you time and maximizing your marketing impact.
              </p>
              <Button asChild size="lg">
                <Link href="/signup">
                  Start Your Free Search <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Us?</h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                We provide the tools you need to build successful influencer campaigns.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border shadow-sm">
                <Search className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Smart Search</h3>
                <p className="text-muted-foreground">
                  Quickly find influencers by location, category, follower count, and more with our advanced filters.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border shadow-sm">
                <BarChart className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Analyze influencer profiles with key metrics like engagement rate and follower demographics to make informed decisions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border shadow-sm">
                <FileDown className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">CSV Exports</h3>
                <p className="text-muted-foreground">
                  Easily export your search results to CSV to integrate with your existing marketing workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

         {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get Started in 3 Easy Steps</h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Launch your next campaign in minutes.
              </p>
            </div>
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="text-muted-foreground">Create your free account in seconds to get started.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold">Search & Discover</h3>
                <p className="text-muted-foreground">Use our powerful filters to find influencers that match your criteria.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold">Analyze & Export</h3>
                <p className="text-muted-foreground">Review profiles and export data to launch your campaign.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Find Your Next Influencer?</h2>
            <p className="max-w-md mx-auto text-muted-foreground mt-4">
                Join now and take the guesswork out of influencer marketing.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="/signup">
                  Sign Up for Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Influencer Finder</span>
                </div>
                 <p className="text-sm text-muted-foreground mt-4 md:mt-0">
                    &copy; 2024 Influencer Finder. All rights reserved.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}
