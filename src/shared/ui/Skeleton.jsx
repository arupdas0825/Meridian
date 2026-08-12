import { cn } from '@/shared/lib/utils';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-surface-2 relative overflow-hidden before:absolute before:inset-0 before:bg-meridian before:opacity-[0.08]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

