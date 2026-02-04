'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, User, Mail, Lock, Phone, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, resendVerification } = useAuth();
  
  // States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Resend Logic States
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Timer-ka Resend-ka
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 🛡️ Hubinta Firestore (Email & Phone)
  const validateExists = async (fullEmail: string, fullPhone: string) => {
    const emailQuery = query(collection(db, 'users'), where('email', '==', fullEmail.toLowerCase()));
    const phoneQuery = query(collection(db, 'users'), where('phone', '==', fullPhone));
    
    const [emailSnap, phoneSnap] = await Promise.all([
      getDocs(emailQuery),
      getDocs(phoneQuery)
    ]);

    if (!emailSnap.empty) throw new Error('Email-kan hore ayaa loo diwaangeliyey.');
    if (!phoneSnap.empty) throw new Error('Lambarkan hore ayaa loo isticmaalay.');
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendVerification();
      setCountdown(60);
    } catch (err: any) {
      setError("Email-ka dib looma diri karo hadda.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (password !== confirmPassword) return setError('Passwords-ku isma laha!');
    if (password.length < 6) return setError('Password-ku waa inuu ka badnaadaa 6 harfood.');
    if (phone.length < 7) return setError('Fadlan geli nambar sax ah.');

    setIsSubmitting(true);

    try {
      const fullPhoneNumber = `+252${phone.replace(/\D/g, '')}`;
      
      // 1. Hubi haddii Email/Phone hore u jireen
      await validateExists(email, fullPhoneNumber);

      // 2. Samee Account-ka
      await register(email, password, fullName, fullPhoneNumber); 
      
      setIsRegistered(true);
    } catch (err: any) {
      setError(err.message || 'Cillad ayaa dhacday, isku day mar kale.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ BOGGA GUUSHA (EMAIL VERIFICATION SENT)
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4">
        <Card className="w-full max-w-sm p-8 text-center rounded-[32px] shadow-xl bg-white border-0">
          <div className="flex justify-center mb-4 text-green-500 animate-bounce">
            <CheckCircle2 size={60} />
          </div>
          <h2 className="text-xl font-black mb-2 text-slate-900">Hubi Email-kaaga</h2>
          <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
            Waxaan link xaqiijin ah u dirnay <b>{email}</b>. 
            Fadlan xaqiiji si aad u bilawdo iibka iyo iibsashada.
          </p>
          <div className="space-y-3">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full bg-[#4d1d80] rounded-xl font-bold py-6 text-white mb-3">
                Back to Login
              </Button>
            </Link>
            <button 
              onClick={handleResend}
              disabled={resendLoading || countdown > 0}
              className="flex items-center justify-center gap-2 w-full text-xs font-bold text-slate-400 hover:text-[#4d1d80] disabled:opacity-50 transition-colors"
            >
              {resendLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              {countdown > 0 ? `Mar kale dir (${countdown}s)` : "Email-ka ma helin? Mar kale dir"}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4 py-8 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#4d1d80]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#FFC107]/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-sm shadow-xl border-0 rounded-[32px] overflow-hidden bg-white relative">
        <div className="p-6 sm:p-10">
          <div className="text-center mb-6">
            <Image src="/logo_becsan.png" alt="Logo" width={130} height={40} className="mx-auto mb-4 object-contain" priority />
            <h1 className="text-xl font-black text-slate-900">Create Account</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex gap-2 items-center text-red-600 animate-shake text-xs font-bold">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name" required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#4d1d80]/10 outline-none text-sm font-semibold transition-all"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#4d1d80]/10 outline-none text-sm font-semibold transition-all"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-3 rounded-xl select-none">
                <span className="text-sm font-black text-slate-600">+252</span>
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="61XXXXXXX" required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#4d1d80]/10 outline-none text-sm font-semibold transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Pass" required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#4d1d80]/10 outline-none text-sm font-semibold transition-all"
                />
              </div>
              <input
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm" required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#4d1d80]/10 outline-none text-sm font-semibold transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4d1d80] hover:bg-[#3a1661] text-white font-black py-6 rounded-xl transition-all shadow-md mt-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-[11px] font-medium text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#4d1d80] font-black hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}