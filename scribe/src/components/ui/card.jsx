import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Card Component
 */
const Card = forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'rounded-xl border border-border bg-card text-foreground shadow-sm',
            className
        )}
        {...props}
    />
));

Card.displayName = 'Card';

/**
 * Card Header
 */
const CardHeader = forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-4', className)}
        {...props}
    />
));

CardHeader.displayName = 'CardHeader';

/**
 * Card Content
 */
const CardContent = forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-4 pt-0', className)}
        {...props}
    />
));

CardContent.displayName = 'CardContent';

/**
 * Card Footer
 */
const CardFooter = forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center p-4 pt-0', className)}
        {...props}
    />
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
