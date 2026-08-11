'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
      activeColor: 'bg-primary/10 text-primary border-primary/20',
    },
    {
      id: 'taskforge',
      name: 'TaskForge',
      tagline: 'Productivity',
      href: '/taskforge',
      icon: CheckSquare,
      activeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    },
    {
      id: 'ledgerwise',
      name: 'LedgerWise',
      tagline: 'Personal Finance',
      href: '/ledgerwise',
      icon: Wallet,
      activeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400',
    },
    {
      id: 'atlas',
      name: 'Atlas',
      tagline: 'Europe Travel',
      href: '/atlas',
      icon: Compass,
      activeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
    },
  ];

  const currentModule = modules.find(m => pathname.startsWith(m.href)) || modules[0];

  return (
    <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded-xl border">
      <div className="px-2 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        Modules
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = m.id === 'dashboard' ? pathname === '/dashboard' : pathname.startsWith(m.href);
          return (
            <Link
              key={m.id}
              href={m.href}
              className={cn(
                'flex flex-col p-2.5 rounded-lg border transition-all hover:scale-[1.02]',
                isActive
                  ? m.activeColor + ' font-medium shadow-xs'
                  : 'border-transparent hover:bg-background hover:border-border text-muted-foreground'
              )}
            >
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
