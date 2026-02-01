'use client';

import React from "react"

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    location: '',
    bio: '',
  });

  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const initialData = {
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        location: user.location || '',
        bio: user.bio || '',
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  // Auto-save function
  const autoSave = useCallback(async (data: typeof formData) => {
    try {
      if (!user?.uid) throw new Error('User not found');

      // Validate required fields
      if (!data.fullName.trim()) {
        setError('Full name is required');
        return;
      }

      setSaveStatus('saving');
      setError('');

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName: data.fullName.trim(),
        phoneNumber: data.phoneNumber.trim(),
        location: data.location.trim(),
        bio: data.bio.trim(),
        updated_at: new Date(),
      });

      setSaveStatus('saved');
      setSuccess('Profile saved successfully');
      
      // Reset save status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
      setSaveStatus('idle');
      setSuccess('');
      console.error('Error auto-saving profile:', err);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    setError('');

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (1 second after user stops typing)
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave({
        ...formData,
        [name]: value,
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await autoSave(formData);
    setLoading(false);
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
              onClick={() => router.push('/profile')}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <span className="font-bold text-foreground uppercase tracking-tight text-lg">Edit Profile</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        
        {/* EDIT FORM */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm p-8">
          
          {/* AVATAR PREVIEW */}
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-primary/20">
              {formData.fullName?.charAt(0).toUpperCase() || user.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>

          <form className="space-y-6">
            
            {/* ERROR MESSAGE */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive font-medium text-sm">{error}</p>
              </div>
            )}

            {/* AUTO-SAVE STATUS */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Auto-save Status</span>
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Saved</span>
                  </>
                )}
                {saveStatus === 'idle' && (
                  <>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">All changes saved</span>
                  </>
                )}
              </div>
            </div>

            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground transition"
                required
              />
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground transition"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location (e.g., Mogadishu, Somalia)"
                className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground transition"
              />
            </div>

            {/* BIO */}
            <div>
              <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself (optional)"
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground transition resize-none"
              />
            </div>

            {/* BACK BUTTON */}
            <div className="pt-4">
              <Button
                type="button"
                onClick={() => router.push('/profile')}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 font-bold uppercase tracking-wide flex gap-2 justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </Button>
            </div>
          </form>
        </div>

        {/* INFO MESSAGE */}
        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mt-8">
          * Required fields
        </p>
      </div>
    </div>
  );
}
