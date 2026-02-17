'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  User, 
  Phone, 
  MapPin, 
  FileText 
} from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // 2. Load User Data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  // 3. Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when typing
    if (errorMsg) setErrorMsg('');
  };

  // 4. Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!user?.uid) throw new Error("User ID not found");

      // Validation
      if (!formData.fullName.trim()) {
        throw new Error("Fadlan geli magacaaga oo buuxa.");
      }

      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        updatedAt: new Date(),
      });

      setSuccessMsg("Profile-kaaga waa la cusbooneysiiyay!");
      
      // Redirect after 1.5s
      setTimeout(() => {
        router.push('/profile');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Khalad ayaa dhacay. Fadlan isku day mar kale.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-2xl mx-auto h-16 px-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-slate-100 -ml-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </Button>
          <h1 className="font-black text-lg text-slate-900 uppercase tracking-wide">Edit Profile</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-slate-200 mb-4">
            {formData.fullName?.charAt(0).toUpperCase() || "U"}
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase">Profile Photo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SUCCESS MESSAGE */}
          {successMsg && (
            <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 font-bold text-sm">{successMsg}</p>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-bold text-sm">{errorMsg}</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
            
            {/* FULL NAME */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+252..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400 transition-all outline-none"
                />
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Mogadishu, Somalia"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400 transition-all outline-none"
                />
              </div>
            </div>

            {/* BIO */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Bio
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400 transition-all outline-none resize-none"
                />
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-wide hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full h-12 text-slate-500 font-bold uppercase tracking-wide hover:bg-slate-100 rounded-2xl"
            >
              Cancel
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}