import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Skeleton Component
 * 
 * @example
 * <Skeleton className="h-4 w-full" />
 * <Skeleton className="rounded-full h-12 w-12" />
 */

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        // skills.md: Loading states
        'animate-pulse rounded-xl bg-background-tertiary',
        'shimmer',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
