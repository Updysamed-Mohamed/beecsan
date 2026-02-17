// 'use client';

// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link'; // ✅ Isticmaal Link halkii aad router.push isticmaali lahayd
// import { Home, Search, PlusCircle, MessageCircle, User, LogIn, X } from 'lucide-react';
// import { useAuth } from '@/lib/auth-context';

// export default function BottomNav() {
//   const pathname = usePathname();
//   const { user } = useAuth();
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   const navItems = [
//     { name: 'Home', href: '/', icon: Home, auth: false },
//     { name: 'Fav', href: '/favorites', icon: Search, auth: true },
//     { name: 'Gali', href: '/listings/create', icon: PlusCircle, auth: true },
//     { name: 'Messages', href: '/messages', icon: MessageCircle, auth: true },
//     { name: 'Profile', href: '/profile', icon: User, auth: true },
//   ];

//   return (
//     <>
//       <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)] mobile-only">
//         <div className="flex h-16 items-center justify-around px-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

//             // Haddii item-ku u baahan yahay auth oo uusan user-ku login ahayn, 
//             // modal-ka ayaan tusaynaa halkii aan Link ahaan u rari lahayn.
//             if (item.auth && !user) {
//               return (
//                 <button
//                   key={item.href}
//                   onClick={() => setShowAuthModal(true)}
//                   className="relative flex flex-1 flex-col items-center justify-center py-1 transition-all active:scale-75"
//                 >
//                   <Icon size={24} className="text-gray-400" />
//                   <span className="mt-1 text-[10px] font-medium text-gray-400">{item.name}</span>
//                 </button>
//               );
//             }

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 scroll={false} // ✅ Waxay ka hortagtaa "page jump"
//                 className="relative flex flex-1 flex-col items-center justify-center py-1 transition-all active:scale-75"
//               >
//                 {/* Active Indicator Dot */}
//                 {isActive && (
//                   <span className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_#2563eb]" />
//                 )}
                
//                 <Icon
//                   size={24}
//                   strokeWidth={isActive ? 2.5 : 2}
//                   className={`transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
//                 />
//                 <span className={`mt-1 text-[10px] font-medium tracking-wide ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
//                   {item.name}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>
//       </nav>

//       {/* --- AUTH MODAL (Koodhkaagii ha joogo) --- */}
//       {showAuthModal && (
//         <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
//           <div className="relative bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
//             <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 sm:hidden" />
//             <div className="flex justify-between items-start mb-6">
//               <div className="bg-blue-50 p-3 rounded-2xl">
//                 <LogIn className="w-6 h-6 text-blue-600" />
//               </div>
//               <button onClick={() => setShowAuthModal(false)} className="p-2 bg-gray-50 rounded-full">
//                 <X className="w-4 h-4 text-gray-400" />
//               </button>
//             </div>
//             <h3 className="text-2xl font-black text-gray-900 mb-2">Login loo baahan yahay</h3>
//             <p className="text-gray-500 text-sm mb-8">Si aad alaab u dhisid ama u aragto fariimahaaga, fadlan marka hore gal akoonkaaga.</p>
//             <div className="space-y-3">
//               <Link
//                 href="/auth/login"
//                 onClick={() => setShowAuthModal(false)}
//                 className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg"
//               >
//                 Gali Akoonka
//               </Link>
//               <button onClick={() => setShowAuthModal(false)} className="w-full h-14 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm">
//                 Hadda ma aha
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, PlusCircle, MessageCircle, User, LogIn, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core'; // ✅ Soo jiido Capacitor Core

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    let showListener: any;
    let hideListener: any;

    const setupKeyboardListeners = async () => {
      // ✅ 1. Hubi: Haddii aan WEB joogno (Browser), iska dhaaf plugin-ka
      if (!Capacitor.isNativePlatform()) {
        return; 
      }

      // ✅ 2. Haddii aan MOBILE joogno, wuu shaqeynayaa
      try {
        showListener = await Keyboard.addListener('keyboardWillShow', () => {
          setIsKeyboardOpen(true);
        });

        hideListener = await Keyboard.addListener('keyboardWillHide', () => {
          setIsKeyboardOpen(false);
        });
      } catch (err) {
        console.error("Keyboard plugin error ignored on web:", err);
      }
    };

    setupKeyboardListeners();

    // Cleanup
    return () => {
      if (showListener) showListener.remove();
      if (hideListener) hideListener.remove();
    };
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home, auth: false },
    { name: 'Fav', href: '/favorites', icon: Search, auth: true }, // Search icon for favorites as requested
    { name: 'Gali', href: '/listings/create', icon: PlusCircle, auth: true },
    { name: 'Messages', href: '/messages', icon: MessageCircle, auth: true },
    { name: 'Profile', href: '/profile', icon: User, auth: true },
  ];

  // HADDII KEYBOARD FURAN YAHAY (MOBILE ONLY), QARI NAV-KA
  if (isKeyboardOpen) return null;

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)] mobile-only transition-transform duration-200">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            if (item.auth && !user) {
              return (
                <button
                  key={item.href}
                  onClick={() => setShowAuthModal(true)}
                  className="relative flex flex-1 flex-col items-center justify-center py-1 active:scale-90 transition-transform"
                >
                  <Icon size={24} className="text-gray-400" />
                  <span className="mt-1 text-[10px] font-medium text-gray-400">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                scroll={false}
                className="relative flex flex-1 flex-col items-center justify-center py-1 active:scale-90 transition-transform"
              >
                {isActive && (
                  <span className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_#2563eb]" />
                )}
                
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                />
                <span className={`mt-1 text-[10px] font-medium tracking-wide ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* --- AUTH MODAL --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 sm:hidden" />
            <div className="flex justify-between items-start mb-6">
              <div className="bg-blue-50 p-3 rounded-2xl">
                <LogIn className="w-6 h-6 text-blue-600" />
              </div>
              <button onClick={() => setShowAuthModal(false)} className="p-2 bg-gray-50 rounded-full">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Login loo baahan yahay</h3>
            <p className="text-gray-500 text-sm mb-8">Fadlan gal akoonkaaga si aad u isticmaasho adeegan.</p>
            <div className="space-y-3">
              <Link
                href="/auth/login"
                onClick={() => setShowAuthModal(false)}
                className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                Gali Akoonka
              </Link>
              <button onClick={() => setShowAuthModal(false)} className="w-full h-14 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm hover:bg-gray-100">
                Hadda ma aha
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}