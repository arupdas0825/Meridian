'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Wallet, Compass } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function ModuleSwitcher() {
  const pathname = usePathname();

  const modules = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      activeColor: 'bg-primary/10 text-primary border-primary/30',
    },
    {
      id: 'taskforge',
      name: 'TaskForge',
      tagline: 'Productivity',
      href: '/taskforge',
      icon: CheckSquare,
      activeColor: 'bg-primary/10 text-primary border-primary/30',
    },
    {
      id: 'ledgerwise',
      name: 'LedgerWise',
      tagline: 'Finance',
      href: '/ledgerwise',
      icon: Wallet,
      activeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
    },
    {
      id: 'atlas',
      name: 'Atlas',
      tagline: 'Travel',
      href: '/atlas',
      icon: Compass,
      activeColor: 'bg-amber-500/10 text-amber-700 dark:text-atlas-gold border-amber-500/30',
    },
  ];

  return (
    <div className="relative flex flex-col gap-1 p-2 bg-surface-2/60 rounded-2xl border border-line overflow-hidden">
      <div className="px-2 py-1 text-[11px] font-bold tracking-wider text-ink-600 uppercase">
        Modules
      </div>
      <div className="grid grid-cols-2 gap-1.5 relative">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = m.id === 'dashboard' ? pathname === '/dashboard' : pathname.startsWith(m.href);
          return (
            <Link
              key={m.id}
              href={m.href}
              className={cn(
                'relative flex flex-col p-2.5 rounded-xl border transition-all duration-180 hover:scale-[1.02] z-10',
                isActive
                  ? m.activeColor + ' font-semibold shadow-e1'
                  : 'border-transparent hover:bg-surface-1 hover:border-line text-ink-600'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="module-switcher-glow"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{
                    background: 'var(--meridian-gradient)',
                    opacity: 0.35,
                    filter: 'blur(24px)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">{m.name}</span>
              </div>
              {m.tagline && (
                <span className="text-[10px] opacity-75 mt-0.5">{m.tagline}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

