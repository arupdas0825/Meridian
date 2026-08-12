'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { MeridianLine } from './MeridianLine';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    setIsOffline(!navigator.onLine);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="relative w-full bg-surface-1 border-b border-line text-xs py-2 px-4 flex items-center justify-center gap-2 text-ink-900 shadow-e1 z-40">
      <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
      <span className="font-medium">Offline — changes will sync when you&apos;re back.</span>
      <div className="absolute bottom-0 left-0 right-0">
        <MeridianLine value={100} height={3} />
      </div>
    </div>
  );
}
