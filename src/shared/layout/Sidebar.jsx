'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Globe,
  Sparkles,
} from 'lucide-react';
import { ModuleSwitcher } from './ModuleSwitcher';
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
    <aside className="w-64 border-r bg-card/60 backdrop-blur-md flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-atlas-navy text-atlas-gold flex items-center justify-center font-bold text-lg shadow-sm">
            M
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-tight">Meridian</h1>
            <p className="text-[10px] text-muted-foreground">Plan. Save. Explore.</p>
          </div>
        </Link>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-atlas-gold/15 text-amber-700 dark:text-atlas-gold border border-atlas-gold/20">
          v1.0
        </span>
      </div>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <ModuleSwitcher />

        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
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
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t space-y-1">
        <Link
          href="/profile"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            pathname === '/profile'
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <User className="w-4 h-4 shrink-0" />
          <span>Profile</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            pathname === '/settings'
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
