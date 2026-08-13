'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function SplashScreen({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem('meridian_splash_seen');
    if (seen) {
      setShowSplash(false);
      return;
    }
    const timer = setTimeout(() => {
      sessionStorage.setItem('meridian_splash_seen', '1');
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-surface-0"
          >
            {/* Ambient glow, matches Meridian gradient identity */}
            <div
              className="absolute w-72 h-72 rounded-full blur-3xl opacity-30"
              style={{ background: 'var(--meridian-gradient)' }}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center gap-4"
            >
              <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-e3 ring-1 ring-white/10">
                <Image src="/icon.png" alt="Meridian" width={96} height={96} priority className="w-full h-full object-cover" />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="font-display text-2xl font-extrabold tracking-tight text-ink-900"
              >
                Meridian
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-xs text-ink-600 tracking-wide"
              >
                Plan Smart. Save More. Explore Europe.
              </motion.p>

              {/* Loading indicator — thin animated seam, echoes the meridian-line motif */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 120, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
                className="h-[2px] rounded-full overflow-hidden mt-2"
                style={{ background: 'var(--meridian-gradient)' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
