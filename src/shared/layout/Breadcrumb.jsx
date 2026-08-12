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
    <nav className="relative flex items-center gap-1.5 text-xs text-ink-600 px-4 py-2.5 bg-surface-1/70 backdrop-blur-md border-b border-line">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-ink-900 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="font-display font-bold text-ink-900">Meridian</span>
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-ink-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-ink-900">{capitalize(segment)}</span>
            ) : (
              <Link href={href} className="hover:text-ink-900 transition-colors">
                {capitalize(segment)}
              </Link>
            )}
          </div>
        );
      })}
      {/* Signature Meridian Line underline accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-meridian opacity-40" />
    </nav>
  );
}

