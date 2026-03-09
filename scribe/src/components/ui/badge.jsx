import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge Component
 */
const Badge = forwardRef(({ className, variant = 'default', ...props }, ref) => {
    const variants = {
        default: 'bg-primary text-white',
        secondary: 'bg-background-tertiary text-muted-foreground border border-border',
        success: 'bg-success text-white',
        warning: 'bg-high text-white',
        destructive: 'bg-critical text-white',
    };

    return (
        <div
            ref={ref}
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variants[variant],
                className
            )}
            {...props}
        />
    );
});

Badge.displayName = 'Badge';

export { Badge };
