'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shadow-lg">
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
              'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors text-[10px] font-medium',
              isActive
                ? 'text-primary font-bold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
