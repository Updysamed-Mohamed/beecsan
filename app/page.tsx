'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { 
  collection, query, limit, getDocs, doc, 
  setDoc, onSnapshot 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { 
  Heart, Search, Plus, MessageCircle, MapPin, 
  Star, Zap, Shield, LayoutGrid, ChevronRight, X,
  Bell 
} from 'lucide-react';

// 1. IMPORT PULL TO REFRESH
import PullToRefresh from 'react-simple-pull-to-refresh';

interface AdBanner {
  id: string;
  title?: string;
  image_url?: string;
  url?: string;
  description?: string;
  status?: string;
  type?: 'purple' | 'dark' | 'yellow';
  link?: string;
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
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [showSubModal, setShowSubModal] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [filterCity, setFilterCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // 2. SHAQADA REFRESH-KA (Tan ayaa loo dirayaa PullToRefresh)
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const prodQ = query(collection(db, 'products'), limit(100));
      const adsQ = query(collection(db, 'banners'));
      const [prodSnap, adsSnap] = await Promise.all([getDocs(prodQ), getDocs(adsQ)]);
      
      const fetchedProducts = prodSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Product));

      setProducts(fetchedProducts);
      setAds(adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdBanner)));
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

 const categories = [
  { id: 'electronics', label: 'Electronics', emoji: '💻' }, 
  { id: 'furniture', label: 'Furniture', emoji: '🛋️' },     
  { id: 'property', label: 'Property', emoji: '🏡' },      
  { id: 'fashions', label: 'Fashions', emoji: '👔' },      
  { id: 'vehicles', label: 'Vehicles', emoji: '🚘' },     
  { id: 'beauty and personal care', label: 'Beauty', emoji: '✨' }, 
  { id: 'construction materials', label: 'Construction', emoji: '🧱' }, 
  { id: 'general service', label: 'Services', emoji: '🛠️' },
];

  const subCategories: Record<string, string[]> = {
    electronics: ['phones', 'laptops', 'tvs', 'accessories'],
    property: ['house', 'apartment', 'guest', 'hotel'],
    vehicles: ['cars', 'bajaaj', 'motorcycles', 'trucks'],
    fashions: ['men', 'women'],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodQ = query(collection(db, 'products'), limit(100));
        const adsQ = query(collection(db, 'banners'));
        const [prodSnap, adsSnap] = await Promise.all([getDocs(prodQ), getDocs(adsQ)]);
        
        const fetchedProducts = prodSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Product));

        setProducts(fetchedProducts);
        setAds(adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdBanner)));
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      return;
    }

    const favRef = doc(db, 'favorites', user.uid);
    const unsubscribe = onSnapshot(favRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setFavorites(docSnap.data().productIds || []);
        } else {
          setFavorites([]);
        }
      }, 
      (error) => {
        console.error("Favorites listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleFavoriteToggle = async (productId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const isAlreadyFav = favorites.includes(productId);
    const newFavorites = isAlreadyFav 
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];

    setFavorites(newFavorites);

    try {
      const favRef = doc(db, 'favorites', user.uid);
      await setDoc(favRef, { productIds: newFavorites }, { merge: true });
    } catch (error) {
      console.error("Failed to update favorites:", error);
      setFavorites(favorites);
    }
  };

  const handleCategoryClick = (catId: string) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(catId);
      setSelectedSubCategory(null);
      if (subCategories[catId]) {
        setShowSubModal(true);
      }
    }
  };

  const filteredAndSortedProducts = products
  .filter((p: Product) => {
    const isApproved = (p as any).status === 'approved';
    const isVisible = p.visibility !== 'hidden';
    const searchTerm = searchQuery.toLowerCase().trim();
    const matchesSearch = searchTerm === '' || p.title.toLowerCase().includes(searchTerm) || (p.category || '').toLowerCase().includes(searchTerm) || (p.city || '').toLowerCase().includes(searchTerm);
    const matchesCategory = !selectedCategory || (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesSubCategory = !selectedSubCategory || p.subcategory === selectedSubCategory;
    const matchesCity = !filterCity || p.city?.toLowerCase().includes(filterCity.toLowerCase());
    const matchesPrice = (!minPrice || Number(p.price) >= Number(minPrice)) && (!maxPrice || Number(p.price) <= Number(maxPrice));
    const matchesCondition = !condition || p.condition === condition;

    return isApproved && isVisible && matchesSearch && matchesCategory && matchesSubCategory && matchesCity && matchesPrice && matchesCondition;
  })
  .sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    const dateA = (a as any).created_at?.seconds || new Date(a.created_at).getTime() || 0;
    const dateB = (b as any).created_at?.seconds || new Date(b.created_at).getTime() || 0;
    return dateB - dateA;
  });

  const displayAds = ads.length > 0 ? ads : [
    { id: 's1', title: 'Beecsan Premium', description: 'Iibi alaabtaada si dhakhso ah', type: 'purple' as const },
    { id: 's2', title: 'Verified Sellers', description: 'Ganacsi aamin ah oo hufan', type: 'dark' as const },
    { id: 's3', title: 'Big Deals Today', description: 'Ha moogaanin fursadaha hoose', type: 'yellow' as const }
  ];

  useEffect(() => {
    if (displayAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayAds.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [displayAds.length]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * currentSlide;
      container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [currentSlide]);

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo_becsan.png" alt="Beecsan Logo" className="h-14 w-auto sm:h-20 object-contain" />
          </Link>

          <div className="flex-1 max-w-lg relative group">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-8 py-2.5 bg-slate-100 rounded-full text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                  <X className="w-3 h-3 text-slate-500" />
                </button>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            {user ? (
              <>
                <Link href="/notifications" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </Link>
                <Link href="/messages" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <Button onClick={() => router.push('/listings/create')} className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-md shadow-primary/20 h-9 w-9 p-0 md:h-10 md:w-auto md:px-6 shrink-0">
                  <Plus className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline">Post Ad</span>
                </Button>
                <div onClick={() => router.push('/profile')} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-slate-100 cursor-pointer overflow-hidden shrink-0 ml-1">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="profile" />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')} className="text-xs sm:text-sm font-bold">Login</Button>
                <Button size="sm" onClick={() => router.push('/auth/register')} className="bg-slate-900 text-white rounded-full text-xs sm:text-sm px-3 sm:px-6">New Add</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
        {/* REFRESH INDICATOR - Wixii horay u jiray waan daayay */}
        {refreshing && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-white p-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-2 pr-4">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Updating...</span>
          </div>
        )}

        {/* 3. PULL TO REFRESH WRAPPER - Waxaan ku dhex ridnay xogta Main */}
        <PullToRefresh onRefresh={onRefresh} pullDownThreshold={80} maxPullDownDistance={120}>
          <div className="space-y-12 min-h-[600px]">
          

          {/* BANNERS */}
<section className="max-w-7xl mx-auto overflow-hidden">
  {loading ? (
    <div className="h-44 bg-slate-100 rounded-[32px] animate-pulse"></div>
  ) : (
    <div className="relative">
      <div ref={scrollContainerRef} className="flex overflow-x-hidden no-scrollbar snap-x snap-mandatory">
        {displayAds.map((ad: AdBanner) => (
          <div key={ad.id} className="min-w-full snap-start px-1">
            
            {/* ✅ HERE: Waxaan ku badalay div-kii hore 'a' tag si uu link u noqdo */}
            <a 
              href={ad.link || '#'} // Hubi in field-kaagu yahay 'link' ama 'url'
              target="_blank"       // Si uu tab cusub ugu furo
              rel="noopener noreferrer"
              className="block relative h-44 rounded-[32px] overflow-hidden cursor-pointer shadow-lg group transform active:scale-95 transition-transform"
              onClick={(e) => {
                // Haddii uusan link jirin, ha furin waxbo
                if (!ad.link) e.preventDefault();
              }}
            >
              {ad.image_url ? (
                <img 
                  src={ad.image_url} 
                  className="w-full h-full object-cover" 
                  alt={ad.title || "Ad"} 
                />
              ) : (
                <div className={`w-full h-full p-8 flex items-center justify-between ${ad.type === 'purple' ? 'bg-gradient-to-br from-[#4d1d80] to-[#2d114b]' : ad.type === 'yellow' ? 'bg-gradient-to-br from-[#FFC107] to-[#e6ae00]' : 'bg-gradient-to-br from-slate-900 to-slate-800'}`}>
                  <div className="relative z-10">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest mb-3 inline-block ${ad.type === 'yellow' ? 'bg-slate-900 text-white' : 'bg-white/20 text-white'}`}>
                      {ad.type === 'yellow' ? 'Hot Deal' : 'Featured'}
                    </span>
                    <h3 className={`font-black text-2xl md:text-3xl leading-none mb-2 ${ad.type === 'yellow' ? 'text-slate-900' : 'text-white'}`}>
                      {ad.title}
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-tighter ${ad.type === 'yellow' ? 'text-slate-900/60' : 'text-white/60'}`}>
                      {ad.description}
                    </p>
                  </div>
                  <div className={`${ad.type === 'yellow' ? 'text-slate-900' : 'text-white'} opacity-20 mr-4 hidden sm:block`}>
                    {ad.type === 'purple' && <Zap size={80} />}
                    {ad.type === 'dark' && <Shield size={80} />}
                    {ad.type === 'yellow' && <Star size={80} />}
                  </div>
                </div>
              )}
            </a>

          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {displayAds.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-[#4d1d80]' : 'w-2 bg-slate-200'}`} />
        ))}
      </div>
    </div>
  )}
</section>
              {/* CATEGORIES */}
            <section className="mt-4">
              <div className="flex items-end justify-between mb-5 px-1">
                <div>
                  <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Explore</h2>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Top Categories</h3>
                </div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-3 lg:grid-cols-6 scroll-smooth">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`group flex flex-col items-center justify-center min-w-[85px] h-[95px] sm:min-w-full sm:h-auto sm:p-8 rounded-[24px] transition-all duration-300 border snap-start ${selectedCategory === cat.id ? 'bg-slate-900 border-slate-900 shadow-lg shadow-slate-200' : 'bg-white border-slate-100 hover:border-primary/30'}`}
                  >
                    <div className="text-2xl sm:text-4xl mb-2 transition-transform group-hover:scale-110">{cat.emoji}</div>
                    <span className={`font-black text-[9px] sm:text-[11px] uppercase tracking-tighter transition-colors ${selectedCategory === cat.id ? 'text-white' : 'text-slate-500'}`}>{cat.label}</span>
                  </button>
                ))}
              </div>

              {selectedSubCategory && (
                <div className="flex items-center gap-2 mt-4 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Selected:</span>
                  <button onClick={() => setSelectedSubCategory(null)} className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                    {selectedSubCategory} <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </section>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3">
              <input placeholder="City" value={filterCity} onChange={e => setFilterCity(e.target.value)} className="px-4 py-2 rounded-full bg-slate-100 text-sm border-none focus:ring-2 focus:ring-primary/20" />
              <input placeholder="Min Price" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="px-4 py-2 rounded-full bg-slate-100 text-sm w-28 border-none" />
              <input placeholder="Max Price" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="px-4 py-2 rounded-full bg-slate-100 text-sm w-28 border-none" />
              <select value={condition} onChange={e => setCondition(e.target.value)} className="px-4 py-2 rounded-full bg-slate-100 text-sm border-none">
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>

            {/* PRODUCTS SECTION */}
            <section>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-100 pb-6 gap-4">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {searchQuery ? `Search: "${searchQuery}"` : selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.label}` : 'Recently Added'}
                    <button onClick={onRefresh} disabled={refreshing} className={`p-2 rounded-full hover:bg-slate-100 transition-all ${refreshing ? 'animate-spin opacity-50' : ''}`}>
                      <Zap className={`w-4 h-4 ${refreshing ? 'text-primary' : 'text-slate-400'}`} />
                    </button>
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center bg-slate-100 rounded-2xl p-1">
                     <button onClick={() => setSortBy('newest')} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${sortBy === 'newest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Newest</button>
                     <button onClick={() => setSortBy('price-low')} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${sortBy === 'price-low' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Price</button>
                  </div>
                  {(selectedCategory || searchQuery || selectedSubCategory) && (
                    <button onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); setSearchQuery(''); }} className="text-xs font-bold text-red-500 flex items-center gap-1 px-4 py-2 bg-red-50 rounded-full hover:bg-red-100 transition">
                      Reset <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                   {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[32px] animate-pulse" />)}
                 </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                    <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">No approved products found</h3>
                    <Button variant="outline" className="mt-6 rounded-full" onClick={() => {setSearchQuery(''); setSelectedCategory(null); setSelectedSubCategory(null);}}>Show all</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} isFavorite={favorites.includes(product.id)} onFavoriteToggle={handleFavoriteToggle} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </PullToRefresh>

      </main>

      {/* SUB CATEGORY MODAL */}
      {showSubModal && selectedCategory && subCategories[selectedCategory] && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowSubModal(false)} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black capitalize">{categories.find(c => c.id === selectedCategory)?.label}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Select Sub-category</p>
              </div>
              <button onClick={() => setShowSubModal(false)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {subCategories[selectedCategory].map(sub => (
                <button
                  key={sub}
                  onClick={() => { setSelectedSubCategory(sub); setShowSubModal(false); }}
                  className={`px-4 py-4 rounded-2xl text-sm font-bold border transition-all text-left flex items-center justify-between group ${selectedSubCategory === sub ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-100 hover:border-primary/30 hover:bg-white'}`}
                >
                  <span className="capitalize">{sub}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedSubCategory === sub ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 rounded-2xl text-slate-400 text-xs font-bold" onClick={() => { setSelectedSubCategory(null); setShowSubModal(false); }}>
              View All {categories.find(c => c.id === selectedCategory)?.label}
            </Button>
          </div>
        </div>
      )}

      <footer className="bg-surface border-t border-border pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 mb-16">
            <div className="col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-10 w-auto">
                  <img src="/logo_becsan.png" alt="Beecsan" className="h-full w-auto object-contain" />
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
                The leading marketplace for verified listings. We build tools to help your community trade safely and efficiently.
              </p>
            </div>
            <div>
              <h4 className="font-black text-foreground text-xs uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li><Link href="/resources/safety-tips" className="text-muted-foreground hover:text-primary transition-colors">Safety Tips</Link></li>
                <li><Link href="/resources/ad-guidelines" className="text-muted-foreground hover:text-primary transition-colors">Ad Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-foreground text-xs uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li><Link href="/company/about-us" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/company/contact-support" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-foreground text-xs uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li><Link href="/legal/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms-of-use" className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-muted-foreground text-xs font-bold tracking-tight">© 2026 Beecsan Marketplace. All rights reserved.</p>
             <a 
              href="https://www.facebook.com/HaraadAdvert" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground text-xs font-bold tracking-tight hover:text-blue-600 transition-colors"
            >
              Developed by Haraad Digital Solutions
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, isFavorite, onFavoriteToggle }: ProductCardProps) {
  const router = useRouter();
  const images = product.image_urls || (product as any).images || [];
  const displayImage = images[0] || '/placeholder.jpg';

  return (
    <div 
      onClick={() => router.push(`/listings?id=${product.id}`)}
      className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img src={displayImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-[9px] font-black px-2.5 py-1.5 rounded-lg text-slate-900 uppercase tracking-tighter shadow-sm">Verified</span>
        </div>
        
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onFavoriteToggle(product.id); 
          }} 
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center transition-all active:scale-90 z-10"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-base line-clamp-2 leading-snug mb-4">{product.title}</h3>
        <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-tighter mt-auto">
          <MapPin className="w-3 h-3 mr-1 text-primary" /> {product.city}
        </div>
        <div className="flex items-end justify-between border-t border-slate-50 mt-5 pt-5">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Price</span>
            <span className="text-slate-900 font-black text-xl leading-none tracking-tight">${product.price}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFC]">
      <div className="relative w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400 font-black tracking-widest uppercase text-[10px]">Beecsan</p>
    </div>
  );
}