import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-120 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-e1 hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-e1 hover:bg-destructive/90',
        outline: 'border border-line bg-surface-1 shadow-e1 text-ink-900 hover:bg-surface-2 hover:text-ink-900',
        secondary: 'bg-surface-2 text-ink-900 shadow-e1 hover:bg-surface-2/80',
        ghost: 'text-ink-600 hover:bg-surface-2 hover:text-ink-900',
        link: 'text-primary underline-offset-4 hover:underline',
        atlas: 'bg-atlas-gold text-atlas-navy font-semibold hover:bg-atlas-gold/90 shadow-e1',
        teal: 'bg-teal text-white hover:bg-teal-dark shadow-e1',
        meridian: 'relative bg-surface-1 text-ink-900 border border-transparent bg-origin-border [background-clip:padding-box,border-box] [background-image:linear-gradient(var(--surface-1),var(--surface-1)),var(--meridian-gradient)] shadow-e1 hover:shadow-e2 font-semibold',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-xl px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };

