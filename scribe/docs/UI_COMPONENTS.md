# 🎨 Hanna Scribe UI Components

**Enterprise Dark Theme** - shadcn/ui based design system

---

## 📦 Component Library

All components are built using **shadcn/ui** patterns with **Radix UI** primitives.

### Core Components

| Component | File | Radix Primitive | Description |
|-----------|------|-----------------|-------------|
| **Button** | `button.jsx` | Slot | Interactive buttons with variants |
| **Card** | `card.jsx` | - | Container with header, content, footer |
| **Badge** | `badge.jsx` | - | Status indicators |
| **Input** | `input.jsx` | - | Form input fields |
| **Dialog** | `dialog.jsx` | Dialog | Modal overlays |
| **Sheet** | `sheet.jsx` | Dialog | Slide-out panels |
| **ScrollArea** | `scroll-area.jsx` | ScrollArea | Custom scrollbars |
| **Avatar** | `avatar.jsx` | Avatar | User images |
| **Progress** | `progress.jsx` | Progress | Progress bars |
| **Skeleton** | `skeleton.jsx` | - | Loading states |
| **Toast** | `toast.jsx` | Toast | Notifications |

---

## 🎨 Design Tokens

### Colors

```css
/* Background */
--background: #0B0D12
--background-secondary: #13151A
--card: #13151A

/* Text */
--foreground: #F8FAFC
--card-foreground: #F8FAFC
--muted-foreground: #94A3B8

/* Primary (Indigo) */
--primary: #6366F1
--primary-hover: #4F46E5
--primary-foreground: #FFFFFF
--primary-glow: rgba(99, 102, 241, 0.3)

/* Semantic */
--success: #10B981
--warning: #F59E0B
--destructive: #EF4444
--info: #3B82F6

/* Borders */
--border: rgba(255, 255, 255, 0.05)
--border-hover: rgba(255, 255, 255, 0.1)
```

### Typography

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif
--font-mono: 'JetBrains Mono', monospace
```

### Spacing

Using Tailwind's spacing scale:
- `h-10` = 40px (buttons)
- `p-6` = 24px (card padding)
- `gap-4` = 16px (layouts)

### Border Radius

```css
--radius-sm: 8px    /* Small buttons */
--radius-md: 12px   /* Default */
--radius-lg: 16px   /* Cards */
--radius-xl: 24px   /* Modals */
--radius-2xl: 32px  /* Sheets */
```

---

## 📖 Usage Guide

### Button

```jsx
import { Button } from "@/components/ui/button"

// Default
<Button>Click Me</Button>

// Variants
<Button variant="default">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// With icon
<Button>
  <Plus size={16} />
  Add Item
</Button>

// Loading state
<Button disabled>
  <Loader2 className="animate-spin" />
  Loading...
</Button>
```

---

### Card

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card className="card-hover">
  <CardHeader className="border-b border-border">
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent className="p-6">
    Card content goes here
  </CardContent>
  <CardFooter className="border-t border-border">
    Card footer actions
  </CardFooter>
</Card>
```

---

### Badge

```jsx
import { Badge } from "@/components/ui/badge"

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="outline">Outline</Badge>

// With pulse animation
<Badge variant="success" className="badge-pulse">
  Live
</Badge>
```

---

### Input

```jsx
import { Input, Label } from "@/components/ui/input"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    className="input-focus"
  />
</div>

// With error state
<Input
  type="email"
  className="border-destructive focus-visible:ring-destructive"
/>
<span className="text-sm text-destructive">Invalid email</span>
```

---

### Dialog

```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description goes here.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      Dialog content
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Sheet

```jsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="bottom" className="h-[90vh]">
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
    </SheetHeader>
    <div className="py-4">
      Sheet content
    </div>
  </SheetContent>
</Sheet>

// Side variants
<SheetContent side="top">Top Sheet</SheetContent>
<SheetContent side="bottom">Bottom Sheet</SheetContent>
<SheetContent side="left">Left Sheet</SheetContent>
<SheetContent side="right">Right Sheet</SheetContent>
```

---

### ScrollArea

```jsx
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-[400px] w-full rounded-md border border-border">
  <div className="p-4">
    {/* Long content */}
  </div>
</ScrollArea>
```

---

### Avatar

```jsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// With gradient fallback
<Avatar>
  <AvatarFallback className="avatar-fallback">
    JD
  </AvatarFallback>
</Avatar>
```

---

### Progress

```jsx
import { Progress } from "@/components/ui/progress"

<Progress value={67} className="h-2" />

// Indeterminate
<Progress className="progress-indeterminate" />
```

---

### Skeleton

```jsx
import { Skeleton } from "@/components/ui/skeleton"

// Card skeleton
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-[200px] w-full" />
  </CardContent>
</Card>

// List skeleton
{[1, 2, 3].map(i => (
  <div key={i} className="flex items-center gap-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
))}
```

---

### Toast

```jsx
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

function MyComponent() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Success!",
          description: "Your changes have been saved.",
          duration: 3000,
        })
      }}
    >
      Save Changes
    </Button>
  )
}

// Variants
toast({
  title: "Default",
  variant: "default",
})

toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
})

toast({
  title: "Success",
  description: "Operation completed.",
  variant: "success",
})

toast({
  title: "Warning",
  description: "Please review.",
  variant: "warning",
})
```

---

## 🎨 Component Variants

### Button Variants

| Variant | Use Case | Styling |
|---------|----------|---------|
| `default` | Primary actions | Indigo gradient with glow |
| `destructive` | Delete/danger actions | Red with shadow |
| `outline` | Secondary actions | Border only |
| `secondary` | Tertiary actions | Muted background |
| `ghost` | Subtle actions | Hover background |
| `link` | Text links | Underline on hover |

### Badge Variants

| Variant | Use Case | Color |
|---------|----------|-------|
| `default` | Primary status | Indigo |
| `secondary` | Secondary status | Muted |
| `destructive` | Error/critical | Red |
| `success` | Success/complete | Green |
| `warning` | Warning/alert | Amber |
| `info` | Information | Blue |
| `outline` | Neutral | Border only |

---

## 🎭 Animations

### Dialog

```css
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95
data-[state=open]:zoom-in-95
```

### Sheet

```css
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:slide-out-to-bottom
data-[state=open]:slide-in-from-bottom
```

### Toast

```css
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-80
data-[state=closed]:slide-out-to-right-full
```

---

## ♿ Accessibility

All components follow **WCAG 2.1 AA** guidelines:

- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Screen reader support
- ✅ Color contrast (4.5:1 minimum)

### Focus States

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

---

## 📱 Responsive Design

### Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Classes

```jsx
// Hide on mobile, show on desktop
<div className="hidden sm:block">Desktop Only</div>

// Different sizes
<div className="w-full sm:w-1/2 lg:w-1/3">Responsive Width</div>

// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 🔧 Utilities

### Class Name Merger

```jsx
import { cn } from "@/lib/utils"

<div className={cn(
  "flex items-center gap-2",
  "p-4 rounded-lg",
  "bg-card border border-border",
  className // User overrides
)} />
```

### Component Composition

```jsx
import { Slot } from "@radix-ui/react-slot"

const Button = React.forwardRef(({ asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return <Comp ref={ref} {...props} />
})

// Usage
<Button asChild>
  <a href="/link">Link as Button</a>
</Button>
```

---

## 📋 Best Practices

### 1. Consistent Spacing

```jsx
// Good
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Bad
<div>
  <div className="mb-4">Item 1</div>
  <div>Item 2</div>
</div>
```

### 2. Semantic Colors

```jsx
// Good
<Badge variant="success">Active</Badge>
<Badge variant="destructive">Error</Badge>

// Bad
<Badge className="bg-green-500">Active</Badge>
<Badge className="bg-red-500">Error</Badge>
```

### 3. Accessible Forms

```jsx
// Good
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>

// Bad
<input type="email" placeholder="Email" />
```

### 4. Loading States

```jsx
// Good
<Button disabled>
  <Loader2 className="animate-spin" />
  Loading...
</Button>

// Bad
<Button>Loading...</Button>
```

---

## 🎯 Quick Reference

### Import All Components

```jsx
import {
  Button,
  Card,
  Badge,
  Input,
  Dialog,
  Sheet,
  ScrollArea,
  Avatar,
  Progress,
  Skeleton,
  Toast,
  Toaster,
} from "@/components/ui"
```

### Common Patterns

```jsx
// Card with hover effect
<Card className="card-hover">...</Card>

// Button with loading state
<Button disabled className="button-loading">
  <Loader2 className="animate-spin" />
  Loading...
</Button>

// Input with focus animation
<Input className="input-focus" />

// Badge with pulse
<Badge variant="success" className="badge-pulse">
  Live
</Badge>

// Skeleton loading
<Skeleton className="skeleton" />
```

---

**Last Updated**: March 9, 2026
**Version**: 3.0 (Enterprise Dark Theme)
