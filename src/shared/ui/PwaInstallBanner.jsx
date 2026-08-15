'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';
import { Button } from './Button';

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div
      className="fixed bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-[60] p-4 rounded-2xl
                 border border-[color-mix(in_srgb,var(--ink-900)_12%,transparent)]
                 bg-[color-mix(in_srgb,var(--surface-1)_80%,transparent)]
                 backdrop-blur-[20px] backdrop-saturate-[1.6] shadow-e3
                 supports-[not(backdrop-filter:blur(1px))]:bg-surface-1
                 flex items-center justify-between gap-3 text-ink-900"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Meridian Logo"
          width={36}
          height={36}
          className="w-9 h-9 object-contain shrink-0"
        />
        <div className="text-xs">
          <p className="font-bold leading-tight">Install Meridian</p>
          <p className="text-ink-600 leading-normal">Plan, spend and travel, even offline.</p>
        </div>
      </div>


      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" onClick={handleInstall} className="gap-1.5 text-xs font-semibold">
          <Download className="w-3.5 h-3.5" /> Install
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md text-ink-600 hover:text-ink-900 hover:bg-surface-2 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
