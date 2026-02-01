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
  Edit3
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 bg-primary rounded-xl animate-bounce" />
      </div>
    );

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
              className="rounded-xl hover:bg-muted"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <span className="font-bold text-foreground uppercase tracking-tight text-lg">My Profile</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10 font-bold text-xs uppercase tracking-widest rounded-xl"
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
            {/* Avatar */}
            <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-primary/20">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight">
                  {user.fullName}
                </h1>
                {user.isVerified && <ShieldCheck className="w-6 h-6 text-primary fill-primary" />}
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Listings</span>
                  <span className="text-2xl font-bold text-foreground">{user.totalProducts || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sales</span>
                  <span className="text-2xl font-bold text-foreground">{user.completedSales || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-foreground">{(user.rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => router.push('/profile/edit')}
              className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 h-12 font-bold flex gap-2 whitespace-nowrap"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <Settings className="w-64 h-64" />
          </div>
        </div>

        {/* ACTION TILES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => router.push('/listings/create')}
            className="group bg-surface p-8 rounded-3xl border border-border shadow-sm hover:border-primary transition-all text-left relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
              <ShoppingBag className="w-6 h-6 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">Post New Ad</h3>
            <p className="text-muted-foreground text-sm font-medium mt-1">Sell your items fast to millions</p>
          </button>

          <button 
            onClick={() => router.push('/favorites')}
            className="group bg-surface p-8 rounded-3xl border border-border shadow-sm hover:border-secondary transition-all text-left relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-secondary transition-colors">
              <Heart className="w-6 h-6 text-secondary group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">Saved Items</h3>
            <p className="text-muted-foreground text-sm font-medium mt-1">Items you&apos;re keeping an eye on</p>
          </button>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-tight">Account Details</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary" /> Email Address
              </label>
              <p className="text-foreground font-bold text-lg">{user.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-3 h-3 text-primary" /> Phone Number
              </label>
              <p className="text-foreground font-bold text-lg">{user.phoneNumber || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-3 h-3 text-primary" /> Location
              </label>
              <p className="text-foreground font-bold text-lg">{user.location || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
