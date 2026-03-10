import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input Component
 * 
 * @example
 * <Input type="email" placeholder="Enter email" />
 * <Input disabled />
 * <Input className="h-12" />
 */

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Base styles - skills.md: 48px+ touch targets
        'flex h-11 w-full rounded-xl border border-border-default bg-background-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground',
        // Focus states
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Transition
        'transition-all duration-200',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
