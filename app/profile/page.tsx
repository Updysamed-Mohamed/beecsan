'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  LogOut, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone,
  ArrowLeft,
  Edit3,
  Package,
  ChevronRight,
  Clock,
  Loader2,
  User,
  Settings,
  Bell
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [stats, setStats] = useState({ activeAds: 0, soldAds: 0 });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Fetch Stats (Optional: If you want real numbers)
  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        const q = query(collection(db, 'products'), where('seller_id', '==', user.uid));
        const snap = await getDocs(q);
        const products = snap.docs.map(d => d.data());
        setStats({
          activeAds: products.filter(p => p.status === 'approved' || p.status === 'pending').length,
          soldAds: products.filter(p => p.status === 'sold').length,
        });
      };
      fetchStats();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-24">
      
      {/* HEADER: STUCK & GLASS EFFECT */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-slate-100 -ml-2"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-6 h-6 text-slate-800" />
            </Button>
            <span className="font-black text-xl text-slate-900 tracking-tight">Profile</span>
          </div>
          
          <div className="flex items-center gap-2">
              <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-red-500 font-bold text-xs uppercase tracking-wider hover:bg-red-50 hover:text-red-600 rounded-xl px-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
        {/* PROFILE HERO CARD */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl -z-10 opacity-60 transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-slate-900 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-slate-900/20 transform group-hover:scale-105 transition-transform duration-300">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
                   <ShieldCheck className="w-6 h-6 text-blue-500 fill-blue-500" />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {user.fullName}
              </h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                 <MapPin size={16} /> {user.location || 'Somalia'}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-6 pt-6 border-t border-slate-50">
                <div className="text-center md:text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ads</span>
                  <p className="text-2xl font-black text-slate-900">{stats.activeAds + stats.soldAds}</p>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sold</span>
                  <p className="text-2xl font-black text-slate-900">{stats.soldAds}</p>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                  <div className="flex items-center justify-center md:justify-start gap-1">
                    <span className="text-2xl font-black text-slate-900">4.8</span>
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mb-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button 
              onClick={() => router.push('/profile/edit')}
              variant="outline"
              className="rounded-2xl px-6 h-12 font-bold border-2 border-slate-100 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* MANAGE ADS CARD */}
           <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <Package className="w-5 h-5 text-slate-400" /> My Listings
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={() => router.push('/my-ads?status=active')}
                   className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
                 >
                    <span className="text-3xl font-black text-slate-900 mb-1 group-hover:scale-110 transition-transform">{stats.activeAds}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase">Active</span>
                 </button>
                 <button 
                   onClick={() => router.push('/my-ads?status=sold')}
                   className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
                 >
                    <span className="text-3xl font-black text-slate-900 mb-1 group-hover:scale-110 transition-transform">{stats.soldAds}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase">Sold</span>
                 </button>
              </div>

              <Button 
                onClick={() => router.push('/my-ads')}
                className="w-full h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                 Manage All Ads
              </Button>
           </div>

           {/* ACTIONS CARD */}
           <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <ShoppingBag className="w-5 h-5 text-slate-400" /> Quick Actions
              </h2>
              
              <div className="space-y-3">
                <button 
                   onClick={() => router.push('/listings/create')}
                   className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-green-50 group transition-colors"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
                         <ShoppingBag size={18} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-green-700">Post New Ad</span>
                   </div>
                   <ChevronRight size={18} className="text-slate-400 group-hover:text-green-500" />
                </button>

                <button 
                   onClick={() => router.push('/favorites')}
                   className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-pink-50 group transition-colors"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500">
                         <Heart size={18} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-pink-600">Saved Items</span>
                   </div>
                   <ChevronRight size={18} className="text-slate-400 group-hover:text-pink-500" />
                </button>
              </div>
           </div>
        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">Personal Information</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail size={20} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                  <p className="font-bold text-slate-900 text-lg">{user.email}</p>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Phone size={20} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                  <p className="font-bold text-slate-900 text-lg">{user.phone || 'Not provided'}</p>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <MapPin size={20} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Location</label>
                  <p className="font-bold text-slate-900 text-lg">{user.location || 'Not provided'}</p>
               </div>
            </div>
            
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Clock size={20} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Member Since</label>
                  <p className="font-bold text-slate-900 text-lg">
                    {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}