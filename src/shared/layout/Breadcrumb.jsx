'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const capitalize = (str) => {
    if (!str) return '';
    if (str === 'taskforge') return 'TaskForge';
    if (str === 'ledgerwise') return 'LedgerWise';
    if (str === 'atlas') return 'Atlas';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground px-4 py-2 bg-background/50 border-b backdrop-blur-xs">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="font-semibold text-foreground">Meridian</span>
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            {isLast ? (
              <span className="font-medium text-foreground">{capitalize(segment)}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {capitalize(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
