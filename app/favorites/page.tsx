'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ArrowLeft, Trash2, MapPin, Star, Search } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import type { Product, User } from '@/lib/types';
import Link from 'next/link';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<(Product & { seller?: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // 2. Listen to Favorites (Real-time)
  useEffect(() => {
    if (!user?.uid) return;

    // Waxaan ka akhrinaynaa collection-ka cusub ee 'favorites'
    const favRef = doc(db, 'favorites', user.uid);
    
    const unsubscribe = onSnapshot(favRef, async (docSnap) => {
      if (docSnap.exists()) {
        const productIds = docSnap.data().productIds || [];
        await fetchProductDetails(productIds);
      } else {
        setFavoriteProducts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Fetch Details for each Product ID
  const fetchProductDetails = async (ids: string[]) => {
    try {
      setLoading(true);
      const productsData: any[] = [];

      for (const id of ids) {
        const pSnap = await getDoc(doc(db, 'products', id));
        if (pSnap.exists()) {
          const pData = { id: pSnap.id, ...pSnap.data() } as Product;
          
          // Fetch Seller Info
          if (pData.sellerId) {
            const sSnap = await getDoc(doc(db, 'users', pData.sellerId));
            if (sSnap.exists()) {
              (pData as any).seller = sSnap.data();
            }
          }
          productsData.push(pData);
        }
      }
      setFavoriteProducts(productsData);
    } catch (err) {
      console.error("Error fetching fav details:", err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Remove Favorite Function
  const handleRemoveFavorite = async (productId: string) => {
    if (!user) return;
    try {
      const favRef = doc(db, 'favorites', user.uid);
      const updatedIds = favoriteProducts
        .filter(p => p.id !== productId)
        .map(p => p.id);
      
      await setDoc(favRef, { productIds: updatedIds }, { merge: true });
      // UI-ga waxaa update gareynaya onSnapshot-ka kore
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const getSortedAndFiltered = () => {
    let filtered = favoriteProducts.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'price-low') return filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-high') return filtered.sort((a, b) => Number(b.price) - Number(a.price));
    return filtered; // recent (default)
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFC]">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Favorites</p>
      </div>
    );
  }

  const sorted = getSortedAndFiltered();

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">My Favorites</h1>
          </div>
          <span className="text-xs font-black bg-slate-100 px-3 py-1.5 rounded-full text-slate-500">{sorted.length} ITEMS</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {favoriteProducts.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <Heart className="w-16 h-16 text-slate-100 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your list is empty</h2>
            <p className="text-slate-500 mb-8 text-sm">Save items you're interested in to see them here.</p>
            <Button className="bg-slate-900 text-white rounded-full px-8" onClick={() => router.push('/')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none"
              >
                <option value="recent">Newest Saved</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* List */}
            <div className="grid gap-4">
              {sorted.map((product) => (
                <div key={product.id} className="group relative flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-[32px] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                  <Link href={`/listings/${product.id}`} className="shrink-0 w-full sm:w-40 h-40 rounded-[24px] overflow-hidden bg-slate-50">
                    <img
                      src={product.image_urls?.[0] || '/placeholder.jpg'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={product.title}
                    />
                  </Link>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>{product.category}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-slate-400">{product.city}</span>
                    </div>
                    <Link href={`/listings/${product.id}`}>
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1 hover:text-primary transition-colors">{product.title}</h3>
                    </Link>
                    {product.seller && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-500">
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                           {product.seller.fullName?.charAt(0) || 'U'}
                         </div>
                         {product.seller.fullName}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto sm:border-l border-slate-50 sm:pl-8">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                      <p className="text-2xl font-black text-slate-900">${product.price}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}