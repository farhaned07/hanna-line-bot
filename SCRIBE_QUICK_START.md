# 🚀 Hanna Scribe — UI Redesign Quick Start Guide

**For:** Development Team  
**Date:** March 8, 2026  
**Status:** Ready to Implement

---

## 📦 Step 1: Install Missing Components (30 minutes)

Run these commands in the `/scribe` directory:

```bash
cd scribe

# Dialog + Sheet (modals and bottom sheets)
npm install @radix-ui/react-dialog @radix-ui/react-dialog-content

# Toast notifications
npm install @radix-ui/react-toast

# Tabs (filtering, sections)
npm install @radix-ui/react-tabs

# Dropdown Menu (actions, user menu)
npm install @radix-ui/react-dropdown-menu

# Switch (settings toggles)
npm install @radix-ui/react-switch

# Select (dropdown pickers)
npm install @radix-ui/react-select

# Tooltip (hints, onboarding)
npm install @radix-ui/react-tooltip

# Collapsible (expandable sections)
npm install @radix-ui/react-collapsible

# Separator (dividers)
npm install @radix-ui/react-separator

# Label (form labels - already have, verify)
npm install @radix-ui/react-label

# Optional: Form validation (recommended)
npm install react-hook-form @hookform/resolvers zod
```

---

## 🎨 Step 2: Create Missing UI Components (2-3 hours)

Create these files in `/scribe/src/components/ui/`:

### Priority 1: Dialog + Sheet (30 min)

**File:** `dialog.jsx`
- Use Radix Dialog primitive
- Support overlay, title, description, close button
- Dark mode styling

**File:** `sheet.jsx`
- Extend Dialog for bottom sheet
- Slide-in from bottom animation
- Support different sides (bottom, right, left)

### Priority 2: Toast (30 min)

**File:** `toast.jsx`
**File:** `toaster.jsx`
**File:** `use-toast.js` (hook)

- Use Radix Toast primitive
- Support success, error, warning, info variants
- Auto-dismiss after 5 seconds
- Action buttons support

### Priority 3: Tabs + Skeleton (30 min)

**File:** `tabs.jsx`
- Use Radix Tabs primitive
- Support list + content structure
- Dark mode styling

**File:** `skeleton.jsx`
- Simple pulsing animation
- Support custom className

### Priority 4: Dropdown + Select (30 min)

**File:** `dropdown-menu.jsx`
- Use Radix DropdownMenu
- Support items, separators, submenus

**File:** `select.jsx`
- Use Radix Select primitive
- Support label, placeholder, items

### Priority 5: Others (30 min)

**File:** `switch.jsx`
**File:** `tooltip.jsx`
**File:** `collapsible.jsx`
**File:** `separator.jsx`
**File:** `textarea.jsx`

---

## 🏠 Step 3: Quick Wins — Update Existing Pages (2 hours)

### 3.1 Update Login Page (30 min)

**File:** `/scribe/src/pages/Login.jsx`

**Changes:**
```jsx
// Add Alert component for errors
import { Alert, AlertDescription } from '@/components/ui/alert'

// Replace error div with Alert
{error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}

// Add Label component properly
import { Label } from '@/components/ui/label'

<Label htmlFor="email">Email</Label>
```

### 3.2 Update Home Page (45 min)

**File:** `/scribe/src/pages/Home.jsx`

**Changes:**
```jsx
// Add Skeleton for loading
import { Skeleton } from '@/components/ui/skeleton'

// Replace loading divs
{loading ? (
  <div className="space-y-3">
    {[1, 2, 3].map(i => (
      <Skeleton key={i} className="h-20 w-full" />
    ))}
  </div>
) : (...)}

// Add Tabs for filtering
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="today">Today</TabsTrigger>
    <TabsTrigger value="week">This Week</TabsTrigger>
  </TabsList>
</Tabs>

// Add Toast for actions
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()

const handleDeleteSession = async (sessionId) => {
  try {
    await api.deleteSession(sessionId)
    toast({
      title: "Session deleted",
      description: "The session has been removed.",
      duration: 3000
    })
  } catch (err) {
    toast({
      title: "Delete failed",
      description: err.message,
      variant: "destructive"
    })
  }
}
```

### 3.3 Update Note View (45 min)

**File:** `/scribe/src/pages/NoteView.jsx`

**Changes:**
```jsx
// Add Collapsible for transcript
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

<Collapsible open={showTranscript} onOpenChange={setShowTranscript}>
  <CollapsibleTrigger asChild>
    <Button variant="ghost" className="w-full">
      View transcript {showTranscript ? '▲' : '▼'}
    </Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <Card className="mt-2">
      <CardContent>{session.transcript}</CardContent>
    </Card>
  </CollapsibleContent>
</Collapsible>

// Add Toast for copy
const handleCopy = async () => {
  await navigator.clipboard.writeText(text)
  toast({
    title: "Copied to clipboard",
    description: "The note has been copied.",
    duration: 2000
  })
}

// Add DropdownMenu for export
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Export</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleDownloadPdf}>PDF</DropdownMenuItem>
    <DropdownMenuItem onClick={handleCopy}>Copy Text</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 🎯 Step 4: Test Everything (1 hour)

### Manual Testing Checklist

**Login Flow:**
- [ ] Email validation works
- [ ] Error messages show in Alert
- [ ] Loading state on submit
- [ ] Language toggle works

**Home Page:**
- [ ] Loading shows Skeleton
- [ ] Session cards display correctly
- [ ] Search filters sessions
- [ ] FAB opens New Session sheet
- [ ] Swipe gestures work
- [ ] Delete shows Toast confirmation

**Recording Flow:**
- [ ] Orb animates correctly
- [ ] Timer displays properly
- [ ] Pause/Resume works
- [ ] Done navigates to Processing

**Processing:**
- [ ] 3 stages show correctly
- [ ] Progress indicators animate
- [ ] Language detection shows
- [ ] Auto-navigates to Note

**Note View:**
- [ ] SOAP sections display
- [ ] Transcript collapsible works
- [ ] Copy shows success Toast
- [ ] PDF download works
- [ ] Edit/Finalize buttons work

---

## 🐛 Common Issues & Fixes

### Issue 1: Component not found

**Error:** `Module not found: Can't resolve '@/components/ui/...'`

**Fix:** Check path alias in `vite.config.js`:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Issue 2: Styles not applying

**Error:** Component renders but no styles

**Fix:** Ensure `cn()` utility is used:
```jsx
import { cn } from '@/lib/utils'

className={cn("base-styles", className)}
```

### Issue 3: Toast not showing

**Error:** Toast called but nothing appears

**Fix:** Add Toaster to App.jsx:
```jsx
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <div className="min-h-dvh bg-bg">
      <Routes>...</Routes>
      <Toaster />
    </div>
  )
}
```

### Issue 4: Dialog not closing

**Error:** Dialog opens but won't close

**Fix:** Add `DialogTrigger` or controlled state:
```jsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <button onClick={() => setIsOpen(false)}>Close</button>
  </DialogContent>
</Dialog>
```

---

## 📁 File Structure After Changes

```
scribe/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── avatar.jsx ✅
│   │   │   ├── badge.jsx ✅
│   │   │   ├── button.jsx ✅
│   │   │   ├── card.jsx ✅
│   │   │   ├── dialog.jsx ⏳ NEW
│   │   │   ├── sheet.jsx ⏳ NEW
│   │   │   ├── toast.jsx ⏳ NEW
│   │   │   ├── toaster.jsx ⏳ NEW
│   │   │   ├── tabs.jsx ⏳ NEW
│   │   │   ├── skeleton.jsx ⏳ NEW
│   │   │   ├── dropdown-menu.jsx ⏳ NEW
│   │   │   ├── select.jsx ⏳ NEW
│   │   │   ├── switch.jsx ⏳ NEW
│   │   │   ├── tooltip.jsx ⏳ NEW
│   │   │   ├── collapsible.jsx ⏳ NEW
│   │   │   ├── separator.jsx ⏳ NEW
│   │   │   ├── textarea.jsx ⏳ NEW
│   │   │   ├── input.jsx ✅
│   │   │   ├── label.jsx ✅
│   │   │   └── progress.jsx ✅
│   │   ├── AuthGuard.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── TabBar.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Login.jsx ✏️ UPDATED
│   │   ├── Home.jsx ✏️ UPDATED
│   │   ├── Record.jsx
│   │   ├── Processing.jsx
│   │   ├── NoteView.jsx ✏️ UPDATED
│   │   ├── NoteEditor.jsx
│   │   ├── Handover.jsx
│   │   ├── Settings.jsx
│   │   └── Onboarding.jsx
│   └── ...
└── ...
```

---

## 🎨 Design Cheat Sheet

### Button Variants

```jsx
<Button>Default (Blue)</Button>
<Button variant="destructive">Red (Delete)</Button>
<Button variant="outline">Bordered</Button>
<Button variant="secondary">Gray</Button>
<Button variant="ghost">No background</Button>
<Button size="icon"><Icon /></Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Badge Variants

```jsx
<Badge>Default (Blue)</Badge>
<Badge variant="secondary">Gray</Badge>
<Badge variant="destructive">Red</Badge>
<Badge variant="success">Green</Badge>
<Badge variant="warning">Amber</Badge>
```

### Card Structure

```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Alert Variants

```jsx
<Alert>
  <AlertTitle>Default</AlertTitle>
  <AlertDescription>Info message</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Error message</AlertDescription>
</Alert>
```

---

## ✅ Quick Start Checklist

**Day 1 (4 hours):**
- [ ] Install all dependencies (30 min)
- [ ] Create Dialog component (30 min)
- [ ] Create Toast + useToast hook (30 min)
- [ ] Create Tabs + Skeleton (30 min)
- [ ] Create Dropdown + Select (30 min)
- [ ] Create Switch + Tooltip (30 min)
- [ ] Add Toaster to App.jsx (15 min)
- [ ] Test all new components (45 min)

**Day 2 (4 hours):**
- [ ] Update Login page with Alert (30 min)
- [ ] Update Home page with Skeleton + Tabs (45 min)
- [ ] Update Home page with Toast (30 min)
- [ ] Update NoteView with Collapsible (45 min)
- [ ] Update NoteView with DropdownMenu (30 min)
- [ ] Update NoteView with Toast (30 min)
- [ ] Test all updated pages (45 min)

**Total Time: 8 hours (1 working day)**

---

## 🚀 Next Steps

After completing quick start:

1. **Week 1:** Complete all P0 components (Dialog, Sheet, Toast)
2. **Week 2:** Redesign core pages (Home, Record, Processing)
3. **Week 3:** Redesign note pages (NoteView, NoteEditor)
4. **Week 4:** Polish + secondary features (Settings, Handover)

---

## 📞 Need Help?

**Common Questions:**

**Q: How do I customize component colors?**  
A: Edit the `cva()` variants in the component file, or pass custom `className`

**Q: Can I use these in TypeScript?**  
A: Yes! Components support TypeScript. Add `.tsx` extension and proper types.

**Q: How do I add animations?**  
A: Use Framer Motion (already installed) with Radix primitives

**Q: What about mobile responsiveness?**  
A: All components use Tailwind. Add responsive classes: `md:w-64 lg:w-96`

---

**"Start small. Ship fast. Iterate often."**

*Last Updated: March 8, 2026*
