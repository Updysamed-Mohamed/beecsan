import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, TrendingUp } from 'lucide-react';

export default function SuccessStoriesPage() {
  const stories = [
    {
      name: 'Sarah M.',
      title: 'Furniture Seller',
      story: 'I sold my unused furniture collection within two weeks. The process was smooth and I was able to declutter my home while earning extra cash.',
      rating: 5,
      sales: 12,
    },
    {
      name: 'Ahmed K.',
      title: 'Electronics Buyer',
      story: 'Found an amazing deal on a like-new laptop that I\'ve been using for months. Great communication with the seller made the entire experience trustworthy.',
      rating: 5,
      sales: 0,
    },
    {
      name: 'Lisa T.',
      title: 'Regular Seller',
      story: 'Beecsan has become my go-to platform for selling items. The messaging system is reliable and I\'ve built great relationships with repeat customers.',
      rating: 5,
      sales: 34,
    },
    {
      name: 'Mohammed H.',
      title: 'Side Business Owner',
      story: 'Started selling collectibles on Beecsan as a side hustle. Now I make consistent income by offering quality items at fair prices.',
      rating: 5,
      sales: 56,
    },
  ];

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
          <h1 className="font-bold text-foreground uppercase tracking-tight">Success Stories</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Real Stories from Our Community</h2>
          <p className="text-lg text-muted-foreground">
            See how thousands of users have successfully bought and sold on Beecsan. Your story could be next.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {stories.map((story, idx) => (
            <div key={idx} className="bg-surface rounded-2xl border border-border p-8">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{story.name}</h3>
                    <p className="text-sm text-primary font-semibold">{story.title}</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground italic">&quot;{story.story}&quot;</p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                {story.sales > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{story.sales} sales</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground ml-auto">Verified User</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">By The Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">50K+</p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">100K+</p>
              <p className="text-muted-foreground">Successful Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">4.8/5</p>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-surface rounded-2xl border border-border p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">Success Tips</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-primary">
                1
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Create Clear Listings</h4>
                <p className="text-muted-foreground">Include detailed descriptions, clear photos, and honest condition information. This attracts serious buyers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-primary">
                2
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Respond Quickly</h4>
                <p className="text-muted-foreground">Fast communication builds buyer confidence. Reply promptly to questions and inquiries.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-primary">
                3
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Meet Safely</h4>
                <p className="text-muted-foreground">Always meet in public places. Use our safety guidelines to ensure secure transactions.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-primary">
                4
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Build Your Reputation</h4>
                <p className="text-muted-foreground">Positive ratings and reviews help you become a trusted seller. Deliver quality and fairness.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Share Your Success?</h3>
          <p className="text-muted-foreground mb-6">
            Start buying and selling on Beecsan today and become part of our success stories.
          </p>
          <Link href="/auth/register">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold rounded-xl">
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
