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
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Loader2,
  Package,
  Trash2,
  Plus,
  AlertCircle,
} from 'lucide-react';
import Image from 'next/image';

/* =========================
   PAGE WRAPPER
========================= */
export default function MyAdsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" />
        </div>
      }
    >
      <MyAdsContent />
    </Suspense>
  );
}

/* =========================
   CONTENT
========================= */
function MyAdsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState(false);

  const tab =
    searchParams.get('status') === 'sold' ? 'sold' : 'approved';

  /* =========================
     FETCH MY ADS (FIXED)
  ========================= */
  useEffect(() => {
    // ❗ WAIT FOR AUTH
    if (authLoading) return;

    // ❗ NO USER → STOP
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setIndexError(false);

    const q = query(
      collection(db, 'products'),
      where('seller_id', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        console.log('MY ADS:', data); // DEBUG
        setProducts(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        if (error.message.includes('index')) {
          setIndexError(true);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  /* =========================
     FILTER TABS
  ========================= */
  const visibleProducts = products.filter((p) => {
  if (tab === 'sold') return p.status === 'sold';
  return p.status === 'approved';
});


  /* =========================
     ACTIONS
  ========================= */
  const markAsSold = async (id: string) => {
    await updateDoc(doc(db, 'products', id), {
      status: 'sold',
      updated_at: serverTimestamp(),
    });
  };

  const deleteAd = async (id: string) => {
    if (!confirm('Ma hubtaa inaad tirtirayso xayeysiintan?')) return;
    await deleteDoc(doc(db, 'products', id));
  };

  /* =========================
     LOADING
  ========================= */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* HEADER */}
      <header className="h-20 bg-white border-b flex items-center px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.push('/profile')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-black text-xl uppercase tracking-tighter">
              Manage My Ads
            </h1>
          </div>

          <Button
            onClick={() => router.push('/listings/create')}
            className="rounded-2xl font-bold bg-slate-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> New Ad
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* INDEX WARNING */}
        {indexError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Firestore Index ayaa dhiman — eeg Console si aad u abuurto.
          </div>
        )}

        {/* TABS */}
        <div className="flex p-1.5 bg-slate-200/50 rounded-[20px] w-full max-w-sm mb-10">
          <button
            onClick={() => router.push('/my-ads?status=approved')}
            className={`flex-1 py-3 rounded-[15px] font-black text-xs uppercase ${
              tab === 'approved'
                ? 'bg-white shadow text-primary'
                : 'text-slate-500'
            }`}
          >
            approved
          </button>
          <button
            onClick={() => router.push('/my-ads?status=sold')}
            className={`flex-1 py-3 rounded-[15px] font-black text-xs uppercase ${
              tab === 'sold'
                ? 'bg-white shadow text-primary'
                : 'text-slate-500'
            }`}
          >
            Sold
          </button>
        </div>

        {/* EMPTY */}
        {visibleProducts.length === 0 ? (
          <div className="text-center py-32 bg-white border rounded-[40px] border-dashed">
            <Package className="w-20 h-20 mx-auto text-slate-200 mb-6" />
            <h2 className="text-xl font-black">NO ADS FOUND</h2>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[35px] overflow-hidden border shadow-sm"
              >
                <div className="relative h-56">
                  <Image
                    src={product.image_urls?.[0] || '/placeholder.png'}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">
                    {product.title}
                  </h3>
                  <p className="text-primary font-black text-xl mb-4">
                    ${product.price}
                  </p>

                  <div className="flex gap-2">
                    {tab === 'approved' && (
                      <Button
                        variant="outline"
                        className="flex-1 rounded-2xl"
                        onClick={() => markAsSold(product.id)}
                      >
                        Mark Sold
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="rounded-2xl w-12 text-red-500"
                      onClick={() => deleteAd(product.id)}
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
