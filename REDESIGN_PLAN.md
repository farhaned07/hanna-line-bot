# 🎨 Hanna Scribe UI Redesign Plan

## Overview
Redesigning Hanna Scribe with **shadcn/ui** for a modern, professional, and consistent UI while maintaining the core functionality specified in PRODUCT_SPEC.md and PRODUCT_WIREFRAME.md.

---

## ✅ Completed Setup

### 1. Dependencies Installed
- ✅ shadcn/ui core utilities (cva, clsx, tailwind-merge)
- ✅ Radix UI primitives (Dialog, Avatar, Progress, ScrollArea, etc.)
- ✅ Path aliases configured (`@/` → `./src/`)

### 2. Components Created
- ✅ Button (with variants: default, destructive, outline, secondary, ghost, link)
- ✅ Card (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- ✅ Input & Label
- ✅ Badge (with variants: default, secondary, destructive, outline, success, warning)
- ✅ Avatar (Avatar, AvatarImage, AvatarFallback)
- ✅ Progress
- ✅ Utils (cn function for class merging)

---

## 📋 Redesign Priority

### Phase 1: Core Authentication (P0)
1. **Login Page** - Clean, modern form with shadcn/ui
2. **Onboarding** - Simplified 3-screen flow

### Phase 2: Main Workflow (P0)
3. **Home Page** - Card-based session list, modern empty state
4. **Record Page** - Enhanced orb UI with better animations
5. **Processing Page** - Better progress indicators

### Phase 3: Note Management (P1)
6. **NoteView** - Professional medical documentation UI
7. **NoteEditor** - Enhanced TipTap editor with AI commands

### Phase 4: Secondary Features (P2)
8. **Handover** - Shift summary with better layout
9. **Settings** - Cleaner settings organization
10. **TabBar** - Updated navigation

---

## Design Principles

### 1. Mobile-First
- All touch targets ≥ 48px
- Thumb-zone optimized navigation
- Safe area insets respected

### 2. Accessibility
- WCAG 2.1 AA compliance
- Proper focus states
- Screen reader friendly
- Color contrast ≥ 4.5:1

### 3. Performance
- Lazy loading for heavy components
- Optimistic UI updates
- Skeleton loading states
- PWA offline support

### 4. Consistency
- shadcn/ui component library
- Unified color system
- Consistent spacing (4px grid)
- Inter font family

---

## Color System

### Primary Palette
```css
--primary: #6366F1 (Indigo)
--primary-foreground: #FFFFFF
```

### Semantic Colors
```css
--success: #10B981 (Green)
--warning: #F59E0B (Amber)
--error: #EF4444 (Red)
--info: #3B82F6 (Blue)
```

### Neutral Palette
```css
--background: #FAFAFA
--card: #FFFFFF
--surface: #F3F4F6
--border: #F0F0F0
--ink: #111827 (primary text)
--ink2: #6B7280 (secondary text)
--ink3: #9CA3AF (tertiary text)
```

---

## Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Scale
- **Display**: 34px (2.125rem) - Page titles
- **H1**: 28px (1.75rem) - User name
- **H2**: 22px (1.375rem) - Section headers
- **H3**: 18px (1.125rem) - Card titles
- **Body**: 15px (0.9375rem) - Default text
- **Small**: 13px (0.8125rem) - Captions
- **Tiny**: 11px (0.6875rem) - Labels

---

## Key UI Patterns

### 1. Session Card (Home)
```jsx
<Card className="session-card">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold">{patient_name}</h3>
        <p className="text-sm text-muted">HN: {hn}</p>
      </div>
    </div>
    <Badge variant={status}>{status}</Badge>
  </div>
</Card>
```

### 2. Recording Orb (Record)
```jsx
<div className="orb-container">
  <div className="orb-core" />
  <div className="orb-ring-1" />
  <div className="orb-ring-2" />
  <div className="timer">{formatTime(duration)}</div>
</div>
```

### 3. SOAP Section (NoteView)
```jsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-2">
      <Icon className="text-primary" />
      <CardTitle>{section}</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    <p className="prose">{content}</p>
  </CardContent>
</Card>
```

---

## User Flow Improvements

### Before → After

**Login:**
- ❌ Generic form → ✅ Modern card with brand gradient
- ❌ No validation → ✅ Real-time validation with feedback
- ❌ Plain inputs → ✅ shadcn/ui Input with focus states

**Home:**
- ❌ Basic list → ✅ Card-based with avatars
- ❌ No visual hierarchy → ✅ Clear grouping by date
- ❌ Plain empty state → ✅ Illustrated with CTA

**Recording:**
- ❌ Simple orb → ✅ Multi-layer animated orb
- ❌ Basic timer → ✅ Large, color-coded timer
- ❌ No feedback → ✅ Haptic + visual feedback

**Processing:**
- ❌ Loading spinner → ✅ Stage-by-stage progress
- ❌ No estimates → ✅ Time estimates per stage
- ❌ Plain text → ✅ Rich descriptions

---

## Implementation Status

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| Button | ✅ Complete | P0 | All variants working |
| Card | ✅ Complete | P0 | Full component set |
| Input | ✅ Complete | P0 | With label support |
| Badge | ✅ Complete | P0 | Multiple variants |
| Avatar | ✅ Complete | P1 | With fallback |
| Progress | ✅ Complete | P1 | For processing page |
| Login Page | ⏳ Pending | P0 | Next to implement |
| Home Page | ⏳ Pending | P0 | After login |
| Record Page | ⏳ Pending | P0 | Orb animations |
| Processing | ⏳ Pending | P0 | Progress indicators |
| NoteView | ⏳ Pending | P1 | SOAP cards |
| NoteEditor | ⏳ Pending | P1 | TipTap integration |

---

## Next Steps

1. **Redesign Login Page** - Use shadcn/ui Card, Input, Button
2. **Redesign Home Page** - Modern cards with avatars and badges
3. **Redesign Record Page** - Enhanced orb with framer-motion
4. **Redesign Processing** - Progress component with stages
5. **Redesign NoteView** - SOAP sections as cards
6. **Redesign NoteEditor** - Better AI command bar
7. **Test All Flows** - End-to-end testing

---

## Testing Checklist

- [ ] Login/Register flow
- [ ] Create session flow
- [ ] Recording → Processing → Note generation
- [ ] Edit note with AI commands
- [ ] Finalize and export
- [ ] Upgrade flow (free → pro)
- [ ] Settings changes
- [ ] Offline mode
- [ ] Mobile responsiveness
- [ ] Accessibility audit

---

**Last Updated**: March 8, 2026  
**Status**: Setup Complete, Ready for Page Redesign
