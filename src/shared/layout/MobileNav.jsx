'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Wallet, Compass, User } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'TaskForge', href: '/taskforge/tasks', icon: CheckSquare, activeCheck: '/taskforge' },
  { name: 'LedgerWise', href: '/ledgerwise/expenses', icon: Wallet, activeCheck: '/ledgerwise' },
  { name: 'Atlas', href: '/atlas/explore', icon: Compass, activeCheck: '/atlas' },
  { name: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md
                 rounded-full border border-white/15 dark:border-white/10
                 bg-[color-mix(in_srgb,var(--surface-1)_45%,transparent)]
                 backdrop-blur-[28px] backdrop-saturate-[1.8]
                 shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.25)]
                 supports-[not(backdrop-filter:blur(1px))]:bg-surface-1
                 px-2 py-2 flex items-center justify-between gap-1 select-none"
    >
      <LayoutGroup id="mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.activeCheck
            ? pathname.startsWith(item.activeCheck)
            : pathname === item.href;

          return (
            <Link key={item.name} href={item.href} className="relative flex-1">
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className={cn(
                  'relative flex items-center justify-center gap-1.5 rounded-full py-2.5 overflow-hidden',
                  isActive ? 'px-4' : 'px-0'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="capsule-fill"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{ background: 'var(--meridian-gradient)', opacity: 0.92 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon
                  className={cn('w-5 h-5 shrink-0 transition-colors', isActive ? 'text-white stroke-[2.5]' : 'text-ink-600')}
                />
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xs font-semibold text-white whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </LayoutGroup>
    </nav>
  );
}
