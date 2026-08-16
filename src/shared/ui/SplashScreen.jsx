'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { LiquidLoading } from '@/shared/ui/LiquidLoading';

export function SplashScreen({ children }) {
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {mounted && showSplash && (
          <motion.div
            key="liquid-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface-0 overflow-hidden"
          >
            {/* Ambient glow in background matching Meridian theme */}
            <div
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: 'var(--meridian-gradient)' }}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center gap-2 max-w-md w-full px-4"
            >
              {/* Brand icon and name */}
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-e2 ring-1 ring-line">
                  <Image
                    src="/icon.png"
                    alt="Meridian"
                    width={36}
                    height={36}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-display font-bold text-xl tracking-tight text-ink-900">
                  Meridian
                </span>
              </div>

              {/* Liquid Loader Animation */}
              <LiquidLoading />

              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-xs font-medium text-ink-600 tracking-wide mt-2"
              >
                Plan Smart. Save More. Explore Europe.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
