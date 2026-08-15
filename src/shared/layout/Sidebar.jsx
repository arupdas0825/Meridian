'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Compass,
  User,
  Settings,
} from 'lucide-react';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { cn } from '@/shared/lib/utils';

function ModuleNavItem({ icon: Icon, label, sublabel, href, isActive, accentClass }) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
        isActive ? 'bg-surface-2 shadow-e1' : 'hover:bg-surface-2/60'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-all duration-200',
          isActive
            ? cn(accentClass, 'shadow-[0_0_16px_-2px_var(--tw-shadow-color)]')
            : 'bg-surface-2 text-ink-600 group-hover:text-ink-900'
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-semibold leading-tight truncate', isActive ? 'text-ink-900' : 'text-ink-700')}>
          {label}
        </p>
        <p className="text-[11px] text-ink-600 truncate">{sublabel}</p>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const moduleItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      sublabel: 'Overview & KPIs',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard',
      accentClass: 'bg-primary/15 text-primary shadow-primary/40',
    },
    {
      id: 'taskforge',
      name: 'TaskForge',
      sublabel: 'Tasks & Deadlines',
      href: '/taskforge/tasks',
      icon: CheckSquare,
      isActive: pathname.startsWith('/taskforge'),
      accentClass: 'bg-primary/15 text-primary shadow-primary/40',
    },
    {
      id: 'ledgerwise',
      name: 'LedgerWise',
      sublabel: 'Expenses & Savings',
      href: '/ledgerwise/expenses',
      icon: Wallet,
      isActive: pathname.startsWith('/ledgerwise'),
      accentClass: 'bg-teal-500/15 text-teal-600 shadow-teal-500/40',
    },
    {
      id: 'atlas',
      name: 'Atlas Travel',
      sublabel: 'Europe Explorer',
      href: '/atlas/explore',
      icon: Compass,
      isActive: pathname.startsWith('/atlas'),
      accentClass: 'bg-atlas-gold/15 text-atlas-gold shadow-atlas-gold/40',
    },
  ];

  return (
    <aside className="relative w-64 border-r border-line bg-surface-1 text-ink-900 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* 2px Meridian Line Rail down sidebar edge */}
      <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-meridian opacity-80" />

      {/* Brand Header with subtle gradient underline seam */}
      <div className="relative p-4 border-b border-line flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Meridian Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain shrink-0"
          />
          <div>
            <h1 className="font-display font-bold text-base leading-tight tracking-tight text-ink-900">Meridian</h1>
            <p className="text-[10px] text-ink-600">Plan. Save. Explore.</p>
          </div>
        </Link>
        <span className="text-[10px] font-mono-data font-semibold px-2 py-0.5 rounded-full bg-atlas-gold/15 text-amber-700 dark:text-atlas-gold border border-atlas-gold/20">
          v2.0
        </span>
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] opacity-60 pointer-events-none"
          style={{ background: 'var(--meridian-gradient)' }}
        />
      </div>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-ink-600/70 px-3 mb-2 uppercase">
            Modules
          </div>
          <div className="space-y-1">
            {moduleItems.map((item) => (
              <ModuleNavItem
                key={item.id}
                icon={item.icon}
                label={item.name}
                sublabel={item.sublabel}
                href={item.href}
                isActive={item.isActive}
                accentClass={item.accentClass}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Profile, Settings & Theme Toggle */}
      <div className="p-3 border-t border-line space-y-2 bg-surface-1/50">
        <div className="text-[10px] font-bold tracking-widest text-ink-600/70 px-3 mb-1 uppercase">
          System &amp; Data
        </div>
        <div className="space-y-0.5">
          <Link
            href="/profile"
            className={cn(
              'relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors z-10',
              pathname === '/profile'
                ? 'bg-surface-2 text-primary font-semibold shadow-xs'
                : 'text-ink-600 hover:text-ink-900 hover:bg-surface-2'
            )}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Device Profile</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              'relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors z-10',
              pathname === '/settings'
                ? 'bg-surface-2 text-primary font-semibold shadow-xs'
                : 'text-ink-600 hover:text-ink-900 hover:bg-surface-2'
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings &amp; Backup</span>
          </Link>
        </div>
        <div className="pt-2 border-t border-line/60 flex items-center justify-between">
          <span className="text-[11px] text-ink-600 font-medium px-2">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
