import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Users, Zap } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto h-full flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-bold text-foreground uppercase tracking-tight">About Beecsan</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">About Beecsan</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Beecsan is a modern peer-to-peer marketplace that connects buyers and sellers in your local community. We believe in making buying and selling easy, safe, and transparent for everyone.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Our Mission
          </h3>
          <p className="text-lg text-muted-foreground">
            To create the most trusted and user-friendly marketplace for buying and selling items locally. We empower individuals to connect, transact safely, and build trust in their communities through transparent communication and secure transactions.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h4 className="text-lg font-bold text-foreground mb-3">Trust & Safety</h4>
              <p className="text-muted-foreground">
                We prioritize user safety with verified profiles, secure transactions, and dedicated support to prevent fraud.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h4 className="text-lg font-bold text-foreground mb-3">Transparency</h4>
              <p className="text-muted-foreground">
                Clear communication and honest listings help buyers and sellers make informed decisions with confidence.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h4 className="text-lg font-bold text-foreground mb-3">Community</h4>
              <p className="text-muted-foreground">
                We foster connections between neighbors and support local economies by enabling direct peer-to-peer transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Beecsan */}
        <div className="bg-surface rounded-2xl border border-border p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Why Choose Beecsan?
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Free to List</p>
                <p className="text-sm text-muted-foreground">Post as many items as you want with no listing fees</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Easy Communication</p>
                <p className="text-sm text-muted-foreground">Built-in messaging system for safe buyer-seller interaction</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Local Focus</p>
                <p className="text-sm text-muted-foreground">Connect with buyers and sellers in your community</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Safety Features</p>
                <p className="text-sm text-muted-foreground">Verified profiles and safety guidelines protect all users</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Wide Selection</p>
                <p className="text-sm text-muted-foreground">Browse thousands of items across multiple categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            Join Our Community
          </h3>
          <p className="text-muted-foreground mb-6">
            Start buying and selling on Beecsan today. Thousands of users already trust us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold rounded-xl">
                Get Started
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="px-8 h-12 font-bold rounded-xl border-primary text-primary hover:bg-primary/5 bg-transparent">
                Browse Listings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
