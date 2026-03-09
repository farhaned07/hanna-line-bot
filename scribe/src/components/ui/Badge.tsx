import { type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]',
    primary: 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]',
    secondary: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]',
    success: 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]',
    warning: 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]',
    destructive: 'bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]',
    outline: 'border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
