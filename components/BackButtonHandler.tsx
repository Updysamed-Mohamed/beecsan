'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function BackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Markuu user-ku "Back" riixo, waxaan ku qasbi karnaa inuu bog hore aado
    const handlePopState = (event: PopStateEvent) => {
      if (pathname !== '/') {
        // Haddii uusan joogin Home, ha xirin App-ka, u gee Home
        router.push('/');
      }
    };

    // 2. Tani waxay "Socialize" gareysaa history-ga browser-ka mobile-ka
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router]);

  return null;
}