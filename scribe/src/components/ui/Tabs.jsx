import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

/**
 * Tabs Component
 * 
 * @example
 * <Tabs defaultValue="soap" className="w-full">
 *   <TabsList>
 *     <TabsTrigger value="soap">SOAP</TabsTrigger>
 *     <TabsTrigger value="careplan">Care Plan</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="soap">...</TabsContent>
 *   <TabsContent value="careplan">...</TabsContent>
 * </Tabs>
 */

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-12 items-center justify-center rounded-xl bg-background-tertiary p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // skills.md: 48px+ touch targets
      'inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all',
      // Focus states
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      // Disabled state
      'disabled:pointer-events-none disabled:opacity-50',
      // Active state
      'data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm',
      // Hover state
      'hover:bg-white/5',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
