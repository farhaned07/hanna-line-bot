import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge Component
 * 
 * @example
 * <Badge>Default</Badge>
 * <Badge variant="success">Success</Badge>
 * <Badge variant="destructive">Urgent</Badge>
 */

const badgeVariants = cva(
  // Base styles
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white',
        secondary: 'bg-background-tertiary text-muted-foreground border border-border-default',
        success: 'bg-success text-white',
        warning: 'bg-warning text-white',
        destructive: 'bg-critical text-white',
        info: 'bg-info text-white',
        outline: 'bg-transparent border border-border-default text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(badgeVariants({ variant }), className)}
    {...props}
  />
));
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
