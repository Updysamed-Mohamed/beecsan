import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Search } from 'lucide-react';

export default function PriceCheckerPage() {
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
          <h1 className="font-bold text-foreground uppercase tracking-tight">Price Checker</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Check Market Prices</h2>
          <p className="text-lg text-muted-foreground">
            Research market prices to help you find fair deals or price your items competitively.
          </p>
        </div>

        {/* Price Guide Section */}
        <div className="bg-surface rounded-2xl border border-border p-8 mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            How to Research Prices
          </h3>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-6">
              <h4 className="font-bold text-foreground mb-2 text-lg">1. Browse Similar Listings</h4>
              <p className="text-muted-foreground">
                Search for the same item or similar products on Beecsan to see what others are asking. Filter by condition and location to find comparable items.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6">
              <h4 className="font-bold text-foreground mb-2 text-lg">2. Check Multiple Categories</h4>
              <p className="text-muted-foreground">
                Items may be listed across different categories. Check all relevant sections to get a complete picture of market pricing.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6">
              <h4 className="font-bold text-foreground mb-2 text-lg">3. Consider Condition</h4>
              <p className="text-muted-foreground">
                Prices vary significantly based on condition. Compare items in similar condition to get an accurate price range.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6">
              <h4 className="font-bold text-foreground mb-2 text-lg">4. Factor in Location</h4>
              <p className="text-muted-foreground">
                Prices may differ by region. Compare listings in your area for local market insights.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Tips */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Pricing Tips for Sellers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-foreground mb-3">Price Competitively</h4>
              <p className="text-sm text-muted-foreground">
                Research market rates before setting your price. Competitive pricing attracts more buyers and sells faster.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">Be Realistic About Condition</h4>
              <p className="text-sm text-muted-foreground">
                Price items based on their actual condition. New items command higher prices than used ones.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">Consider Supply & Demand</h4>
              <p className="text-sm text-muted-foreground">
                Popular items may support higher prices. Less common items should be priced accordingly.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">Factor in Platform Fees</h4>
              <p className="text-sm text-muted-foreground">
                Remember that some transaction fees apply. Price high enough to account for these costs.
              </p>
            </div>
          </div>
        </div>

        {/* Common Categories */}
        <div className="bg-surface rounded-2xl border border-border p-8 mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Price Guides by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Electronics', note: 'Check recent model prices and specifications' },
              { name: 'Furniture', note: 'Compare by style, size, and condition' },
              { name: 'Clothing', note: 'Factor in brand, size, and trend' },
              { name: 'Vehicles', note: 'Consider age, mileage, and features' },
              { name: 'Services', note: 'Research industry standard rates' },
            ].map((cat) => (
              <div key={cat.name} className="p-4 bg-muted/30 rounded-xl">
                <p className="font-bold text-foreground">{cat.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{cat.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search CTA */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <Search className="w-6 h-6" />
            Start Your Research
          </h3>
          <p className="text-muted-foreground mb-6">
            Browse market listings to research fair prices for items you're buying or selling.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold rounded-xl">
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
