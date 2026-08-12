'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Wallet, Compass, User } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'TaskForge', href: '/taskforge/tasks', icon: CheckSquare, activeCheck: '/taskforge' },
    { name: 'LedgerWise', href: '/ledgerwise/expenses', icon: Wallet, activeCheck: '/ledgerwise' },
    { name: 'Atlas', href: '/atlas/explore', icon: Compass, activeCheck: '/atlas' },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-[color-mix(in_srgb,var(--ink-900)_8%,transparent)]
                 bg-[color-mix(in_srgb,var(--surface-1)_65%,transparent)]
                 backdrop-blur-[20px] backdrop-saturate-[1.6] shadow-e3
                 supports-[not(backdrop-filter:blur(1px))]:bg-surface-1
                 px-2 py-1.5 flex items-center justify-around select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.activeCheck
          ? pathname.startsWith(item.activeCheck)
          : pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors text-[10px] font-medium z-10',
              isActive
                ? 'text-primary font-bold'
                : 'text-ink-600 hover:text-ink-900'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="mobile-nav-indicator"
                className="absolute inset-0 rounded-xl -z-10"
                style={{ background: 'var(--meridian-gradient)', opacity: 0.16, filter: 'blur(4px)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5] text-primary')} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

