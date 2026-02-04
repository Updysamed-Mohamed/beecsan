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
  Settings,
  Edit3,
  Package,
  ChevronRight,
  Clock,
  Loader2
} from 'lucide-react';
import { useEffect } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* HEADER */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold uppercase tracking-tight text-lg">My Profile</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-destructive font-bold text-xs uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* PROFILE HERO CARD */}
        <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-28 h-28 bg-primary rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold uppercase tracking-tight">
                  {user.fullName}
                </h1>
                {user.isVerified && <ShieldCheck className="w-6 h-6 text-primary fill-primary" />}
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Listings</span>
                  <span className="text-2xl font-bold">{user.totalProducts || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Sales</span>
                  <span className="text-2xl font-bold">{user.completedSales || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{(user.rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => router.push('/profile/edit')}
              className="rounded-2xl px-6 h-12 font-bold flex gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* MANAGE ADS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-tight">Manage My Ads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/my-ads?status=active')}
                className="flex items-center justify-between p-6 bg-surface border rounded-3xl group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-muted-foreground uppercase">Active Ads</p>
                    <p className="text-2xl font-black">{user.activeAds || 0}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button 
                onClick={() => router.push('/my-ads?status=expired')}
                className="flex items-center justify-between p-6 bg-surface border rounded-3xl group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-muted-foreground uppercase">Expired</p>
                    <p className="text-2xl font-black">{user.expiredAds || 0}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-tight">Quick Actions</h2>
            <Button 
              onClick={() => router.push('/listings/create')}
              className="w-full h-16 rounded-2xl font-bold uppercase tracking-widest flex justify-start px-6 gap-4"
            >
              <ShoppingBag className="w-5 h-5" />
              Post New Ad
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/favorites')}
              className="w-full h-16 rounded-2xl font-bold uppercase tracking-widest flex justify-start px-6 gap-4"
            >
              <Heart className="w-5 h-5 text-secondary" />
              Saved Items
            </Button>
          </div>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border">
            <h2 className="text-xl font-bold uppercase tracking-tight">Account Details</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary" /> Email Address
              </label>
              <p className="font-bold text-lg">{user.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                <Phone className="w-3 h-3 text-primary" /> Phone Number
              </label>
              <p className="font-bold text-lg">{user.phone || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                <MapPin className="w-3 h-3 text-primary" /> Location
              </label>
              <p className="font-bold text-lg">{user.location || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}