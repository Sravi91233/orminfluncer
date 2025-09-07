
'use client';

import Link from 'next/link';
import { Bot, BarChart, Search, FileDown, ArrowRight, CheckCircle, Target, Lightbulb, ShoppingBag, Building, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoading } from '@/components/layout/page-loading';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-40 lg:py-56 bg-card">
          <div className="absolute inset-0 z-0">
             <Image
                src="https://picsum.photos/1600/900"
                alt="Marketing campaign"
                fill
                className="object-cover"
                data-ai-hint="social media marketing"
              />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-7xl">
                The Intelligence Behind Influencer Marketing
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-primary-foreground/80 md:text-xl">
                Stop guessing. Start collaborating. Our AI-driven platform surfaces the perfect influencers for your brand, backed by data-driven insights and analytics to maximize your ROI.
              </p>
              <Button asChild size="lg">
                <Link href="/signup">
                  Find Your First Influencer <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-16">
               <span className="text-primary font-semibold uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Smarter Way to Scale Influence</h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                We provide the data, tools, and intelligence you need to build successful, scalable influencer campaigns.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border shadow-sm transition-all hover:shadow-primary/20 hover:scale-105">
                <Search className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Precision Search</h3>
                <p className="text-muted-foreground">
                  Go beyond basic filters. Find influencers by location, niche, audience demographics, engagement rate, keywords, and more.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border shadow-sm transition-all hover:shadow-primary/20 hover:scale-105">
                <BarChart className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Deep Analytics</h3>
                <p className="text-muted-foreground">
                  Access rich profiles with key metrics, audience credibility scores, and performance history to make data-backed decisions.
                </p>
              </div>
                <div className="flex flex-col items-center text-center p-6 rounded-lg border shadow-sm transition-all hover:shadow-primary/20 hover:scale-105">
                <Lightbulb className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">AI-Powered Suggestions</h3>
                <p className="text-muted-foreground">
                  Our algorithm analyzes your search and suggests lookalike influencers and hidden gems you might have missed.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border shadow-sm transition-all hover:shadow-primary/20 hover:scale-105">
                <FileDown className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Seamless Exports</h3>
                <p className="text-muted-foreground">
                  Easily export your curated lists to CSV to integrate with your existing marketing workflows and outreach tools.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Use Cases Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-16">
               <span className="text-primary font-semibold uppercase tracking-wider">Built For Growth</span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powering Every Aspect of Your Strategy</h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                Whether you're a nimble startup or a global agency, our platform is designed to fit your unique influencer marketing needs.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-4">
                  <Image src="https://picsum.photos/600/400?random=1" alt="E-commerce" width={600} height={400} className="rounded-lg object-cover" data-ai-hint="e-commerce website" />
                  <div className="flex items-center gap-3"><ShoppingBag className="h-6 w-6 text-primary" /> <h3 className="text-2xl font-bold">E-commerce Brands</h3></div>
                  <p className="text-muted-foreground">Drive sales and brand awareness by finding influencers whose audience matches your ideal customer profile perfectly.</p>
              </div>
              <div className="space-y-4">
                  <Image src="https://picsum.photos/600/400?random=2" alt="Marketing Agency" width={600} height={400} className="rounded-lg object-cover" data-ai-hint="marketing agency" />
                  <div className="flex items-center gap-3"><Building className="h-6 w-6 text-primary" /> <h3 className="text-2xl font-bold">Marketing Agencies</h3></div>
                  <p className="text-muted-foreground">Streamline campaign workflows, discover talent for your clients, and generate reports with compelling data.</p>
              </div>
              <div className="space-y-4">
                  <Image src="https://picsum.photos/600/400?random=3" alt="Startup" width={600} height={400} className="rounded-lg object-cover" data-ai-hint="startup office" />
                  <div className="flex items-center gap-3"><Rocket className="h-6 w-6 text-primary" /> <h3 className="text-xl font-bold">Startups & SMBs</h3></div>
                  <p className="text-muted-foreground">Find high-impact, cost-effective micro-influencers to build buzz and acquire your first customers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Marketing Leaders</h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                See what our users are saying about the platform.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">"Influencer Finder has been a game-changer for our agency. We've cut our discovery time in half and the quality of influencers we find is unmatched."</p>
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarImage src="https://i.pravatar.cc/150?u=a" /><AvatarFallback>SM</AvatarFallback></Avatar>
                    <div><p className="font-semibold">Sarah M.</p><p className="text-sm text-muted-foreground">Marketing Director</p></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">"The data and analytics are incredibly detailed. We can now confidently invest in partnerships, knowing we'll see a positive ROI. A must-have tool."</p>
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarImage src="https://i.pravatar.cc/150?u=b" /><AvatarFallback>DJ</AvatarFallback></Avatar>
                    <div><p className="font-semibold">David J.</p><p className="text-sm text-muted-foreground">E-commerce Founder</p></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">"As a startup, we needed to be scrappy. This platform helped us find affordable micro-influencers who drove significant initial traction for our app."</p>
                   <div className="flex items-center gap-3">
                    <Avatar><AvatarImage src="https://i.pravatar.cc/150?u=c" /><AvatarFallback>AL</AvatarFallback></Avatar>
                    <div><p className="font-semibold">Anna L.</p><p className="text-sm text-muted-foreground">Startup CEO</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Final CTA Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Revolutionize Your Outreach?</h2>
            <p className="max-w-md mx-auto text-muted-foreground mt-4">
                Join hundreds of brands and agencies finding success. Sign up today and get your first search completely free.
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
      
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Influencer Finder</span>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0 text-sm">
                  <Link href="#" className="text-muted-foreground hover:text-primary">Features</Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary">Pricing</Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary">Terms</Link>
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
