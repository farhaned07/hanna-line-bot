# 🎨 Hanna Scribe — Comprehensive UI/UX Redesign Plan
## Using shadcn/ui Component Library

**Document Type:** Master Design Specification  
**Version:** 1.0  
**Date:** March 8, 2026  
**Status:** Ready for Implementation  
**Author:** Chief Frontend Designer

---

## 📋 Executive Summary

### Current State Analysis

Hanna Scribe is a **production-ready PWA** for voice-first clinical documentation with:
- ✅ Working authentication flow
- ✅ Complete recording → transcription → note generation pipeline
- ✅ Mobile-first responsive design
- ✅ Dark mode theme (slate-based)
- ✅ Basic UI components (Button, Card, Badge, Input, Avatar, Progress)

### The Opportunity

Transform from "functional" to **exceptional** by implementing shadcn/ui's professional component system for:
- 🎯 **Consistency** — Unified design language across all pages
- ♿ **Accessibility** — WCAG 2.1 AA compliance out of the box
- 🚀 **Development Speed** — Pre-built, customizable components
- 📱 **Mobile Excellence** — Touch-optimized, thumb-zone aware
- 🏥 **Medical Trust** — Professional, clean, confidence-inspiring UI

---

## 🎯 Design Philosophy

### Core Principles

1. **Mobile-First, Thumb-Optimized**
   - All touch targets ≥ 48px (Apple HIG standard)
   - Primary actions in thumb zone (bottom 60% of screen)
   - Safe area insets respected (notch, home indicator)

2. **Accessibility First**
   - WCAG 2.1 AA color contrast (≥ 4.5:1)
   - Proper focus states (visible, 2px outline)
   - ARIA labels on all interactive elements
   - Screen reader friendly structure

3. **Medical Professionalism**
   - Clean, uncluttered layouts
   - Clear visual hierarchy
   - Trust-building micro-interactions
   - Calming color palette (blue-indigo primary)

4. **Performance Conscious**
   - Lazy loading for heavy components
   - Skeleton loading states
   - Optimistic UI updates
   - PWA offline support

5. **Consistency Through System**
   - shadcn/ui component library
   - Unified spacing (4px grid)
   - Inter font family throughout
   - Consistent radii and shadows

---

## 🎨 Design System

### Color System (Dark Mode)

```css
/* Backgrounds */
--background: #0F172A        /* Main app background (slate-950) */
--card: #1E293B              /* Card surfaces (slate-900) */
--surface: #334155           /* Elevated surfaces (slate-700) */

/* Borders */
--border: #334155            /* Default borders (slate-700) */
--border-light: #475569      /* Subtle borders (slate-600) */

/* Text */
--foreground: #F8FAFC        /* Primary text (slate-50) */
--muted: #94A3B8             /* Secondary text (slate-400) */
--muted-dark: #64748B        /* Tertiary text (slate-500) */

/* Primary Brand */
--primary: #6366F1           /* Indigo-500 */
--primary-hover: #4F46E5     /* Indigo-600 */
--primary-light: #A5B4FC     /* Indigo-300 */
--primary-bg: rgba(99,102,241,0.1)

/* Semantic Colors */
--success: #10B981           /* Green-500 */
--success-bg: rgba(16,185,129,0.1)
--warning: #F59E0B           /* Amber-500 */
--warning-bg: rgba(245,158,11,0.1)
--error: #EF4444             /* Red-500 */
--error-bg: rgba(239,68,68,0.1)
--info: #3B82F6              /* Blue-500 */
--info-bg: rgba(59,130,246,0.1)
```

### Typography

```css
/* Font Family */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif
--font-mono: 'JetBrains Mono', monospace (for timers, codes)

/* Scale (mobile-first) */
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)

/* Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing (4px Grid)

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
```

### Radii

```css
--radius-sm: 8px     (buttons, small inputs)
--radius-md: 12px    (cards, inputs)
--radius-lg: 16px    (modals, sheets)
--radius-xl: 24px    (large containers)
--radius-full: 9999px (pills, toggles)
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.2)
--shadow-md: 0 4px 12px rgba(0,0,0,0.25)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.3)
--shadow-xl: 0 16px 48px rgba(0,0,0,0.35)
--shadow-glow: 0 0 24px rgba(99,102,241,0.3)
```

---

## 📱 Component Inventory

### ✅ Existing Components (Audit Status)

| Component | Status | Quality | Notes |
|-----------|--------|---------|-------|
| Button | ✅ Present | Good | 6 variants working |
| Card | ✅ Present | Good | Full component set |
| Input | ✅ Present | Good | With label support |
| Badge | ✅ Present | Good | 6 variants |
| Avatar | ✅ Present | Good | With fallback |
| Progress | ✅ Present | Good | For processing page |
| ScrollArea | ✅ Present | Good | Radix-based |

### ⏳ Missing Components (Priority)

| Component | Priority | Use Case | Effort |
|-----------|----------|----------|--------|
| **Dialog/Modal** | P0 | PDPA, confirmations, upgrades | 2h |
| **Sheet** | P0 | New session, filters | 2h |
| **Toast** | P0 | Success/error notifications | 3h |
| **Tabs** | P1 | Settings, note sections | 2h |
| **DropdownMenu** | P1 | More actions, user menu | 2h |
| **Label** | P1 | Form labels | 0.5h |
| **Textarea** | P1 | Note editing | 1h |
| **Skeleton** | P1 | Loading states | 1h |
| **Alert** | P2 | Warnings, info banners | 1h |
| **Switch** | P2 | Settings toggles | 1h |
| **Select** | P2 | Template selection | 2h |
| **Command** | P2 | Search, quick actions | 3h |
| **Popover** | P2 | Date pickers, tooltips | 2h |
| **Tooltip** | P2 | Onboarding hints | 2h |
| **Separator** | P3 | Visual dividers | 0.5h |
| **Collapsible** | P3 | Expandable sections | 1h |

---

## 🗺️ Page-by-Page Redesign Plan

### Phase 1: Authentication (P0 — Revenue Critical)

#### 1.1 Login Page (`/login`)

**Current State:**
- ✅ Already uses shadcn/ui Card, Input, Button
- ✅ Clean layout with logo
- ✅ Language toggle
- ✅ PDPA consent modal

**Improvements:**
- [ ] Add **Form** component for better validation
- [ ] Add **Label** component with proper ARIA
- [ ] Add **Alert** component for error messages
- [ ] Improve loading state with **Button** disabled state
- [ ] Add **Separator** for visual hierarchy

**New Components Needed:**
- Form (with react-hook-form + zod validation)
- Alert (for errors)
- Separator

**Design Mockup:**
```
┌─────────────────────────────────────────┐
│                                         │
│         [Logo + Brand Name]             │
│      "Clinical Documentation System"    │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Sign in                          │  │
│  │                                   │  │
│  │  Email Label                      │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ 📧 name@hospital.com        │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │      Sign In →              │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  Don't have an account? Sign up   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [Secured badge with encryption icon]   │
│                                         │
└─────────────────────────────────────────┘
```

---

#### 1.2 Onboarding (`/onboarding`)

**Current State:**
- 3-screen walkthrough
- Framer Motion animations
- Skip button

**Improvements:**
- [ ] Add **Progress** bar at top
- [ ] Use **Card** component for each screen
- [ ] Add **Button** variants (default + ghost for skip)
- [ ] Add **Badge** for feature highlights
- [ ] Improve CTA hierarchy

**New Components Needed:**
- Progress (stepped indicator)

---

### Phase 2: Core Workflow (P0 — Daily Use)

#### 2.1 Home Page (`/`)

**Current State:**
- ✅ Session list with grouping
- ✅ Search functionality
- ✅ FAB for new session
- ✅ Swipeable cards
- ✅ Stats card

**Improvements:**
- [ ] Replace custom cards with **Card** component
- [ ] Use **Badge** for session status
- [ ] Use **Avatar** for patient initials
- [ ] Add **Skeleton** for loading states
- [ ] Use **ScrollArea** for better scrolling
- [ ] Add **Tabs** for filtering (All/Today/Week)
- [ ] Use **Toast** for delete/export confirmations

**New Components Needed:**
- Skeleton (loading states)
- Tabs (filtering)
- Toast (notifications)

**Design Mockup:**
```
┌─────────────────────────────────────────┐
│ [🛡️] Hanna Scribe                      │
│                                         │
│ Good Morning, Dr. Somchai              │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ 📋 Notes: 7 / 10                    ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ 🔍 Search patients...           ✕   ││
│ └─────────────────────────────────────┘│
│                                         │
│ TODAY                          [3] ▼   │
│ ┌─────────────────────────────────────┐│
│ │ 👤 John Doe           [Draft ▼]     ││
│ │ HN: 12345 • 2:30 PM                 ││
│ └─────────────────────────────────────┘│
│ ┌─────────────────────────────────────┐│
│ │ 👤 Jane Smith         [Finalized ✓] ││
│ │ HN: 67890 • 1:15 PM                 ││
│ └─────────────────────────────────────┘│
│                                         │
│              [ + ] (FAB)                │
│                                         │
│ [🏠 Home] [📋 Handover] [⚙️ Settings]  │
└─────────────────────────────────────────┘
```

---

#### 2.2 New Session Sheet

**Current State:**
- Bottom sheet modal
- Patient name + HN inputs
- Template selector

**Improvements:**
- [ ] Convert to **Sheet** component (Radix)
- [ ] Use **Label** + **Input** properly
- [ ] Use **Select** for template picker
- [ ] Add **Button** variants
- [ ] Add **Alert** for validation errors

**New Components Needed:**
- Sheet (bottom sheet modal)
- Select (dropdown picker)

---

#### 2.3 Recording Page (`/record/:id`)

**Current State:**
- ✅ Orb animation (custom CSS)
- ✅ Large timer display
- ✅ Pause/Resume/Done controls
- ✅ Duration color coding

**Improvements:**
- [ ] Use **Button** component for controls
- [ ] Add **Progress** ring around orb
- [ ] Use **Badge** for duration hints
- [ ] Add **Tooltip** for button hints
- [ ] Use **Alert** for mic permission errors

**New Components Needed:**
- Tooltip (button hints)
- Alert (error states)

**Design Mockup:**
```
┌─────────────────────────────────────────┐
│  ✕                              ● 02:34│
│                                         │
│           Dr. Somchai                   │
│           HN: 12345                     │
│                                         │
│              ╭─────╮                    │
│            ╱   🎙️   ╲                  │
│           │   ORB   │                  │
│            ╲       ╱                    │
│              ╰─────╯                    │
│                                         │
│           🎤 Recording...               │
│                                         │
│            02:34                        │
│         Perfect length                  │
│                                         │
│    ┌─────────────────────────────┐     │
│    │ 💡 Speak naturally about    │     │
│    │    chief complaint & HPI    │     │
│    └─────────────────────────────┘     │
│                                         │
│      [⏸️]        [⏹️]        [ ]       │
│    Pause       Done                    │
│                                         │
└─────────────────────────────────────────┘
```

---

#### 2.4 Processing Page (`/processing/:id`)

**Current State:**
- ✅ 3-stage progress indicator
- ✅ Orb animation
- ✅ Time estimates
- ✅ Language detection

**Improvements:**
- [ ] Use **Progress** component (stepped)
- [ ] Use **Card** for stage details
- [ ] Use **Badge** for language detection
- [ ] Use **Alert** for errors
- [ ] Add **Skeleton** for loading

**New Components Needed:**
- None (mostly complete)

---

### Phase 3: Note Management (P1 — Value Add)

#### 3.1 Note View (`/note/:id`)

**Current State:**
- ✅ SOAP sections with gradients
- ✅ Patient info header
- ✅ Copy/PDF/Edit actions
- ✅ Transcript toggle

**Improvements:**
- [ ] Use **Card** for SOAP sections
- [ ] Use **Badge** for status indicators
- [ ] Use **Button** variants for actions
- [ ] Use **Collapsible** for transcript
- [ ] Use **Toast** for copy confirmation
- [ ] Use **DropdownMenu** for export options

**New Components Needed:**
- Collapsible (expandable sections)
- DropdownMenu (export options)

**Design Mockup:**
```
┌─────────────────────────────────────────┐
│  ←      📋 Draft • Not reviewed        │
│                                         │
│ ✨ Generated by Hanna AI • 2m ago      │
│                                         │
│ John Doe                                │
│ HN: 12345 • 2:30 PM • SOAP             │
│ ─────────────────────────────────────── │
│                                         │
│ 💬 SUBJECTIVE                           │
│ ┌─────────────────────────────────────┐│
│ │ Patient presents with...            ││
│ └─────────────────────────────────────┘│
│                                         │
│ 🔬 OBJECTIVE                            │
│ ┌─────────────────────────────────────┐│
│ │ Vitals stable, no acute distress... ││
│ └─────────────────────────────────────┘│
│                                         │
│ 📋 ASSESSMENT                           │
│ ┌─────────────────────────────────────┐│
│ │ Acute bronchitis, viral...          ││
│ └─────────────────────────────────────┘│
│                                         │
│ 📌 PLAN                                 │
│ ┌─────────────────────────────────────┐│
│ │ Supportive care, follow-up...       ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ View transcript                ▼   ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌──────┐ ┌──────┐ ┌──────────┐ ┌────┐ │
│ │ Copy │ │ PDF  │ │ ✏️ Edit  │ │ ✓ │ │
│ └──────┘ └──────┘ └──────────┘ └────┘ │
└─────────────────────────────────────────┘
```

---

#### 3.2 Note Editor (`/note/:id/edit`)

**Current State:**
- TipTap rich text editor
- AI command bar
- Section regeneration

**Improvements:**
- [ ] Use **Tabs** for sections (mobile)
- [ ] Use **Textarea** styled with TipTap
- [ ] Use **Button** for AI commands
- [ ] Use **Toast** for save confirmations
- [ ] Use **Alert** for unsaved changes warning

**New Components Needed:**
- Textarea (styled)

---

### Phase 4: Secondary Features (P2 — Polish)

#### 4.1 Handover Page (`/handover`)

**Current State:**
- Shift summary
- Patient list

**Improvements:**
- [ ] Use **Card** for summary stats
- [ ] Use **Badge** for patient status
- [ ] Use **Button** for actions
- [ ] Add **Progress** for shift completion

---

#### 4.2 Settings Page (`/settings`)

**Current State:**
- Profile section
- Plan/usage
- Language settings
- Help & feedback

**Improvements:**
- [ ] Use **Card** for sections
- [ ] Use **Switch** for toggles
- [ ] Use **Select** for language picker
- [ ] Use **Badge** for plan status
- [ ] Use **Button** for actions
- [ ] Add **Separator** between sections

**New Components Needed:**
- Switch (toggles)
- Select (dropdowns)

---

#### 4.3 Upgrade Modal

**Current State:**
- Pricing cards
- Stripe checkout

**Improvements:**
- [ ] Use **Dialog** component
- [ ] Use **Card** for pricing tiers
- [ ] Use **Badge** for "Most Popular"
- [ ] Use **Button** variants
- [ ] Add **Progress** for usage meter

**New Components Needed:**
- Dialog (modal)

---

## 🛠️ Implementation Roadmap

### Week 1: Foundation (P0 Components)

**Day 1-2: Dialog/Modal System**
- [ ] Install `@radix-ui/react-dialog`
- [ ] Create Dialog component
- [ ] Create Sheet component
- [ ] Update PDPA modal to use Dialog
- [ ] Update Upgrade modal to use Dialog

**Day 3-4: Toast Notifications**
- [ ] Install `@radix-ui/react-toast`
- [ ] Create ToastProvider
- [ ] Create useToast hook
- [ ] Add toasts to: copy, export, delete, save
- [ ] Add error toasts for API failures

**Day 5: Tabs + Skeleton**
- [ ] Install `@radix-ui/react-tabs`
- [ ] Create Tabs component
- [ ] Create Skeleton component
- [ ] Update Home page loading state
- [ ] Add tabs to Home filtering

---

### Week 2: Core Workflow (P0 Pages)

**Day 1-2: Home Page Redesign**
- [ ] Implement new card design
- [ ] Add Avatar for patient initials
- [ ] Add Badge for status
- [ ] Implement Tabs filtering
- [ ] Add Toast for actions

**Day 3: New Session Sheet**
- [ ] Convert to Sheet component
- [ ] Add Select for templates
- [ ] Improve validation with Form
- [ ] Add proper error states

**Day 4-5: Recording + Processing**
- [ ] Update buttons to use Button component
- [ ] Add Progress ring to orb
- [ ] Add Tooltips for controls
- [ ] Improve error states with Alert

---

### Week 3: Note Management (P1)

**Day 1-2: Note View Redesign**
- [ ] Implement Card-based SOAP sections
- [ ] Add Collapsible for transcript
- [ ] Add DropdownMenu for export
- [ ] Improve action buttons

**Day 3-4: Note Editor Redesign**
- [ ] Integrate TipTap with Textarea
- [ ] Add Tabs for mobile sections
- [ ] Improve AI command bar
- [ ] Add save confirmations

**Day 5: Polish + Testing**
- [ ] Test all flows end-to-end
- [ ] Fix accessibility issues
- [ ] Optimize animations
- [ ] Update documentation

---

### Week 4: Secondary Features (P2)

**Day 1-2: Settings + Handover**
- [ ] Redesign Settings with Cards
- [ ] Add Switches for toggles
- [ ] Add Select for dropdowns
- [ ] Update Handover layout

**Day 3: Onboarding + Login**
- [ ] Improve onboarding with Progress
- [ ] Add Form validation to Login
- [ ] Add Alert for errors
- [ ] Polish animations

**Day 4-5: Final Polish**
- [ ] Add remaining Tooltips
- [ ] Implement Command palette (bonus)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Documentation update

---

## 📦 Component Installation Guide

### Step 1: Install Missing Dependencies

```bash
cd scribe

# Dialog + Sheet (modals)
npm install @radix-ui/react-dialog @radix-ui/react-dialog-content

# Toast notifications
npm install @radix-ui/react-toast

# Tabs
npm install @radix-ui/react-tabs

# Dropdown Menu
npm install @radix-ui/react-dropdown-menu

# Switch
npm install @radix-ui/react-switch

# Select
npm install @radix-ui/react-select

# Command (search)
npm install cmdk

# Tooltip
npm install @radix-ui/react-tooltip

# Collapsible
npm install @radix-ui/react-collapsible

# Separator
npm install @radix-ui/react-separator

# Label (form labels)
npm install @radix-ui/react-label

# Form validation (optional but recommended)
npm install react-hook-form @hookform/resolvers zod
```

### Step 2: Create Component Files

Create these files in `/scribe/src/components/ui/`:

**dialog.jsx**
```jsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-700 bg-slate-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-800">
        <X className="h-4 w-4 text-white" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-400", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

**toast.jsx** (similar pattern for all components)

---

## 🎯 Success Metrics

### Quantitative

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| **Lighthouse Accessibility** | 85-90 | 95+ | Lighthouse audit |
| **Lighthouse PWA** | 90 | 100 | Lighthouse audit |
| **Bundle Size** | 859KB | <800KB | Webpack bundle analyzer |
| **First Contentful Paint** | ~1.2s | <1.0s | Chrome DevTools |
| **Time to Interactive** | ~2.5s | <2.0s | Chrome DevTools |

### Qualitative

| Aspect | Goal | Validation |
|--------|------|------------|
| **Visual Consistency** | All pages use shadcn/ui | Design review |
| **Touch Target Size** | All ≥ 48px | Manual audit |
| **Color Contrast** | All ≥ 4.5:1 | Contrast checker |
| **Keyboard Navigation** | Full tab support | Manual testing |
| **Screen Reader** | All elements labeled | Voiceover/NVDA test |

---

## 🧪 Testing Strategy

### Unit Tests (Components)

```javascript
// Example: Button.test.jsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-400')
  })

  it('applies destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-500')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
```

### Integration Tests (Flows)

```javascript
// Example: login-flow.test.jsx
describe('Login Flow', () => {
  it('completes login successfully', async () => {
    render(<Login />)
    
    // Enter email
    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test@example.com')
    
    // Submit
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    await user.click(submitButton)
    
    // Navigate to home
    await waitFor(() => {
      expect(window.location.pathname).toBe('/')
    })
  })
})
```

### E2E Tests (Playwright)

```javascript
// Example: e2e/recording-flow.spec.js
test('complete recording flow', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  
  // Create session
  await page.click('[data-testid="fab"]')
  await page.fill('[name="patientName"]', 'John Doe')
  await page.click('button:has-text("Start Recording")')
  
  // Record
  await page.waitForSelector('[data-testid="orb"]')
  await page.click('button:has-text("Done")')
  
  // Wait for processing
  await page.waitForURL(/\/note\/.*/)
  
  // Verify note generated
  await expect(page.locator('[data-testid="soap-section"]')).toBeVisible()
})
```

---

## 📚 Documentation Updates

### Component Documentation

Create `/scribe/docs/COMPONENTS.md`:

```markdown
# Hanna Scribe UI Components

## Button

```jsx
import { Button } from '@/components/ui/button'

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="icon"><Icon /></Button>
```

## Card

```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```
```

### Design Guidelines

Create `/scribe/docs/DESIGN.md`:

```markdown
# Design Guidelines

## Spacing
- Use 4px grid system
- Consistent gaps: 16px between cards, 8px between related items

## Typography
- Inter font family
- Hierarchy: H1 (24px) > H2 (20px) > H3 (18px) > Body (16px)

## Colors
- Primary: #6366F1 (Indigo-500)
- Success: #10B981 (Green-500)
- Warning: #F59E0B (Amber-500)
- Error: #EF4444 (Red-500)
```

---

## 🚨 Risk Mitigation

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Bundle size increase** | Medium | Low | Code splitting, lazy loading |
| **Breaking changes** | High | Medium | Incremental rollout, feature flags |
| **Browser compatibility** | Medium | Low | Test on iOS 15+, Android 10+ |
| **Performance regression** | High | Medium | Lighthouse CI, performance budgets |

### Mitigation Strategies

1. **Incremental Rollout**
   - Deploy to 10% users first
   - Monitor error rates
   - Gradual increase to 100%

2. **Feature Flags**
   - Wrap new components in flags
   - Easy rollback if issues

3. **Performance Monitoring**
   - Add Lighthouse CI to PR checks
   - Monitor Core Web Vitals
   - Set up performance alerts

---

## ✅ Definition of Done

A page/feature is "done" when:

- [ ] Uses shadcn/ui components consistently
- [ ] Passes Lighthouse accessibility audit (≥95)
- [ ] All touch targets ≥ 48px
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Loading states implemented (Skeleton)
- [ ] Error states handled (Alert/Toast)
- [ ] Success feedback provided (Toast)
- [ ] Mobile responsive (tested on iOS + Android)
- [ ] Desktop responsive (tested on Chrome + Safari)
- [ ] Offline mode works (PWA)
- [ ] Documentation updated

---

## 📞 Support & Resources

### shadcn/ui Resources
- **Documentation**: https://ui.shadcn.com/docs
- **GitHub**: https://github.com/shadcn/ui
- **Discord**: https://discord.gg/shadcn

### Radix UI Resources
- **Documentation**: https://www.radix-ui.com/docs
- **Primitives**: https://www.radix-ui.com/primitives

### Accessibility Resources
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **WAI-ARIA**: https://www.w3.org/WAI/ARIA/apg/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

## 🎉 Conclusion

This redesign plan transforms Hanna Scribe from a **functional** application to an **exceptional** one by:

1. **Standardizing** on shadcn/ui component library
2. **Improving** accessibility to WCAG 2.1 AA standards
3. **Enhancing** mobile UX with thumb-optimized design
4. **Polishing** micro-interactions and animations
5. **Documenting** design system for consistency

**Timeline:** 4 weeks (20 working days)  
**Effort:** ~120 hours  
**Impact:** Professional, trustworthy, accessible UI that drives conversions

---

**"From documentation burden to delightful care. Built for providers, by providers."**

---

*Last Updated: March 8, 2026*  
*Status: Ready for Implementation*  
*Next Step: Begin Week 1 — Foundation (P0 Components)*
