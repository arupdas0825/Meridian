'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  FolderKanban,
  Tag,
  BarChart3,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  CalendarCheck,
  Compass,
  Target,
  CreditCard,
  Receipt,
  User,
  Settings,
} from 'lucide-react';
import { ModuleSwitcher } from './ModuleSwitcher';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { cn } from '@/shared/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const getNavSections = () => {
    if (pathname.startsWith('/taskforge')) {
      return [
        {
          title: 'TaskForge',
          items: [
            { name: 'Tasks', href: '/taskforge/tasks', icon: CheckSquare },
            { name: 'Projects', href: '/taskforge/projects', icon: FolderKanban },
            { name: 'Labels', href: '/taskforge/labels', icon: Tag },
            { name: 'Analytics', href: '/taskforge/analytics', icon: BarChart3 },
            { name: 'Calendar', href: '/taskforge/calendar', icon: Calendar },
          ],
        },
      ];
    }
    if (pathname.startsWith('/ledgerwise')) {
      return [
        {
          title: 'LedgerWise',
          items: [
            { name: 'Income', href: '/ledgerwise/income', icon: ArrowUpRight },
            { name: 'Expenses', href: '/ledgerwise/expenses', icon: ArrowDownLeft },
            { name: 'Budget Engine', href: '/ledgerwise/budget', icon: PieChart },
            { name: 'Month Summary', href: '/ledgerwise/summary', icon: CalendarCheck },
          ],
        },
      ];
    }
    if (pathname.startsWith('/atlas')) {
      return [
        {
          title: 'Atlas Travel',
          items: [
            { name: 'Europe Explorer', href: '/atlas/explore', icon: Compass },
            { name: 'Travel Goals', href: '/atlas/goals', icon: Target },
            { name: 'Trip Expenses', href: '/atlas/expenses', icon: Receipt },
            { name: 'Travel Wallet', href: '/atlas/wallet', icon: CreditCard },
          ],
        },
      ];
    }
    return [];
  };

  const navSections = getNavSections();

  return (
    <aside className="relative w-64 border-r border-line bg-surface-1 text-ink-900 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* 2px Meridian Line Rail down sidebar edge */}
      <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-meridian opacity-80" />

      {/* Brand Header */}
      <div className="p-4 border-b border-line flex items-center justify-between">
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
      </div>


      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <ModuleSwitcher />

        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-bold text-ink-600 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors z-10',
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-surface-2'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-nav-indicator"
                      className="absolute inset-0 rounded-md -z-10"
                      style={{ background: 'var(--meridian-gradient)', opacity: 0.16, filter: 'blur(4px)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile, Settings & Theme Toggle */}
      <div className="p-3 border-t border-line space-y-2">
        <div className="space-y-0.5">
          <Link
            href="/profile"
            className={cn(
              'relative flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors z-10',
              pathname === '/profile'
                ? 'text-primary font-semibold'
                : 'text-ink-600 hover:text-ink-900 hover:bg-surface-2'
            )}
          >
            {pathname === '/profile' && (
              <motion.span
                layoutId="sidebar-nav-indicator"
                className="absolute inset-0 rounded-md -z-10"
                style={{ background: 'var(--meridian-gradient)', opacity: 0.16, filter: 'blur(4px)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <User className="w-4 h-4 shrink-0" />
            <span>Profile</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              'relative flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors z-10',
              pathname === '/settings'
                ? 'text-primary font-semibold'
                : 'text-ink-600 hover:text-ink-900 hover:bg-surface-2'
            )}
          >
            {pathname === '/settings' && (
              <motion.span
                layoutId="sidebar-nav-indicator"
                className="absolute inset-0 rounded-md -z-10"
                style={{ background: 'var(--meridian-gradient)', opacity: 0.16, filter: 'blur(4px)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </Link>
        </div>
        <div className="pt-1 flex items-center justify-between">
          <span className="text-[11px] text-ink-600 font-medium px-1">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

