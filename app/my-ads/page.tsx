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
  Pencil,
  Search,
  X,
  CheckCircle2,
  Clock,
  Tag,
  DollarSign
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
  const [searchTerm, setSearchTerm] = useState('');

  // EDIT STATE
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ title: '', price: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  const tab = searchParams.get('status') === 'sold' ? 'sold' : 'active';

  /* =========================
     FETCH MY ADS
  ========================= */
  useEffect(() => {
    if (authLoading) return;

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

  // --- EDIT FUNCTIONS ---
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title,
      price: product.price.toString(),
      description: product.description || ''
    });
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), {
        title: editForm.title,
        price: Number(editForm.price),
        description: editForm.description,
        updated_at: serverTimestamp(),
      });
      setEditingProduct(null); // Close modal
    } catch (err) {
      console.error("Error updating", err);
      alert("Error updating product");
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
     FILTER & SEARCH LOGIC
  ========================= */
  const visibleProducts = products.filter((p) => {
    // 1. Tab Filter
    let matchesTab = false;
    if (tab === 'sold') {
      matchesTab = p.status === 'sold';
    } else {
      // Fix: Cast explicitly to string to allow 'pending' comparison
      matchesTab = p.status === 'approved' || (p.status as string) === 'pending';
    }

    // 2. Search Filter
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Calculate Stats
  const stats = {
    total: products.length,
    // Fix: Cast to string for pending check
    active: products.filter(p => p.status === 'approved' || (p.status as string) === 'pending').length,
    sold: products.filter(p => p.status === 'sold').length
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
      <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center px-4 sticky top-0 z-40">
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
            className="rounded-2xl font-bold bg-slate-900 text-white shadow-lg shadow-slate-200"
          >
            <Plus className="w-4 h-4 mr-2" /> New Ad
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* STATS BAR */}
        <div className="grid grid-cols-3 gap-4 mb-8">
           <div className="bg-white p-4 rounded-2xl border shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Ads</span>
              <p className="text-2xl font-black">{stats.total}</p>
           </div>
           <div className="bg-white p-4 rounded-2xl border shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Active</span>
              <p className="text-2xl font-black text-green-600">{stats.active}</p>
           </div>
           <div className="bg-white p-4 rounded-2xl border shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Sold</span>
              <p className="text-2xl font-black text-slate-500">{stats.sold}</p>
           </div>
        </div>

        {/* INDEX WARNING */}
        {indexError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Firestore Index ayaa dhiman — eeg Console si aad u abuurto.
          </div>
        )}

        {/* TABS & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex p-1.5 bg-white border border-slate-200 rounded-[20px] w-full md:w-96">
            <button
              onClick={() => router.push('/my-ads?status=active')}
              className={`flex-1 py-3 rounded-[15px] font-black text-xs uppercase transition-all ${
                tab !== 'sold'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Active & Pending
            </button>
            <button
              onClick={() => router.push('/my-ads?status=sold')}
              className={`flex-1 py-3 rounded-[15px] font-black text-xs uppercase transition-all ${
                tab === 'sold'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Sold History
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search your ads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* EMPTY STATE */}
        {visibleProducts.length === 0 ? (
          <div className="text-center py-32 bg-white border rounded-[40px] border-dashed">
            <Package className="w-20 h-20 mx-auto text-slate-200 mb-6" />
            <h2 className="text-xl font-black">NO ADS FOUND</h2>
            {searchTerm && <p className="text-slate-400 mt-2">Try a different search term</p>}
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[35px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-56">
                  <Image
                    src={product.image_urls?.[0] || '/placeholder.png'}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {(product.status as string) === 'pending' && (
                        <span className="bg-orange-500/90 backdrop-blur text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock size={10} /> PENDING
                        </span>
                    )}
                    {product.status === 'approved' && (
                        <span className="bg-green-500/90 backdrop-blur text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                            <CheckCircle2 size={10} /> ACTIVE
                        </span>
                    )}
                    {product.status === 'sold' && (
                        <span className="bg-slate-800/90 backdrop-blur text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                            <Tag size={10} /> SOLD
                        </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1 truncate" title={product.title}>
                    {product.title}
                  </h3>
                  <p className="text-slate-900 font-black text-xl mb-4">
                    ${Number(product.price).toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    {/* BUTTONS LOGIC */}
                    {tab !== 'sold' ? (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-2xl font-bold border-slate-200 hover:bg-slate-50"
                          onClick={() => handleEditClick(product)}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                        </Button>

                        {/* Sold button only if active (not pending) */}
                        {product.status === 'approved' && (
                            <Button
                            variant="outline"
                            className="flex-1 rounded-2xl font-bold border-slate-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                            onClick={() => markAsSold(product.id)}
                            >
                            Sold
                            </Button>
                        )}
                      </>
                    ) : (
                      <div className="flex-1 text-center py-2 text-sm font-bold text-slate-400 bg-slate-50 rounded-2xl">
                        Item Sold
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      className="rounded-2xl w-12 text-slate-400 hover:text-red-500 hover:bg-red-50"
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

      {/* =========================
          EDIT MODAL
      ========================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-black text-slate-900">Edit Listing</h2>
              <button 
                onClick={() => setEditingProduct(null)}
                className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price ($)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  onClick={() => setEditingProduct(null)}
                  variant="outline" 
                  className="flex-1 rounded-xl font-bold h-12 border-slate-200"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveEdit}
                  disabled={isSaving}
                  className="flex-1 rounded-xl font-bold h-12 bg-slate-900 text-white hover:bg-slate-800"
                >
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}