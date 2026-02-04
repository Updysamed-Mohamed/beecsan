'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  deleteDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Loader2, 
  Package, 
  Tag, 
  CheckCircle2, 
  Edit,
  Trash2,
  Plus,
  Eye,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

export default function MyAdsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
      <MyAdsContent />
    </Suspense>
  );
}

function MyAdsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState(false);
  
  const activeTab = searchParams.get('status') === 'sold' ? 'sold' : 'active';

  useEffect(() => {
    if (authLoading || !user) return;

    setLoading(true);
    setIndexError(false);
    
    // OGOW: Haddii 'available' ay soo bixi weydo, hubi database-kaaga waxa ugu qoran 'status'
    const dbStatus = activeTab === 'active' ? 'available' : 'sold';

    // 1. ISKU DAY QUERY-GAN (Haddii uu shaqayn waayo, ka saar 'orderBy' si aad u aragto xogta)
    const q = query(
      collection(db, 'products'),
      where('seller_id', '==', user.uid),
      where('status', '==', dbStatus),
      orderBy('updated_at', 'desc') // <-- Haddii tani keento khalad, Index ayaa dhiman
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(adsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      if (error.message.includes("requires an index")) {
        setIndexError(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, activeTab]);

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        status: newStatus,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Ma hubtaa?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="h-20 bg-white border-b flex items-center px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push('/profile')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-black text-xl uppercase tracking-tighter">Manage My Ads</h1>
          </div>
          <Button onClick={() => router.push('/listings/create')} className="rounded-2xl font-bold bg-slate-900 text-white">
            <Plus className="w-4 h-4 mr-2" /> New Ad
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Index Error Warning */}
        {indexError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>Boggani wuxuu u baahan yahay 'Firestore Index'. Fur <b>Console-ka Browser-ka</b> si aad u gujiso Link-ga abuurista index-ka.</span>
          </div>
        )}

        <div className="flex p-1.5 bg-slate-200/50 rounded-[20px] w-full max-w-sm mb-10 border border-slate-200">
          <button
            onClick={() => router.push('/my-ads?status=active')}
            className={`flex-1 py-3 rounded-[15px] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'active' ? 'bg-white shadow-md text-primary' : 'text-slate-500'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => router.push('/my-ads?status=sold')}
            className={`flex-1 py-3 rounded-[15px] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'sold' ? 'bg-white shadow-md text-primary' : 'text-slate-500'
            }`}
          >
            Sold
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-32 bg-white border rounded-[40px] border-dashed border-slate-300">
            <Package className="w-20 h-20 mx-auto text-slate-200 mb-6" />
            <h2 className="text-xl font-black text-slate-900 uppercase">No {activeTab} ads found</h2>
            <p className="text-slate-500 mt-2 text-sm italic">Hadii aad halkan ku hubto inay alaab jirto, hubi Index-ka database-ka.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-[35px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative h-56 w-full">
                  <Image 
                    src={product.image_urls?.[0] || '/placeholder.png'} 
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-2 uppercase">{product.title}</h3>
                  <p className="text-primary font-black text-xl mb-4">${product.price}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 rounded-2xl font-bold h-12"
                      variant={activeTab === 'active' ? 'outline' : 'default'}
                      onClick={() => handleStatusChange(product.id, activeTab === 'active' ? 'sold' : 'available')}
                    >
                      {activeTab === 'active' ? 'Mark Sold' : 'Re-list'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDelete(product.id)}
                      className="rounded-2xl h-12 w-12 border-red-50 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}