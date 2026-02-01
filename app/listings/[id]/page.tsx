'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Product, User as UserType } from '@/lib/types';
import { Heart, MapPin, Share2, ArrowLeft, MessageCircle, ShieldCheck, Tag, Clock } from 'lucide-react';

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<UserType | null>(null); // State for the fetched seller
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const id = params.id as string;

  useEffect(() => {
    const fetchProductAndSeller = async () => {
      try {
        // 1. Fetch Product
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data(),
          } as Product;
          setProduct(productData);

          // 2. Fetch Seller dynamically using seller_id from the product doc
          const sellerId = (productData as any).seller_id; // Using seller_id as seen in your DB screenshot
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

    if (id) {
      fetchProductAndSeller();
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      {/* NAVIGATION ONLY */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm border border-gray-100" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-xl border-gray-100 bg-white"><Share2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="rounded-xl border-gray-100 bg-white">
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative">
              <img
                src={product.image_urls?.[selectedImageIndex] || '/placeholder.jpg'}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute top-6 left-6">
                <span className="bg-[#0F172A] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.image_urls?.map((url, idx) => (
                <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-blue-600 scale-95' : 'border-transparent'}`}>
                  <img src={url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: INFO & DYNAMIC SELLER */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
              <div>
                <h1 className="text-3xl font-black text-[#0F172A] leading-tight mb-3 uppercase tracking-tighter">{product.title}</h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> {product.city || 'Mogadishu'}
                  </div>
                </div>
              </div>

              <div className="py-6 border-y border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Price</p>
                  <p className="text-4xl font-black text-blue-600 tracking-tighter">${product.price}</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-700 uppercase">{product.condition || 'New'}</span>
                </div>
              </div>

              <Button 
                className="w-full h-14 bg-[#0F172A] hover:bg-blue-700 text-white rounded-2xl font-bold text-lg"
                onClick={() => user ? router.push(`/messages?sellerId=${(product as any).seller_id}`) : router.push('/auth/login')}
              >
                Contact Seller
              </Button>
            </div>

            {/* FULLY DYNAMIC SELLER CARD */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
              <h3 className="font-black text-[#0F172A] uppercase text-[10px] tracking-widest mb-4">Sold By</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center font-black text-[#0F172A] border border-gray-100 uppercase">
                   {seller?.fullName?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#0F172A] text-sm">{seller?.fullName || 'Loading Seller...'}</h4>
                    {seller?.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-green-500" />}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {seller?.location || 'Somalia'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" /> Description
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{product.description}</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}