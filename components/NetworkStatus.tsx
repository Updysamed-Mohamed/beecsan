'use client';

import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Loader2 } from 'lucide-react';

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // 1. Function lagu hubinayo xaaladda dhabta ah
    const checkStatus = () => {
      if (typeof window !== 'undefined' && navigator) {
        setIsOffline(!navigator.onLine);
      }
    };

    // 2. Hubi isla marka uu dhasho (Mount)
    checkStatus();

    // 3. Dhagayso isbeddelka (Events)
    const handleOnline = () => {
      setIsReconnecting(true);
      setTimeout(() => window.location.reload(), 1000);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 4. 🔥 XALKA TALIFANKA: Hubi 3-dii ilbiriqsiba mar haddii wax kale xannibayaan
    const interval = setInterval(checkStatus, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div 
      className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300"
      style={{ zIndex: 999999 }} // Ka dhig mid aad u sarreeya
    >
      <div className="bg-red-50 p-8 rounded-full mb-6">
        <WifiOff size={64} className="text-red-500 animate-bounce" />
      </div>
      
      <h2 className="text-2xl font-black text-gray-900 mb-2">Internet-ka ayaa go'an!</h2>
      <p className="text-gray-500 mb-8 max-w-[280px] mx-auto font-medium">
        Xogta ma soo bixi karto internet la'aan. Hubi network-gaaga si aad u sii wadato.
      </p>

      {isReconnecting ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-blue-600 font-bold">Waa la soo celinayaa...</p>
        </div>
      ) : (
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all"
        >
          <RefreshCw size={22} className="mr-2 inline" />
          Hadda isku day
        </button>
      )}
    </div>
  );
}