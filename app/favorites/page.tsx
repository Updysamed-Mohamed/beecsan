'use client';

import { useState } from 'react';
import Header from '@/components/header';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ListingCard from '@/components/listing-card';
import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock favorites data
const mockFavorites = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max - Excellent Condition',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1592286927505-1fe25fb4fda3?w=400&h=400&fit=crop',
    location: 'San Francisco, CA',
    date: '2 hours ago',
    category: 'Electronics',
  },
  {
    id: '2',
    title: 'Modern Apartment - 2BR/2BA Downtown',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop',
    location: 'New York, NY',
    date: '1 day ago',
    category: 'Real Estate',
  },
  {
    id: '4',
    title: 'Vintage Leather Sofa - Mid Century Modern',
    price: 450,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    location: 'Seattle, WA',
    date: '2 days ago',
    category: 'Furniture',
  },
  {
    id: '6',
    title: 'iPad Air 5th Gen - Rose Gold',
    price: 550,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=400&fit=crop',
    location: 'Boston, MA',
    date: '4 hours ago',
    category: 'Electronics',
  },
];

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent');

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">Please log in to view your favorites</p>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const getSortedFavorites = () => {
    const sorted = [...favorites];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'recent':
      default:
        return sorted;
    }
  };

  const sortedFavorites = getSortedFavorites();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Heart className="w-8 h-8 text-destructive fill-destructive" />
              My Favorites
            </h1>
            <p className="text-muted-foreground">
              {favorites.length} item{favorites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {favorites.length > 0 && (
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">No Favorites Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding items to your favorites to save them for later
            </p>
            <Button asChild>
              <Link href="/">Browse Listings</Link>
            </Button>
          </Card>
        ) : (
          <>
            {/* List View */}
            <div className="mb-8">
              <div className="space-y-2">
                {sortedFavorites.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
                  >
                    <Link href={`/listings/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-24 h-24 rounded object-cover hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/listings/${item.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.location} • {item.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${item.price.toLocaleString()}</p>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid View Toggle */}
            <div className="text-center py-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Show as Grid</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortedFavorites.map((item) => (
                  <ListingCard
                    key={item.id}
                    {...item}
                    isFavorite={true}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
