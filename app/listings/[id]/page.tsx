// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { db } from '@/lib/firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import type { Product, User as UserType } from '@/lib/types';
// import { Heart, MapPin, Share2, ArrowLeft, MessageCircle, ShieldCheck, Tag, Clock } from 'lucide-react';

// export default function ListingDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { user } = useAuth();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [seller, setSeller] = useState<UserType | null>(null); // State for the fetched seller
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   const id = params.id as string;

//   useEffect(() => {
//     const fetchProductAndSeller = async () => {
//       try {
//         // 1. Fetch Product
//         const docRef = doc(db, 'products', id);
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//           const productData = {
//             id: docSnap.id,
//             ...docSnap.data(),
//           } as Product;
//           setProduct(productData);

//           // 2. Fetch Seller dynamically using seller_id from the product doc
//           const sellerId = (productData as any).seller_id; // Using seller_id as seen in your DB screenshot
//           if (sellerId) {
//             const sellerRef = doc(db, 'users', sellerId);
//             const sellerSnap = await getDoc(sellerRef);
//             if (sellerSnap.exists()) {
//               setSeller(sellerSnap.data() as UserType);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProductAndSeller();
//     }
//   }, [id]);

//   if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">Loading...</div>;
//   if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
//       {/* NAVIGATION ONLY */}
//       <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
//         <Button variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm border border-gray-100" onClick={() => router.back()}>
//           <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
//         </Button>
//         <div className="flex gap-2">
//           <Button variant="outline" size="icon" className="rounded-xl border-gray-100 bg-white"><Share2 className="w-4 h-4" /></Button>
//           <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="rounded-xl border-gray-100 bg-white">
//             <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
//           </Button>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* LEFT: GALLERY */}
//           <div className="lg:col-span-7 space-y-4">
//             <div className="aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative">
//               <img
//                 src={product.image_urls?.[selectedImageIndex] || '/placeholder.jpg'}
//                 className="w-full h-full object-cover"
//                 alt=""
//               />
//               <div className="absolute top-6 left-6">
//                 <span className="bg-[#0F172A] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
//                   {product.category}
//                 </span>
//               </div>
//             </div>
            
//             <div className="flex gap-4 overflow-x-auto pb-2">
//               {product.image_urls?.map((url, idx) => (
//                 <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-blue-600 scale-95' : 'border-transparent'}`}>
//                   <img src={url} className="w-full h-full object-cover" alt="" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT: INFO & DYNAMIC SELLER */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
//               <div>
//                 <h1 className="text-3xl font-black text-[#0F172A] leading-tight mb-3 uppercase tracking-tighter">{product.title}</h1>
//                 <div className="flex items-center gap-4 text-gray-400">
//                   <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
//                     <MapPin className="w-3.5 h-3.5 text-blue-500" /> {product.city || 'Mogadishu'}
//                   </div>
//                 </div>
//               </div>

//               <div className="py-6 border-y border-gray-50 flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Price</p>
//                   <p className="text-4xl font-black text-blue-600 tracking-tighter">${product.price}</p>
//                 </div>
//                 <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2">
//                   <Tag className="w-4 h-4 text-blue-600" />
//                   <span className="text-[10px] font-black text-blue-700 uppercase">{product.condition || 'New'}</span>
//                 </div>
//               </div>

//               {/* <Button 
//                 className="w-full h-14 bg-[#0F172A] hover:bg-blue-700 text-white rounded-2xl font-bold text-lg"
//                 onClick={() => user ? router.push(`/messages?sellerId=${(product as any).seller_id}`) : router.push('/auth/login')}
//               >
//                 Contact Seller
//               </Button> */}
//               {/* // Meesha uu ku yaal Button-ka Contact Seller */}
//               <Button 
//                 className="w-full h-14 bg-[#0F172A] hover:bg-blue-700 text-white rounded-2xl font-bold text-lg"
//                 onClick={() => {
//                   const sellerId = (product as any).seller_id;
//                   const productTitle = product.title;
//                   if (user) {
//                     router.push(`/messages?sellerId=${sellerId}&product=${encodeURIComponent(productTitle)}`);
//                   } else {
//                     router.push('/auth/login');
//                   }
//                 }}
//               >
//                 Contact Seller
//               </Button>
//             </div>

//             {/* FULLY DYNAMIC SELLER CARD */}
//             <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
//               <h3 className="font-black text-[#0F172A] uppercase text-[10px] tracking-widest mb-4">Sold By</h3>
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center font-black text-[#0F172A] border border-gray-100 uppercase">
//                    {seller?.fullName?.[0] || 'U'}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <h4 className="font-bold text-[#0F172A] text-sm">{seller?.fullName || 'Loading Seller...'}</h4>
//                     {seller?.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-green-500" />}
//                   </div>
//                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
//                     {seller?.location || 'Somalia'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-7">
//             <Card className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
//               <h3 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tight flex items-center gap-3">
//                 <div className="w-1.5 h-6 bg-blue-600 rounded-full" /> Description
//               </h3>
//               <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{product.description}</p>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { db } from '@/lib/firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import type { Product, User as UserType } from '@/lib/types';
// import { Heart, MapPin, Share2, ArrowLeft, MessageCircle, ShieldCheck, Tag, Clock } from 'lucide-react';

// export default function ListingDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { user } = useAuth();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [seller, setSeller] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   const id = params.id as string;

//   useEffect(() => {
//     const fetchProductAndSeller = async () => {
//       try {
//         const docRef = doc(db, 'products', id);
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//           const productData = {
//             id: docSnap.id,
//             ...docSnap.data(),
//           } as Product;
//           setProduct(productData);

//           const sellerId = (productData as any).seller_id;
//           if (sellerId) {
//             const sellerRef = doc(db, 'users', sellerId);
//             const sellerSnap = await getDoc(sellerRef);
//             if (sellerSnap.exists()) {
//               setSeller(sellerSnap.data() as UserType);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchProductAndSeller();
//   }, [id]);

//   if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">Loading...</div>;
//   if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
//       <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
//         <Button variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm border border-gray-100" onClick={() => router.back()}>
//           <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
//         </Button>
//         <div className="flex gap-2">
//           <Button variant="outline" size="icon" className="rounded-xl border-gray-100 bg-white"><Share2 className="w-4 h-4" /></Button>
//           <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="rounded-xl border-gray-100 bg-white">
//             <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
//           </Button>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-7 space-y-4">
//             <div className="aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative">
//               <img src={product.image_urls?.[selectedImageIndex] || '/placeholder.jpg'} className="w-full h-full object-cover" alt="" />
//               <div className="absolute top-6 left-6">
//                 <span className="bg-[#0F172A] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">{product.category}</span>
//               </div>
//             </div>
//             <div className="flex gap-4 overflow-x-auto pb-2">
//               {product.image_urls?.map((url, idx) => (
//                 <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-blue-600 scale-95' : 'border-transparent'}`}>
//                   <img src={url} className="w-full h-full object-cover" alt="" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
//               <div>
//                 <h1 className="text-3xl font-black text-[#0F172A] leading-tight mb-3 uppercase tracking-tighter">{product.title}</h1>
//                 <div className="flex items-center gap-4 text-gray-400">
//                   <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
//                     <MapPin className="w-3.5 h-3.5 text-blue-500" /> {product.city || 'Mogadishu'}
//                   </div>
//                 </div>
//               </div>

//               <div className="py-6 border-y border-gray-50 flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Price</p>
//                   <p className="text-4xl font-black text-blue-600 tracking-tighter">${product.price}</p>
//                 </div>
//                 <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2">
//                   <Tag className="w-4 h-4 text-blue-600" />
//                   <span className="text-[10px] font-black text-blue-700 uppercase">{product.condition || 'New'}</span>
//                 </div>
//               </div>

             

//               {/* // Meesha uu ku jiro Button-ka "Contact Seller" */}
//                 {user?.uid !== (product as any).seller_id ? (
//                   <Button 
//                     className="w-full h-14 bg-[#0F172A] hover:bg-blue-700 text-white rounded-2xl font-bold text-lg"
//                     onClick={() => {
//                       const sellerId = (product as any).seller_id;
//                       const pTitle = product.title;
//                       const pImg = product.image_urls?.[0] || '';
//                       const pPrice = product.price;
//                       const pId = product.id;

//                       // Xogta URL-ka ayaan ku rarnaa si Messages page-ka uu u noqdo FAST
//                       router.push(`/messages?sellerId=${sellerId}&pTitle=${encodeURIComponent(pTitle)}&pImg=${encodeURIComponent(pImg)}&pPrice=${pPrice}&pId=${pId}`);
//                     }}
//                   >
//                     Contact Seller
//                   </Button>
//                 ) : (
//                   <div className="p-4 bg-gray-50 rounded-2xl text-center text-sm font-medium text-gray-500 border border-dashed">
//                     This is your listing
//                   </div>
//                 )}
//             </div>

//             <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
//               <h3 className="font-black text-[#0F172A] uppercase text-[10px] tracking-widest mb-4">Sold By</h3>
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center font-black text-[#0F172A] border border-gray-100 uppercase">
//                    {seller?.fullName?.[0] || 'U'}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <h4 className="font-bold text-[#0F172A] text-sm">{seller?.fullName || 'Loading Seller...'}</h4>
//                     {seller?.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-green-500" />}
//                   </div>
//                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{seller?.location || 'Somalia'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-7">
//             <Card className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
//               <h3 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tight flex items-center gap-3">
//                 <div className="w-1.5 h-6 bg-blue-600 rounded-full" /> Description
//               </h3>
//               <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{product.description}</p>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { db } from '@/lib/firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import type { Product, User as UserType } from '@/lib/types';
// import { 
//   Heart, MapPin, Share2, ArrowLeft, MessageCircle, 
//   ShieldCheck, Tag, Clock, CheckCircle2, Info
// } from 'lucide-react';

// export default function ListingDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { user } = useAuth();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [seller, setSeller] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   const id = params.id as string;

//   useEffect(() => {
//     const fetchProductAndSeller = async () => {
//       try {
//         const docRef = doc(db, 'products', id);
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//           const productData = { id: docSnap.id, ...docSnap.data() } as Product;
//           setProduct(productData);

//           const sellerId = (productData as any).seller_id;
//           if (sellerId) {
//             const sellerRef = doc(db, 'users', sellerId);
//             const sellerSnap = await getDoc(sellerRef);
//             if (sellerSnap.exists()) {
//               setSeller(sellerSnap.data() as UserType);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchProductAndSeller();
//   }, [id]);

//  const renderSpecifications = () => {
//     if (!product) return null;
    
//     const hideKeys = [
//       'id', 'seller_id', 'image_urls', 'images', 'created_at', 
//       'status', 'visibility', 'views', 'category', 'description', 
//       'title', 'price', 'city'
//     ];

//     // Cilada 'value' waxaa lagu xalliyey in halkan lagu daro [key, value]
//     const specs = Object.entries(product).filter(([key, value]) => {
//       const isHidden = hideKeys.includes(key.toLowerCase());
      
//       // Cilada labaad: TypeScript waxay u baahan tahay inaan u sheegno in 'key' ay ku dhex jirto 'product'
//       const hasValue = value !== null && value !== undefined && value !== '';
      
//       const currentVal = product[key as keyof typeof product];
//       const isUrl = typeof currentVal === 'string' && currentVal.startsWith('http');
      
//       return !isHidden && hasValue && !isUrl;
//     });

//     if (specs.length === 0) return null;

//     return (
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//         {specs.map(([key, value]) => (
//           <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
//               {key.replace(/_/g, ' ').replace('isnegotiable', 'Negotiable')}
//             </p>
//             <p className="text-sm font-bold text-slate-900">
//               {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
//             </p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
//     <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//   </div>;
  
//   if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Listing not found</div>;

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
//       {/* NAVIGATION BAR */}
//       <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
//         <Button variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm border border-gray-100" onClick={() => router.back()}>
//           <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
//         </Button>
//         <div className="flex gap-2">
//           <Button variant="outline" size="icon" className="rounded-xl border-gray-100 bg-white"><Share2 className="w-4 h-4" /></Button>
//           <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="rounded-xl border-gray-100 bg-white">
//             <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
//           </Button>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* LEFT: IMAGES & SPECS */}
//           <div className="lg:col-span-7 space-y-6">
//             <div className="aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative group">
//               <img src={product.image_urls?.[selectedImageIndex] || '/placeholder.jpg'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={product.title} />
//               <div className="absolute top-6 left-6">
//                 <span className="bg-[#0F172A] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl border border-white/10">{product.category}</span>
//               </div>
//             </div>

//             {/* Thumbnails */}
//             <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
//               {product.image_urls?.map((url, idx) => (
//                 <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-blue-600 scale-95 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}>
//                   <img src={url} className="w-full h-full object-cover" alt="" />
//                 </button>
//               ))}
//             </div>

//             {/* Dynamic Specifications */}
//             <Card className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
//                <h3 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tight flex items-center gap-3">
//                 <div className="w-1.5 h-6 bg-blue-600 rounded-full" /> Details & Specs
//               </h3>
//               {renderSpecifications()}
//               {!renderSpecifications() && <p className="text-slate-400 text-sm">No specific details available for this item.</p>}
//             </Card>

//             {/* Description */}
//             <Card className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
//               <h3 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tight flex items-center gap-3">
//                 <div className="w-1.5 h-6 bg-blue-600 rounded-full" /> Description
//               </h3>
//               <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{product.description}</p>
//             </Card>
//           </div>

//           {/* RIGHT: PRICING & SELLER */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-8 sticky top-6">
//               <div>
//                 <h1 className="text-3xl font-black text-[#0F172A] leading-tight mb-4 uppercase tracking-tighter">{product.title}</h1>
//                 <div className="flex items-center gap-2 text-slate-400">
//                   <MapPin className="w-4 h-4 text-blue-500" />
//                   <span className="text-xs font-black uppercase tracking-widest">{product.city || 'Somalia'}</span>
//                 </div>
//               </div>

//               <div className="py-8 border-y border-slate-50 flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Price</p>
//                   <p className="text-5xl font-black text-blue-600 tracking-tighter">${product.price}</p>
//                 </div>
//                 <div className="bg-blue-50 px-5 py-2.5 rounded-2xl flex items-center gap-2">
//                   <Tag className="w-4 h-4 text-blue-600" />
//                   <span className="text-[11px] font-black text-blue-700 uppercase">{product.condition || 'Used'}</span>
//                 </div>
//               </div>

//               {/* Contact Button */}
//               {user?.uid !== (product as any).seller_id ? (
//                 <Button 
//                   className="w-full h-16 bg-[#0F172A] hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-900/10 transition-all active:scale-95"
//                   onClick={() => {
//                     const sellerId = (product as any).seller_id;
//                     const pTitle = product.title;
//                     const pImg = product.image_urls?.[0] || '';
//                     const pPrice = product.price;
//                     const pId = product.id;
//                     router.push(`/messages?sellerId=${sellerId}&pTitle=${encodeURIComponent(pTitle)}&pImg=${encodeURIComponent(pImg)}&pPrice=${pPrice}&pId=${pId}`);
//                   }}
//                 >
//                   <MessageCircle className="w-5 h-5 mr-3" />
//                   Contact Seller
//                 </Button>
//               ) : (
//                 <div className="p-4 bg-slate-50 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border border-dashed border-slate-200">
//                   This is your listing
//                 </div>
//               )}

//               {/* Seller Info */}
//               <div className="pt-4">
//                 <h3 className="font-black text-[#0F172A] uppercase text-[10px] tracking-widest mb-4">Marketplace Seller</h3>
//                 <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
//                   <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-blue-600 border border-slate-100 uppercase">
//                     {seller?.fullName?.[0] || 'U'}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-bold text-slate-900 text-sm">{seller?.fullName || 'Beecsan User'}</h4>
//                       {seller?.isVerified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
//                     </div>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{seller?.location || 'Somalia'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Safety Tip */}
//               <div className="bg-amber-50/50 p-4 rounded-2xl flex gap-3 border border-amber-100">
//                 <Info className="w-5 h-5 text-amber-600 shrink-0" />
//                 <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
//                   <strong>Safety Tip:</strong> Meet the seller in a public place. Don't send money before seeing the item.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Product, User as UserType } from '@/lib/types';
import { 
  Heart, MapPin, Share2, ArrowLeft, MessageCircle, 
  Tag, CheckCircle2, Info, Phone, AlertTriangle, X
} from 'lucide-react';

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Report States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const id = params.id as string;
  const BEECSAN_PHONE = "+252616664995"; 

  useEffect(() => {
    const fetchProductAndSeller = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);

          const sellerId = (productData as any).seller_id;
          if (sellerId) {
            const sellerRef = doc(db, 'users', sellerId);
            const sellerSnap = await getDoc(sellerRef);
            if (sellerSnap.exists()) {
              setSeller(sellerSnap.data() as UserType);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductAndSeller();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: `Ka eeg ${product?.title} gudaha Beecsan!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link-ga waa la koobiyeeyay!');
    }
  };

  const handleReportSubmit = async () => {
    if (!user) return router.push('/auth/login');
    if (!reportReason.trim()) return;

    setIsReporting(true);
    try {
      const reportId = `report_${Date.now()}_${user.uid}`;
      await setDoc(doc(db, 'reports', reportId), {
        reporterId: user.uid,
        productId: product?.id,
        sellerId: (product as any).seller_id,
        reason: reportReason,
        status: 'pending',
        createdAt: serverTimestamp(),
        productTitle: product?.title
      });
      alert('Mahadsanid! Warbixintaada waa la helay, waana baarayaa Admin-ka.');
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.error("Report error:", error);
      alert('Khalad ayaa dhacay, fadlan mar kale isku day.');
    } finally {
      setIsReporting(false);
    }
  };

  const renderSpecifications = () => {
    if (!product) return null;
    const hideKeys = ['id', 'seller_id', 'image_urls', 'images', 'created_at', 'status', 'visibility', 'views', 'category', 'description', 'title', 'price', 'city'];
    const specs = Object.entries(product).filter(([key, value]) => {
      const isHidden = hideKeys.includes(key.toLowerCase());
      const hasValue = value !== null && value !== undefined && value !== '';
      const currentVal = product[key as keyof typeof product];
      const isUrl = typeof currentVal === 'string' && currentVal.startsWith('http');
      return !isHidden && hasValue && !isUrl;
    });
    if (specs.length === 0) return null;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {specs.map(([key, value]) => (
          <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {key.replace(/_/g, ' ').replace('isnegotiable', 'Negotiable')}
            </p>
            <p className="text-sm font-bold text-slate-900">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Listing not found</div>;

  const isProperty = product.category?.toLowerCase() === 'property';
  const targetPhone = isProperty ? BEECSAN_PHONE : (seller?.phone || seller?.phoneNumber || '');

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm border border-gray-100" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare} className="rounded-xl border-gray-100 bg-white"><Share2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="rounded-xl border-gray-100 bg-white">
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative group">
              <img src={product.image_urls?.[selectedImageIndex] || '/placeholder.jpg'} className="w-full h-full object-cover" alt={product.title} />
              <div className="absolute top-6 left-6">
                <span className="bg-[#0F172A] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl border border-white/10">{product.category}</span>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.image_urls?.map((url, idx) => (
                <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-blue-600 scale-95 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>

            <Card className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tight flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full" /> Details & Specs</h3>
              {renderSpecifications()}
            </Card>

            <Card className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tight flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full" /> Description</h3>
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{product.description}</p>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-8 sticky top-6">
              <div>
                <h1 className="text-3xl font-black text-[#0F172A] leading-tight mb-4 uppercase tracking-tighter">{product.title}</h1>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest">{product.city || 'Somalia'}</span>
                </div>
              </div>

              <div className="py-8 border-y border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Price</p>
                  <p className="text-5xl font-black text-blue-600 tracking-tighter">${product.price}</p>
                </div>
                <div className="bg-blue-50 px-5 py-2.5 rounded-2xl flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-[11px] font-black text-blue-700 uppercase">{product.condition || 'Used'}</span>
                </div>
              </div>

              <div className="space-y-3">
                {user?.uid !== (product as any).seller_id ? (
                  <>
                    <Button 
                      className="w-full h-16 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95"
                      onClick={() => {
                        const message = encodeURIComponent(`Asc, waxaan rabaa: ${product.title}`);
                        window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-3" />
                      WhatsApp {isProperty ? '(Beecsan)' : ''}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="h-14 rounded-2xl border-gray-200 font-bold flex items-center justify-center gap-2"
                        onClick={() => window.open(`tel:${targetPhone}`)}
                      >
                        <Phone className="w-4 h-4" /> Call {isProperty ? 'Beecsan' : ''}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-14 rounded-2xl border-gray-200 font-bold flex items-center justify-center gap-2"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4" /> Share
                      </Button>
                    </div>

                    {!isProperty && (
                       <Button 
                        variant="ghost"
                        className="w-full h-14 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl font-bold border border-slate-100"
                        onClick={() => {
                          const sellerId = (product as any).seller_id;
                          router.push(`/messages?sellerId=${sellerId}&pTitle=${encodeURIComponent(product.title)}&pImg=${encodeURIComponent(product.image_urls?.[0] || '')}&pPrice=${product.price}&pId=${product.id}`);
                        }}
                      >
                        Chat on Beecsan
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border border-dashed border-slate-200">
                    This is your listing
                  </div>
                )}
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-[#0F172A] uppercase text-[10px] tracking-widest">Marketplace Seller</h3>
                  {user?.uid !== (product as any).seller_id && (
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="flex items-center gap-1 text-[10px] font-black text-red-400 uppercase hover:text-red-600 transition-colors"
                    >
                      <AlertTriangle className="w-3 h-3" /> Report
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-blue-600 border border-slate-100 uppercase">
                    {isProperty ? 'B' : (seller?.fullName?.[0] || 'U')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{isProperty ? 'Beecsan Property' : (seller?.fullName || 'Beecsan User')}</h4>
                      {seller?.isVerified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{seller?.location || 'Somalia'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl flex gap-3 border border-amber-100">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  <strong>Safety Tip:</strong> Meet the seller in a public place. Don't send money before seeing the item.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-md" onClick={() => setShowReportModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Report Listing
              </h3>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Reason for reporting</p>
            <textarea 
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Maxaad u report gareynaysaa alaabtan? (Tusaale: Waa been, Qiimuhu ma saxna, iwm)"
              className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 outline-none resize-none mb-6"
            />
            
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowReportModal(false)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
              <Button 
                onClick={handleReportSubmit}
                disabled={isReporting || !reportReason.trim()}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200"
              >
                {isReporting ? 'Reporting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}