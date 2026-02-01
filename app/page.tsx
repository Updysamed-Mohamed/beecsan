
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { 
  Heart, Search, Plus, MessageCircle, MapPin, 
  Star, Zap, Shield, LayoutGrid, ChevronRight, X 
} from 'lucide-react';

interface AdBanner {
  id: string;
  title?: string;
  image?: string;
  url?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onFavoriteToggle: (id: string) => void;
}

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'electronics', label: 'Electronics', emoji: '📱' },
    { id: 'furniture', label: 'Furniture', emoji: '🪑' },
    { id: 'clothing', label: 'Clothing', emoji: '👕' },
    { id: 'vehicles', label: 'Vehicles', emoji: '🚗' },
    { id: 'services', label: 'Services', emoji: '🔧' },
    { id: 'other', label: 'Other', emoji: '📦' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodQ = query(collection(db, 'products'), orderBy('created_at', 'desc'), limit(20));
        const adsQ = query(collection(db, 'adsBanner'));
        const [prodSnap, adsSnap] = await Promise.all([getDocs(prodQ), getDocs(adsQ)]);
        
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        setAds(adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdBanner)));
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory && p.status === 'available';
  });

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <span className="font-black text-white text-xl">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-none">Beecsan</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Marketplace</span>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-lg relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="What are you looking for today?"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border-transparent border focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all rounded-full text-sm outline-none shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <Link href="/messages" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </Link>
                <Button 
                  onClick={() => router.push('/listings/create')}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20 hidden md:flex"
                >
                  <Plus className="w-4 h-4 mr-2" /> Post Ad
                </Button>
                <div onClick={() => router.push('/profile')} className="w-10 h-10 rounded-full ring-2 ring-slate-100 cursor-pointer overflow-hidden hover:ring-primary/30 transition-all">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="profile" />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push('/auth/login')} className="text-sm font-semibold hover:text-primary">Login</Button>
                <Button onClick={() => router.push('/auth/register')} className="bg-slate-900 text-white rounded-full text-sm px-6">Register</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      
        {/* CATEGORY GRID */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Explore</h2>
              <h3 className="text-2xl font-bold text-slate-900">Top Categories</h3>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar sm:grid sm:grid-cols-3 lg:grid-cols-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`group flex flex-col items-center justify-center p-8 rounded-[32px] transition-all duration-300 border ${
                  selectedCategory === cat.id 
                  ? 'bg-slate-900 border-slate-900 shadow-2xl shadow-slate-200' 
                  : 'bg-white border-slate-100 hover:border-primary/40 hover:shadow-xl'
                }`}
              >
                <div className={`text-4xl mb-4 transition-transform group-hover:scale-110 ${selectedCategory === cat.id ? '' : 'grayscale-[0.3]'}`}>
                  {cat.emoji}
                </div>
                <span className={`font-bold text-[11px] uppercase tracking-widest transition-colors ${selectedCategory === cat.id ? 'text-white' : 'text-slate-500'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

      {/* Ad Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map(ad => (
              <div
                key={ad.id}
                onClick={() => ad.url && window.open(ad.url, '_blank')}
                className="relative h-32 rounded-lg overflow-hidden cursor-pointer group bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center hover:shadow-lg transition"
              >
                {ad.image ? (
                  <img
                    src={ad.image || "/placeholder.svg"}
                    alt={ad.title || 'Advertisement'}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-1">{ad.title || 'Advertisement'}</h3>
                    {ad.description && <p className="text-sm text-muted-foreground">{ad.description}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-20 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
            Advertisement space available
          </div>
        )}
      </section>
        {/* PRODUCT SECTION */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
             <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.label} Deals` : 'Recently Added'}
                </h2>
             </div>
             {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="text-xs font-bold text-primary flex items-center gap-1 px-4 py-2 bg-primary/5 rounded-full hover:bg-primary/10 transition">
                Clear Category <X className="w-3.5 h-3.5" />
              </button>
             )}
          </div>

          {loading ? (
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
               {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[32px] animate-pulse" />)}
             </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No results found</h3>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {filteredProducts.map((product: Product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isFavorite={favorites.includes(product.id)}
                  onFavoriteToggle={(id: string) => 
                    setFavorites((f: string[]) => f.includes(id) ? f.filter((x: string) => x !== id) : [...f, id])
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* LOAD MORE */}
        <section className="flex flex-col items-center justify-center py-12 border-t border-slate-100">
          <p className="text-slate-400 text-sm mb-6 font-medium">Viewing {filteredProducts.length} recent listings</p>
          <Button variant="outline" className="rounded-full px-12 py-6 border-slate-200 hover:bg-slate-50 text-slate-900 font-bold transition-all shadow-sm">
            Discover More
          </Button>
        </section>

        {/* APP DOWNLOAD BANNER */}
        <section className="relative rounded-[48px] overflow-hidden bg-slate-950 p-8 md:p-20 group">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Mobile Optimized</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Buy and sell <br />on the go.
            </h2>
            <p className="text-slate-400 mb-12 text-lg leading-relaxed">
              Experience the full power of Beecsan on your phone. Get real-time alerts and manage your listings with ease.
            </p>
            <div className="flex flex-wrap gap-5">
              <button className="flex items-center gap-4 bg-white hover:bg-slate-100 text-slate-900 px-7 py-4 rounded-2xl transition-all shadow-2xl scale-100 hover:scale-[1.02] active:scale-[0.98]">
                <div className="w-8 h-8"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.97L4.21,22.15L14.39,12.7L16.81,15.12M14.39,11.3L4.21,1.85L18.66,7.03L16.81,8.88L14.39,11.3M17.5,14.41L14.75,12L17.5,9.59L21.21,11.73C21.69,12.01 21.69,12.7 21.21,12.97L17.5,14.41Z" /></svg></div>
                <div className="text-left"><p className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">Get it on</p><p className="text-xl font-black leading-none">Google Play</p></div>
              </button>
              <button className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 text-white px-7 py-4 rounded-2xl transition-all shadow-2xl scale-100 hover:scale-[1.02] active:scale-[0.98] border border-slate-700">
                <div className="w-8 h-8"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" /></svg></div>
                <div className="text-left"><p className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">Available on</p><p className="text-xl font-black leading-none">App Store</p></div>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* MULTI-COLUMN FOOTER */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-16 mb-20">
            <div className="col-span-2 space-y-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center"><span className="font-black text-white text-lg">S</span></div>
                <span className="font-bold text-2xl tracking-tighter">Beecsan</span>
              </Link>
              <p className="text-slate-400 text-sm leading-loose max-w-sm font-medium">
                The leading marketplace for verified listings in Somalia. We build tools to help your community trade safely and efficiently.
              </p>
              <div className="flex gap-4">
                {[Zap, Shield, Star].map((Icon, i) => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer border border-transparent hover:border-primary/20">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.25em] mb-8">Resources</h4>
              <ul className="space-y-5 text-sm font-semibold text-slate-500">
                <li><Link href="#" className="hover:text-primary transition-colors">Safety Tips</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Ad Guidelines</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Price Checker</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.25em] mb-8">Company</h4>
              <ul className="space-y-5 text-sm font-semibold text-slate-500">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.25em] mb-8">Legal</h4>
              <ul className="space-y-5 text-sm font-semibold text-slate-500">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold tracking-tight">© 2026 Beecsan Marketplace. Handcrafted with precision.</p>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2 text-slate-300"><Shield className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Secure Gateway</span></div>
               <div className="flex items-center gap-2 text-slate-300"><Zap className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Fast Delivery</span></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, isFavorite, onFavoriteToggle }: ProductCardProps) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/listings/${product.id}`)}
      className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img 
          src={product.image_urls?.[0] || '/placeholder.jpg'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={product.title}
        />
        <div className="absolute top-4 left-4"><span className="bg-white/90 backdrop-blur-md text-[9px] font-black px-2.5 py-1.5 rounded-lg text-slate-900 uppercase tracking-tighter shadow-sm">Verified</span></div>
        <button 
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onFavoriteToggle(product.id); }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-white transition-all scale-90 hover:scale-100"
        >
          <Heart className={`w-4 h-4 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
        </button>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-base line-clamp-2 leading-snug mb-4 group-hover:text-primary transition-colors">{product.title}</h3>
        <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-tighter mt-auto">
          <MapPin className="w-3 h-3 mr-1 text-primary" /> {product.city}
        </div>
        <div className="flex items-end justify-between border-t border-slate-50 mt-5 pt-5">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Current Price</span>
            <span className="text-slate-900 font-black text-xl leading-none tracking-tight">${product.price}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-all group-hover:rotate-[-45deg]">
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFC]">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-[6px] border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-slate-400 font-black tracking-[0.3em] uppercase text-[10px] animate-pulse">Beecsan Loading</p>
    </div>
  );
}
