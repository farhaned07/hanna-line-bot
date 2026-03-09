import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Button Component
 * Multiple variants for different use cases
 */
const Button = forwardRef(({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    children, 
    ...props 
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';
    
    const variants = {
        primary: 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary-glow/50 hover:shadow-xl hover:shadow-primary-glow/60 hover:-translate-y-0.5',
        secondary: 'bg-background-tertiary text-foreground border border-border hover:bg-white/5 hover:-translate-y-0.5',
        outline: 'bg-transparent border border-border text-foreground hover:bg-white/5 hover:border-white/20',
        ghost: 'bg-transparent text-foreground hover:bg-white/5',
        destructive: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:-translate-y-0.5',
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
