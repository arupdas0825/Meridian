'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function MeridianLine({ value = 0, height = 4, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`relative w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink-900)_10%,transparent)] ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'var(--meridian-gradient)' }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
