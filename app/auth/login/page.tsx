'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Lock, Mail, Loader2, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Nadiifi khaladaadkii hore

    try {
      // 1. Marka hore soo xaqiiji login-ka (Firebase Auth)
      const loggedInUser = await login(email.toLowerCase().trim(), password);

      // 2. Hubi haddii isticmaaluhu yahay "blocked"
      if (loggedInUser?.status === 'blocked') {
        // Halkan waxaad u baahan kartaa inaad Logout ka dhigto si uusan session-ku u sii furnaan
        // await logout(); 
        setError('Akoonkan waa la xanibay (Blocked). Fadlan la xidhiidh maamulka.');
        setIsSubmitting(false);
        return; // Ha u ogolaan inuu horey u sii socdo
      }

      console.log("Login Success! Role laga helay:", loggedInUser?.role);

      // 3. Wareejinta (Redirection) haddii uusan blocked ahayn
      if (loggedInUser?.role === 'admin') {
        window.location.replace('/admin'); 
      } else {
        window.location.replace('/');
      }
    } catch (err: any) {
      console.error("Login Error:", err.message);
      // Halkan waxaad ku habayn kartaa fariimaha khaldan ee ka imanaya Firebase
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ama Password-ka waa khalad.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4 py-8 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#4d1d80]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#FFC107]/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-sm shadow-xl border-0 rounded-[32px] overflow-hidden bg-white relative">
        <div className="p-6 sm:p-10">
          
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src="/logo_becsan.png" 
                alt="Beecsan Logo"
                width={130}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">Welcome Back</h1>
          </div>

          {/* Error Alert - Waxaa ku jira Info icon haddii ay tahay Verification Error */}
          {error && (
            <div className={`mb-4 p-3 border rounded-xl flex gap-2 items-start animate-shake ${
              error.includes('xaqiiji') 
                ? 'bg-amber-50 border-amber-100 text-amber-700' 
                : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              {error.includes('xaqiiji') 
                ? <Info size={16} className="shrink-0 mt-0.5" /> 
                : <AlertCircle size={16} className="shrink-0 mt-0.5" />
              }
              <p className="text-[11px] font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#4d1d80]/10 outline-none text-sm font-semibold transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#4d1d80]/10 outline-none text-sm font-semibold transition-all"
                  required
                />
              </div>
              <div className="flex justify-end pr-1">
                <Link href="/auth/forgot-password" className="text-[10px] font-black text-[#4d1d80] hover:text-[#FFC107] uppercase transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4d1d80] hover:bg-[#3a1661] text-white font-black py-6 rounded-xl transition-all shadow-md active:scale-[0.98] mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Signin...
                </div>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center text-[11px] font-medium">
            <p className="text-slate-500">
              Account ma lihid?{' '}
              <Link href="/auth/register" className="text-[#4d1d80] hover:text-[#FFC107] font-black transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
// import Image from 'next/image';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

  

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4">
//       <Card className="w-full max-w-sm shadow-xl border-0 rounded-[32px] p-10">
//         <div className="text-center mb-8">
//           <Image src="/logo_becsan.png" alt="Logo" width={130} height={40} className="mx-auto mb-4" />
//           <h1 className="text-xl font-black">Welcome Back</h1>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex gap-2 text-[11px] font-bold">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
//             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none" required />
//           </div>
//           <div className="relative">
//             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
//             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none" required />
//           </div>
//           <Button type="submit" disabled={isSubmitting} className="w-full bg-[#4d1d80] text-white py-6 rounded-xl font-black">
//             {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sign In'}
//           </Button>
//         </form>
//       </Card>
//     </div>
//   );
// }