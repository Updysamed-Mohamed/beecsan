import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/lib/auth-context';
import BottomNav from '@/components/bottom-nav';
import NetworkStatus from '@/components/NetworkStatus';
import NavigationHandler from '@/components/NavigationHandler'; // ✅ Waa muhiim

const geist = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beecsan',
  description: 'Iibso oona iskaga iibi',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Beecsan',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="so" className="h-full">
      <body className={`${geist.className} h-full bg-white antialiased overflow-hidden overscroll-none`}>
        
        <NetworkStatus /> 

        <AuthProvider>
          {/* ✅ NavigationHandler halkan ayuu ugu fiican yahay */}
          <NavigationHandler />

          {/* ✅ Main Content Area - Native Scrolling Feel */}
          <main className="h-full overflow-y-auto pb-20 touch-pan-y scroll-smooth">
            {children}
            <Analytics />
          </main>
          
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}