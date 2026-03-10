import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button Component
 * 
 * @example
 * <Button>Click me</Button>
 * <Button variant="destructive">Delete</Button>
 * <Button size="lg">Large button</Button>
 * <Button asChild><a href="/link">Link button</a></Button>
 */

const buttonVariants = cva(
  // Base styles - skills.md: 48px+ touch targets
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary - gradient with glow (skills.md: 30% primary color)
        primary:
          'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary-glow/50 hover:shadow-xl hover:shadow-primary-glow/60 hover:-translate-y-0.5',
        // Secondary - subtle border
        secondary:
          'bg-background-tertiary text-foreground border border-border-default hover:bg-white/5 hover:-translate-y-0.5',
        // Outline - transparent with border
        outline:
          'bg-transparent border border-border-default text-foreground hover:bg-white/5 hover:border-white/20',
        // Ghost - minimal
        ghost:
          'bg-transparent text-foreground hover:bg-white/5',
        // Destructive - red gradient
        destructive:
          'bg-gradient-to-r from-critical to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:-translate-y-0.5',
        // Success - green
        success:
          'bg-gradient-to-r from-success to-green-700 text-white shadow-lg shadow-success/30 hover:shadow-success/40 hover:-translate-y-0.5',
      },
      size: {
        // skills.md: Touch targets ≥ 48px
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
