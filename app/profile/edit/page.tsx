'use client';

import React from "react"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!user?.uid) throw new Error('User not found');

      if (!formData.fullName.trim()) {
        setError('Full name is required');
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        updated_at: new Date(),
      });

      setSuccess('Profile updated successfully!');
      
      // Dib ugu celi profile-ka 1.5 ilbiriqsi kadib
      setTimeout(() => {
        router.push('/profile');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 bg-primary rounded-xl animate-bounce" />
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
              className="rounded-xl hover:bg-muted"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <span className="font-bold text-foreground uppercase tracking-tight text-lg">Hagaaji Profile-ka</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-surface rounded-3xl border border-border shadow-sm p-8">
          
          {/* AVATAR PREVIEW */}
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-primary/20">
              {formData.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* MESSAGES */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive font-medium text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-600 font-medium text-sm">{success}</p>
              </div>
            )}

            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Magaca oo Dhamaystiran *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Gali magacaaga"
                className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background transition"
                required
              />
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Lambarka Taleefanka
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Tusaale: +252..."
                className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background transition"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Goobta (Location)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Tusaale: Mogadishu, Somalia"
                className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background transition"
              />
            </div>

            {/* BIO */}
            <div>
              <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Bio (Wax ka sheeg naftaada)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Warbixin kooban..."
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background transition resize-none"
              />
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-bold uppercase tracking-wide flex gap-2 justify-center shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Keydi Isbedelada
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="w-full text-muted-foreground font-bold uppercase tracking-wide h-12 rounded-2xl hover:bg-muted"
              >
                Jooji (Cancel)
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mt-8">
          * Meelaha loo baahan yahay in la buuxiyo
        </p>
      </div>
    </div>
  );
}