import Link from 'next/link';
import { Button } from './Button';

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 gap-3">
      <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center">
        <Icon className="w-5 h-5 text-ink-600" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <p className="text-xs text-ink-600 max-w-[28ch] mx-auto">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Button asChild size="sm" variant="outline" className="mt-1">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
