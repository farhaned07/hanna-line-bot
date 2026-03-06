# 🎨 UI COMPARISON: SCRIBE APP vs NURSE DASHBOARD

**Date:** March 7, 2026  
**Purpose:** Document design system differences

---

## 📊 OVERVIEW

| Aspect | Scribe App | Nurse Dashboard |
|--------|-----------|-----------------|
| **Theme** | ☀️ Light Mode | 🌙 Dark Mode |
| **Primary Color** | `#6366F1` (Indigo) | `#60A5FA` (Blue) |
| **Background** | `#FAFAFA` (Light gray) | `#0F172A` (Dark slate) |
| **Text** | `#111827` (Dark) | `#F8FAFC` (Light) |
| **Vibe** | Clean, Modern, Consumer | Enterprise, Clinical, Pro |

---

## 🎨 DESIGN SYSTEM TOKENS

### Scribe App (Light Theme)

**File:** `scribe/src/index.css`

```css
/* Background */
--color-bg: #FAFAFA;      /* Surface */
--color-card: #FFFFFF;     /* Cards */
--color-surface: #F3F4F6;  /* Inputs */

/* Text */
--color-ink: #111827;   /* Primary text */
--color-ink2: #6B7280;  /* Secondary */
--color-ink3: #9CA3AF;  /* Tertiary */

/* Accent */
--color-accent: #6366F1;  /* Indigo */

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);

/* Border Radius */
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 16px;
--radius-xl: 24px;
```

### Nurse Dashboard (Dark Theme)

**File:** `client/src/styles/tokens.css`

```css
/* Background (Dark Mode) */
--bg-base: #0F172A;      /* Base */
--bg-card: #1E293B;      /* Cards */
--bg-elevated: #334155;  /* Elevated */
--bg-hover: #475569;     /* Hover */

/* Text */
--text-primary: #F8FAFC;   /* Primary */
--text-secondary: #94A3B8; /* Secondary */
--text-muted: #64748B;     /* Muted */

/* Semantic Colors */
--color-critical: #EF4444;  /* Red alerts */
--color-high: #F59E0B;      /* Amber warnings */
--color-normal: #60A5FA;    /* Blue normal */
--color-success: #22C55E;   /* Green success */

/* AI Attribution */
--ai-tint: rgba(96, 165, 250, 0.1);
--human-tint: rgba(34, 197, 94, 0.1);
```

---

## 🏠 LOGIN PAGE COMPARISON

### Scribe Login

**File:** `scribe/src/pages/Login.jsx`

**Style:**
- Background: `#FAFAFA` (light gray)
- Card: White with subtle shadow
- Orb: Gradient indigo/purple animation
- Input fields: Light gray background
- Button: Indigo gradient
- Font: Inter, rounded corners
- Vibe: Friendly, approachable, consumer

**Key Visual Elements:**
```jsx
background: '#FAFAFA'
orb: 'radial-gradient(circle at 35% 35%, #A5B4FC, #6366F1 60%, #4F46E5)'
button: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
```

### Nurse Dashboard Login

**File:** `client/src/pages/Login.jsx`

**Style:**
- Background: `#0B0D12` (very dark)
- Card: Dark slate with ambient glow
- Image: Professional hero image (left side)
- Input fields: Dark background with light text
- Button: Solid indigo
- Font: Inter, enterprise styling
- Vibe: Professional, clinical, enterprise

**Key Visual Elements:**
```jsx
bg-[#0B0D12]
card: bg-[#13151A] rounded-[2rem]
ambient glow: bg-indigo-900/20 blur-[120px]
hero image: Professional medical photo
```

---

## 📱 COMPONENT COMPARISON

### Cards

| Property | Scribe | Nurse Dashboard |
|----------|--------|-----------------|
| Background | `#FFFFFF` | `#1E293B` |
| Border | `#F0F0F0` (light) | `#475569` (dark) |
| Shadow | Subtle, layered | Strong, dramatic |
| Radius | `16px` (rounded) | `2rem` (very rounded) |

### Buttons

| Property | Scribe | Nurse Dashboard |
|----------|--------|-----------------|
| Primary | Indigo gradient | Solid indigo |
| Radius | `12px` | `12px` (consistent) |
| Hover | Lift + shadow | Brighten |
| Text | White | White |

### Input Fields

| Property | Scribe | Nurse Dashboard |
|----------|--------|-----------------|
| Background | `#F3F4F6` (light) | `#0B0D12` (dark) |
| Border | `#F0F0F0` | `#2A2E38` |
| Text | Dark | Light |
| Placeholder | Gray | Gray-600 |

---

## 🎯 USER EXPERIENCE DIFFERENCES

### Scribe App

**Target User:** Doctors, clinicians  
**Use Case:** Quick clinical documentation  
**Design Goals:**
- ✅ Fast, frictionless
- ✅ Minimal cognitive load
- ✅ Friendly, approachable
- ✅ Mobile-first (PWA)

**Visual Language:**
- Light, airy, spacious
- Soft shadows, rounded corners
- Animated elements (orb, transitions)
- Consumer-grade polish

### Nurse Dashboard

**Target User:** Nurses, clinic staff  
**Use Case:** Patient monitoring, triage  
**Design Goals:**
- ✅ Professional, clinical
- ✅ High contrast for long shifts
- ✅ Information density
- ✅ Desktop-first

**Visual Language:**
- Dark mode (reduces eye strain)
- Strong visual hierarchy
- Semantic colors (red/amber/green)
- Enterprise-grade seriousness

---

## 🔍 TECHNICAL DIFFERENCES

### CSS Framework

| Aspect | Scribe | Nurse Dashboard |
|--------|--------|-----------------|
| **Framework** | Tailwind CSS v4 | Tailwind CSS v3 |
| **Config** | Inline `@theme` | `tokens.css` |
| **Build** | Vite 7.x | Vite 5.x |

### Component Libraries

| Aspect | Scribe | Nurse Dashboard |
|--------|--------|-----------------|
| **UI Components** | Custom + HeroUI | Custom |
| **Icons** | Lucide React | Lucide React |
| **Animations** | Framer Motion | CSS transitions |
| **Charts** | None | Recharts |

---

## 📊 ACCESSIBILITY

### Scribe App
- ✅ Light mode (WCAG AA for normal text)
- ✅ High contrast buttons
- ⚠️ Animated orb (may need reduce-motion)
- ✅ Mobile-friendly touch targets

### Nurse Dashboard
- ✅ Dark mode (WCAG AA)
- ✅ High contrast alerts
- ✅ Keyboard navigation
- ✅ Screen reader labels

---

## 💡 RECOMMENDATIONS

### Should They Match?

**NO** - Different purposes, different users:

1. **Scribe** = Consumer-grade, fast, friendly
   - Doctors use it for 2-5 minutes per patient
   - Needs to feel modern and approachable
   - Light mode is fine for short sessions

2. **Nurse Dashboard** = Enterprise, serious, clinical
   - Nurses use it for 8+ hour shifts
   - Dark mode reduces eye strain
   - Professional appearance builds trust

### What Could Be Unified?

1. **Brand Colors:**
   - Both use indigo (`#6366F1`) as primary
   - ✅ Consistent brand identity

2. **Typography:**
   - Both use Inter font
   - ✅ Consistent typography

3. **Iconography:**
   - Both use Lucide React icons
   - ✅ Consistent icon style

### What Should Stay Different?

1. **Theme (Light vs Dark)** - Keep both
2. **Tone (Friendly vs Professional)** - Keep both
3. **Density (Spacious vs Dense)** - Keep both

---

## ✅ CONCLUSION

**Scribe App:**
- ☀️ Light theme
- 🎯 Consumer-grade UX
- 📱 Mobile-first PWA
- ⚡ Fast, friendly, modern

**Nurse Dashboard:**
- 🌙 Dark theme
- 🏥 Enterprise-grade UX
- 💻 Desktop-first
- 📊 Professional, clinical

**Both are appropriate for their use cases.** No need to unify them.

---

**Document Created:** March 7, 2026  
**Purpose:** Design system documentation  
**Status:** ✅ Complete
