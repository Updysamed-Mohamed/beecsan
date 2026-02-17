'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { App as CapacitorApp } from '@capacitor/app';

export default function NavigationHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let backButtonListener: any;

    const setupListener = async () => {
      // Dhageyso marka la riixo 'Back Button' ka mobile-ka
      backButtonListener = await CapacitorApp.addListener('backButton', (data) => {
        
        // Liiska bogagga aan la rabin in dib looga laabto (Root pages)
        // Ku dar bogagga aad rabto in App-ka uu ka baxo markii la joogo
        const rootPages = ['/', '/home', '/auth/login'];

        if (rootPages.includes(pathname)) {
          // Haddii uu joogo Home ama Login, App-ka ha xirmo (Minimize)
          CapacitorApp.exitApp();
        } else {
          // Haddii uu bog kale joogo (sida Profile, Settings), samee "Normal Back"
          // Tani waxay la mid tahay inaad riixday back arrow-ga shaashada saaran
          router.back(); 
        }
      });
    };

    setupListener();

    // Cleanup: Marka component-ka is badalo, listener-ka ka saar si uusan u labo-kacleyn
    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [pathname, router]);

  return null;
}