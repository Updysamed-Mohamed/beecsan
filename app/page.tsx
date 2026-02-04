// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useAuth } from '@/lib/auth-context';
// import { db } from '@/lib/firebase';
// import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
// import { Button } from '@/components/ui/button';
// import type { Product } from '@/lib/types';
// import { 
//   Heart, Search, Plus, MessageCircle, MapPin, 
//   Star, Zap, Shield, LayoutGrid, ChevronRight, X 
// } from 'lucide-react';

// interface AdBanner {
//   id: string;
//   title?: string;
//   image?: string;
//   url?: string;
//   description?: string;
//   type?: 'purple' | 'dark' | 'yellow';
// }

// interface ProductCardProps {
//   product: Product;
//   isFavorite: boolean;
//   onFavoriteToggle: (id: string) => void;
// }

// export default function HomePage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [ads, setAds] = useState<AdBanner[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [favorites, setFavorites] = useState<string[]>([]);
  
//   // Carousel Logic States
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const categories = [
//     { id: 'electronics', label: 'Electronics', emoji: '📱' },
//     { id: 'furniture', label: 'Furniture', emoji: '🪑' },
//     { id: 'clothing', label: 'Clothing', emoji: '👕' },
//     { id: 'vehicles', label: 'Vehicles', emoji: '🚗' },
//     { id: 'services', label: 'Services', emoji: '🔧' },
//     { id: 'other', label: 'Other', emoji: '📦' },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const prodQ = query(collection(db, 'products'), orderBy('created_at', 'desc'), limit(20));
//         const adsQ = query(collection(db, 'banners'));
//         const [prodSnap, adsSnap] = await Promise.all([getDocs(prodQ), getDocs(adsQ)]);
        
//         setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
//         setAds(adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdBanner)));
//       } catch (error) {
//         console.error('Fetch error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // --- CAROUSEL LOGIC ---
//   const displayAds = ads.length > 0 ? ads : [
//     { id: 's1', title: 'Beecsan Premium', description: 'Iibi alaabtaada si dhakhso ah', type: 'purple' },
//     { id: 's2', title: 'Verified Sellers', description: 'Ganacsi aamin ah oo hufan', type: 'dark' },
//     { id: 's3', title: 'Big Deals Today', description: 'Ha moogaanin fursadaha hoose', type: 'yellow' }
//   ];

//   useEffect(() => {
//     if (displayAds.length <= 1) return;
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % displayAds.length);
//     }, 4000); 
//     return () => clearInterval(interval);
//   }, [displayAds.length]);

//   useEffect(() => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const scrollAmount = container.offsetWidth * currentSlide;
//       container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
//     }
//   }, [currentSlide]);

//   const filteredProducts = products.filter((p: Product) => {
//     const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = !selectedCategory || p.category === selectedCategory;
//     return matchesSearch && matchesCategory && p.status === 'available';
//   });

//   if (authLoading) return <LoadingSpinner />;

//   return (
//     <div className="min-h-screen bg-[#FAFBFC] text-slate-900">
//       {/* HEADER */}
//       <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2 sm:gap-4">
//           <Link href="/" className="flex items-center shrink-0">
//             <img 
//               src="/logo_becsan.png" 
//               alt="Beecsan Logo" 
//               className="h-14 w-auto sm:h-20 object-contain transition-transform group-hover:scale-105"
//             />
//           </Link>

//           <div className="flex-1 max-w-lg relative group hidden xs:block">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 bg-slate-100/50 border-none rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//             />
//           </div>

//           <div className="flex items-center gap-2 sm:gap-3">
//             {user ? (
//               <>
//                 <Link href="/messages" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
//                   <MessageCircle className="w-5 h-5" />
//                 </Link>
//                 <Button 
//                   onClick={() => router.push('/listings/create')}
//                   className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-md shadow-primary/20 h-10 w-10 p-0 md:w-auto md:px-6"
//                 >
//                   <Plus className="w-5 h-5 md:mr-2" />
//                   <span className="hidden md:inline">Post Ad</span>
//                 </Button>
//                 <div onClick={() => router.push('/profile')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-slate-100 cursor-pointer overflow-hidden shrink-0">
//                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="profile" />
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center gap-1 sm:gap-2">
//                 <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')} className="text-xs sm:text-sm font-bold">Login</Button>
//                 <Button size="sm" onClick={() => router.push('/auth/register')} className="bg-slate-900 text-white rounded-full text-xs sm:text-sm px-3 sm:px-6">Register</Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
//         {/* CATEGORY GRID */}
//         <section className="mt-4">
//   <div className="flex items-end justify-between mb-5 px-1">
//     <div>
//       <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Explore</h2>
//       <h3 className="text-lg font-bold text-slate-900 tracking-tight">Top Categories</h3>
//     </div>
//   </div>

//   {/* 📱 Mobile: 4 Columns & Scroll | 💻 Desktop: 6 Columns */}
//   <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-3 lg:grid-cols-6 scroll-smooth">
//     {categories.map(cat => (
//       <button
//         key={cat.id}
//         onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
//         className={`group flex flex-col items-center justify-center 
//           min-w-[85px] h-[95px]  /* Cabbir yar oo mobile-ka ah */
//           sm:min-w-full sm:h-auto sm:p-8 
//           rounded-[24px] transition-all duration-300 border snap-start
//           ${selectedCategory === cat.id 
//             ? 'bg-slate-900 border-slate-900 shadow-lg shadow-slate-200' 
//             : 'bg-white border-slate-100 active:scale-95 hover:border-primary/30'
//           }`}
//       >
//         <div className={`text-2xl sm:text-4xl mb-2 transition-transform group-hover:scale-110 ${selectedCategory === cat.id ? '' : 'grayscale-[0.2]'}`}>
//           {cat.emoji}
//         </div>
//         <span className={`font-black text-[9px] sm:text-[11px] uppercase tracking-tighter sm:tracking-widest transition-colors ${selectedCategory === cat.id ? 'text-white' : 'text-slate-500'}`}>
//           {cat.label}
//         </span>
//       </button>
//     ))}
//   </div>

//   {/* CSS si loo qariyo scrollbar-ka haddii aadan horey ugu darin Tailwind Config */}
//   <style jsx global>{`
//     .no-scrollbar::-webkit-scrollbar {
//       display: none;
//     }
//     .no-scrollbar {
//       -ms-overflow-style: none;
//       scrollbar-width: none;
//     }
//   `}</style>
// </section>

//         {/* 📺 AUTO-PLAY AD BANNERS CAROUSEL */}
//         <section className="max-w-7xl mx-auto py-8 overflow-hidden">
//           {loading ? (
//             <div className="h-44 bg-slate-100 rounded-[32px] animate-pulse"></div>
//           ) : (
//             <div className="relative">
//               <div 
//                 ref={scrollContainerRef}
//                 className="flex overflow-x-hidden no-scrollbar snap-x snap-mandatory"
//               >
//                 {displayAds.map((ad: any, index: number) => (
//                   <div key={ad.id} className="min-w-full snap-start px-1">
//                     <div className="relative h-44 rounded-[32px] overflow-hidden cursor-pointer shadow-lg group">
//                       {ad.image ? (
//                         <img src={ad.image} className="w-full h-full object-cover" alt={ad.title} />
//                       ) : (
//                         <div className={`w-full h-full p-8 flex items-center justify-between ${
//                           ad.type === 'purple' ? 'bg-gradient-to-br from-[#4d1d80] to-[#2d114b]' :
//                           ad.type === 'yellow' ? 'bg-gradient-to-br from-[#FFC107] to-[#e6ae00]' :
//                           'bg-gradient-to-br from-slate-900 to-slate-800'
//                         }`}>
//                           <div className="relative z-10">
//                             <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest mb-3 inline-block ${ad.type === 'yellow' ? 'bg-slate-900 text-white' : 'bg-white/20 text-white'}`}>
//                               {ad.type === 'yellow' ? 'Hot Deal' : 'Featured'}
//                             </span>
//                             <h3 className={`font-black text-2xl md:text-3xl leading-none mb-2 ${ad.type === 'yellow' ? 'text-slate-900' : 'text-white'}`}>
//                               {ad.title}
//                             </h3>
//                             <p className={`text-xs font-bold uppercase tracking-tighter ${ad.type === 'yellow' ? 'text-slate-900/60' : 'text-white/60'}`}>
//                               {ad.description}
//                             </p>
//                           </div>
//                           <div className={`${ad.type === 'yellow' ? 'text-slate-900' : 'text-white'} opacity-20 mr-4 hidden sm:block`}>
//                             {ad.type === 'purple' && <Zap size={80} />}
//                             {ad.type === 'dark' && <Shield size={80} />}
//                             {ad.type === 'yellow' && <Star size={80} />}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Indicators (Dots) */}
//               <div className="flex justify-center gap-2 mt-6">
//                 {displayAds.map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentSlide(i)}
//                     className={`h-1.5 rounded-full transition-all duration-500 ${
//                       currentSlide === i ? 'w-8 bg-[#4d1d80]' : 'w-2 bg-slate-200'
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </section>

//         {/* PRODUCT SECTION */}
//         <section>
//           <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
//              <div className="flex items-center gap-3">
//                 <LayoutGrid className="w-5 h-5 text-primary" />
//                 <h2 className="text-xl font-bold text-slate-900">
//                   {selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.label} Deals` : 'Recently Added'}
//                 </h2>
//              </div>
//              {selectedCategory && (
//               <button onClick={() => setSelectedCategory(null)} className="text-xs font-bold text-primary flex items-center gap-1 px-4 py-2 bg-primary/5 rounded-full hover:bg-primary/10 transition">
//                 Clear Category <X className="w-3.5 h-3.5" />
//               </button>
//              )}
//           </div>

//           {loading ? (
//              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
//                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[32px] animate-pulse" />)}
//              </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
//               <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
//               <h3 className="text-lg font-bold text-slate-800">No results found</h3>
//               <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
//               {filteredProducts.map((product: Product) => (
//                 <ProductCard 
//                   key={product.id} 
//                   product={product} 
//                   isFavorite={favorites.includes(product.id)}
//                   onFavoriteToggle={(id: string) => 
//                     setFavorites((f: string[]) => f.includes(id) ? f.filter((x: string) => x !== id) : [...f, id])
//                   }
//                 />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* LOAD MORE */}
//         <section className="flex flex-col items-center justify-center py-12 border-t border-slate-100">
//           <p className="text-slate-400 text-sm mb-6 font-medium">Viewing {filteredProducts.length} recent listings</p>
//           <Button variant="outline" className="rounded-full px-12 py-6 border-slate-200 hover:bg-slate-50 text-slate-900 font-bold transition-all shadow-sm">
//             Discover More
//           </Button>
//         </section>

//         {/* APP DOWNLOAD BANNER */}
//         <section className="relative rounded-[48px] overflow-hidden bg-[#4d1d80] p-8 md:p-20 group">
//           <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 blur-[120px] rounded-full translate-x-1/2 group-hover:bg-white/20 transition-all duration-1000" />
//           <div className="relative z-10 max-w-2xl">
//             <span className="text-[#FFC107] font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Mobile Optimized</span>
//             <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">Buy and sell <br />on the go.</h2>
//             <p className="text-white/80 mb-12 text-lg leading-relaxed">Experience the full power of Beecsan on your phone. Get real-time alerts and manage your listings with ease.</p>
//             <div className="flex flex-wrap gap-5">
//               <button className="flex items-center gap-4 bg-white hover:bg-slate-100 text-[#4d1d80] px-7 py-4 rounded-2xl transition-all shadow-2xl scale-100 hover:scale-[1.02] active:scale-[0.98]">
//                 <div className="w-8 h-8">
//                   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.97L4.21,22.15L14.39,12.7L16.81,15.12M14.39,11.3L4.21,1.85L18.66,7.03L16.81,8.88L14.39,11.3M17.5,14.41L14.75,12L17.5,9.59L21.21,11.73C21.69,12.01 21.69,12.7 21.21,12.97L17.5,14.41Z" /></svg>
//                 </div>
//                 <div className="text-left">
//                   <p className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">Get it on</p>
//                   <p className="text-xl font-black leading-none">Google Play</p>
//                 </div>
//               </button>
//               <button className="flex items-center gap-4 bg-[#3a1661] hover:bg-[#2d114b] text-white px-7 py-4 rounded-2xl transition-all shadow-2xl scale-100 hover:scale-[1.02] active:scale-[0.98] border border-white/10">
//                 <div className="w-8 h-8">
//                   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" /></svg>
//                 </div>
//                 <div className="text-left">
//                   <p className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">Available on</p>
//                   <p className="text-xl font-black leading-none">App Store</p>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </section>
//       </main>

      // <footer className="bg-surface border-t border-border pt-16 pb-8">
      //   <div className="max-w-7xl mx-auto px-4 sm:px-6">
      //     <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 mb-16">
      //       <div className="col-span-2 space-y-6">
      //         <Link href="/" className="flex items-center gap-3 group">
      //           <div className="h-10 w-auto">
      //             <img src="/logo_becsan.png" alt="Beecsan" className="h-full w-auto object-contain" />
      //           </div>
      //         </Link>
      //         <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
      //           The leading marketplace for verified listings. We build tools to help your community trade safely and efficiently.
      //         </p>
      //       </div>
      //       <div>
      //         <h4 className="font-black text-foreground text-xs uppercase tracking-widest mb-6">Resources</h4>
      //         <ul className="space-y-4 text-sm font-semibold">
      //           <li><Link href="/resources/safety-tips" className="text-muted-foreground hover:text-primary transition-colors">Safety Tips</Link></li>
      //           <li><Link href="/resources/ad-guidelines" className="text-muted-foreground hover:text-primary transition-colors">Ad Guidelines</Link></li>
      //         </ul>
      //       </div>
      //       <div>
      //         <h4 className="font-black text-foreground text-xs uppercase tracking-widest mb-6">Company</h4>
      //         <ul className="space-y-4 text-sm font-semibold">
      //           <li><Link href="/company/about-us" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
      //           <li><Link href="/company/contact-support" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</Link></li>
      //         </ul>
      //       </div>
      //       <div>
      //         <h4 className="font-black text-foreground text-xs uppercase tracking-widest mb-6">Legal</h4>
      //         <ul className="space-y-4 text-sm font-semibold">
      //           <li><Link href="/legal/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
      //           <li><Link href="/legal/terms-of-use" className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link></li>
      //         </ul>
      //       </div>
      //     </div>
      //     <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
      //       <p className="text-muted-foreground text-xs font-bold tracking-tight">© 2026 Beecsan Marketplace. All rights reserved.</p>
      //     </div>
      //   </div>
      // </footer>
//     </div>
//   );
// }

// function ProductCard({ product, isFavorite, onFavoriteToggle }: ProductCardProps) {
//   const router = useRouter();
//   return (
//     <div 
//       onClick={() => router.push(`/listings/${product.id}`)}
//       className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 cursor-pointer flex flex-col h-full"
//     >
//       <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
//         <img 
//           src={product.image_urls?.[0] || '/placeholder.jpg'} 
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
//           alt={product.title}
//         />
//         <div className="absolute top-4 left-4"><span className="bg-white/90 backdrop-blur-md text-[9px] font-black px-2.5 py-1.5 rounded-lg text-slate-900 uppercase tracking-tighter shadow-sm">Verified</span></div>
//         <button 
//           onClick={(e: React.MouseEvent) => { e.stopPropagation(); onFavoriteToggle(product.id); }}
//           className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-white transition-all scale-90 hover:scale-100"
//         >
//           <Heart className={`w-4 h-4 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
//         </button>
//       </div>
//       <div className="p-6 flex flex-col flex-1">
//         <h3 className="font-bold text-slate-800 text-base line-clamp-2 leading-snug mb-4 group-hover:text-primary transition-colors">{product.title}</h3>
//         <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-tighter mt-auto">
//           <MapPin className="w-3 h-3 mr-1 text-primary" /> {product.city}
//         </div>
//         <div className="flex items-end justify-between border-t border-slate-50 mt-5 pt-5">
//           <div className="flex flex-col">
//             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Current Price</span>
//             <span className="text-slate-900 font-black text-xl leading-none tracking-tight">${product.price}</span>
//           </div>
//           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-all group-hover:rotate-[-45deg]">
//             <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function LoadingSpinner() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFC]">
//       <div className="relative w-20 h-20">
//         <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
//         <div className="absolute inset-0 border-[6px] border-primary border-t-transparent rounded-full animate-spin"></div>
//       </div>
//       <p className="mt-6 text-slate-400 font-black tracking-[0.3em] uppercase text-[10px] animate-pulse">Beecsan Loading</p>
//     </div>
//   );
// }
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
  Star, Zap, Shield, LayoutGrid, ChevronRight, X
} from 'lucide-react';

interface AdBanner {
  id: string;
  title?: string;
  image_url?: string;
  url?: string;
  description?: string;
  status?: string;
  type?: 'purple' | 'dark' | 'yellow';
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'electronics', label: 'Electronics', emoji: '📱' },
    { id: 'furniture', label: 'Furniture', emoji: '🪑' },
    { id: 'fashions', label: 'Fashions', emoji: '👕' },
    { id: 'vehicles', label: 'Vehicles', emoji: '🚗' },
    { id: 'beauty and personal care', label: 'Beauty', emoji: '💄' },
    { id: 'construction materials', label: 'Construction', emoji: '🏗️' },
    { id: 'general service', label: 'Services', emoji: '📦' },
  ];

  // 1. Fetch Products and Ads
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

  // 2. Real-time Favorites Sync from Firestore
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const favRef = doc(db, 'favorites', user.uid);
    const unsubscribe = onSnapshot(favRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavorites(docSnap.data().productIds || []);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Favorite Toggle Function
  const handleFavoriteToggle = async (productId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const isAlreadyFav = favorites.includes(productId);
    const newFavorites = isAlreadyFav 
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];

    // Optimistic Update for instant UI feedback
    setFavorites(newFavorites);

    try {
      const favRef = doc(db, 'favorites', user.uid);
      await setDoc(favRef, { productIds: newFavorites }, { merge: true });
    } catch (error) {
      console.error("Failed to update favorites:", error);
      // Rollback on error
      setFavorites(favorites);
    }
  };

  const filteredAndSortedProducts = products
    .filter((p: Product) => {
      const isApproved = (p as any).status === 'approved';
      const isVisible = p.visibility !== 'hidden'; 
      const searchTerm = searchQuery.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || 
        p.title.toLowerCase().includes(searchTerm) ||
        (p.category || '').toLowerCase().includes(searchTerm) ||
        (p.city || '').toLowerCase().includes(searchTerm);

      const matchesCategory = !selectedCategory || 
        (p.category || '').toLowerCase() === selectedCategory.toLowerCase();

      return isApproved && isVisible && matchesSearch && matchesCategory;
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

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link href="/messages" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <Button onClick={() => router.push('/listings/create')} className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-md shadow-primary/20 h-10 w-10 p-0 md:w-auto md:px-6">
                  <Plus className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline">Post Ad</span>
                </Button>
                <div onClick={() => router.push('/profile')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-slate-100 cursor-pointer overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="profile" />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')} className="text-xs sm:text-sm font-bold">Login</Button>
                <Button size="sm" onClick={() => router.push('/auth/register')} className="bg-slate-900 text-white rounded-full text-xs sm:text-sm px-3 sm:px-6">Register</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
        {/* CATEGORIES */}
        <section className="mt-4">
          <div className="flex items-end justify-between mb-5 px-1">
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Explore</h2>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Top Categories</h3>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-3 lg:grid-cols-6 scroll-smooth">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`group flex flex-col items-center justify-center min-w-[85px] h-[95px] sm:min-w-full sm:h-auto sm:p-8 rounded-[24px] transition-all duration-300 border snap-start ${selectedCategory === cat.id ? 'bg-slate-900 border-slate-900 shadow-lg shadow-slate-200' : 'bg-white border-slate-100 hover:border-primary/30'}`}
              >
                <div className={`text-2xl sm:text-4xl mb-2 transition-transform group-hover:scale-110`}>{cat.emoji}</div>
                <span className={`font-black text-[9px] sm:text-[11px] uppercase tracking-tighter transition-colors ${selectedCategory === cat.id ? 'text-white' : 'text-slate-500'}`}>{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* BANNERS */}
        <section className="max-w-7xl mx-auto py-8 overflow-hidden">
          {loading ? (
            <div className="h-44 bg-slate-100 rounded-[32px] animate-pulse"></div>
          ) : (
            <div className="relative">
              <div ref={scrollContainerRef} className="flex overflow-x-hidden no-scrollbar snap-x snap-mandatory">
                {displayAds.map((ad: AdBanner) => (
                  <div key={ad.id} className="min-w-full snap-start px-1">
                    <div className="relative h-44 rounded-[32px] overflow-hidden cursor-pointer shadow-lg group">
                      {ad.image_url ? (
                        <img src={ad.image_url} className="w-full h-full object-cover" alt={ad.title || "Ad"} />
                      ) : (
                        <div className={`w-full h-full p-8 flex items-center justify-between ${ad.type === 'purple' ? 'bg-gradient-to-br from-[#4d1d80] to-[#2d114b]' : ad.type === 'yellow' ? 'bg-gradient-to-br from-[#FFC107] to-[#e6ae00]' : 'bg-gradient-to-br from-slate-900 to-slate-800'}`}>
                          <div className="relative z-10">
                            <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest mb-3 inline-block ${ad.type === 'yellow' ? 'bg-slate-900 text-white' : 'bg-white/20 text-white'}`}>{ad.type === 'yellow' ? 'Hot Deal' : 'Featured'}</span>
                            <h3 className={`font-black text-2xl md:text-3xl leading-none mb-2 ${ad.type === 'yellow' ? 'text-slate-900' : 'text-white'}`}>{ad.title}</h3>
                            <p className={`text-xs font-bold uppercase tracking-tighter ${ad.type === 'yellow' ? 'text-slate-900/60' : 'text-white/60'}`}>{ad.description}</p>
                          </div>
                          <div className={`${ad.type === 'yellow' ? 'text-slate-900' : 'text-white'} opacity-20 mr-4 hidden sm:block`}>
                            {ad.type === 'purple' && <Zap size={80} />}
                            {ad.type === 'dark' && <Shield size={80} />}
                            {ad.type === 'yellow' && <Star size={80} />}
                          </div>
                        </div>
                      )}
                    </div>
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

        {/* PRODUCTS SECTION */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-100 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-slate-900">
                {searchQuery ? `Search: "${searchQuery}"` : selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.label}` : 'Recently Added'}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative flex items-center bg-slate-100 rounded-2xl p-1">
                 <button onClick={() => setSortBy('newest')} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${sortBy === 'newest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Newest</button>
                 <button onClick={() => setSortBy('price-low')} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${sortBy === 'price-low' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Price</button>
              </div>
              {(selectedCategory || searchQuery) && (
                <button onClick={() => {setSelectedCategory(null); setSearchQuery('');}} className="text-xs font-bold text-red-500 flex items-center gap-1 px-4 py-2 bg-red-50 rounded-full hover:bg-red-100 transition">Reset <X className="w-3.5 h-3.5" /></button>
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
                <Button variant="outline" className="mt-6 rounded-full" onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}>Show all</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isFavorite={favorites.includes(product.id)} 
                  onFavoriteToggle={handleFavoriteToggle} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

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
      onClick={() => router.push(`/listings/${product.id}`)}
      className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img src={displayImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
        <div className="absolute top-4 left-4"><span className="bg-white/90 backdrop-blur-md text-[9px] font-black px-2.5 py-1.5 rounded-lg text-slate-900 uppercase tracking-tighter shadow-sm">Verified</span></div>
        
        {/* Updated Favorite Button with stopPropagation */}
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