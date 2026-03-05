# Hanna Brand Kit

**AI Nurse Co-Pilot**

> 10x Nurse Capacity Through Supervised AI

---

## Brand Overview

Hanna is supervised care infrastructure that bridges the gap between clinical visits. The brand identity communicates **trust**, **clinical intelligence**, and **modern healthcare innovation**.

### Brand Taglines
- **Primary:** "10x Nurse Capacity Through Supervised AI"
- **Supporting:** "Your nurses focus on exceptions. Hanna handles the rest."

---

## Logo

The Hanna logo features a friendly, approachable character that symbolizes care and connection. Use the provided logo files for all applications.

| File | Usage |
|------|-------|
| `hanna-logo.png` | Primary logo for web, apps, and presentations |

### Logo Usage Guidelines
- Maintain clear space around the logo equal to the height of the "h" character
- Do not distort, rotate, or alter the logo colors
- Minimum size: 32px height for digital, 10mm for print

---

## Color Palette

### Primary Brand Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Hana Primary** | `#6d9dad` | rgb(109, 157, 173) | Main accent, CTAs, interactive elements |
| **Hana Accent** | `#0d465f` | rgb(13, 70, 95) | Headlines, gradient anchor, deep emphasis |
| **Hana Dark** | `#082f40` | rgb(8, 47, 64) | Darkest brand, hero backgrounds |
| **Hana Light** | `#eef6f8` | rgb(238, 246, 248) | Light tints, subtle backgrounds |

### Surface Colors (Light Mode)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Surface Default** | `#F8FAFC` | Main page background |
| **Surface Subtle** | `#FFFFFF` | Cards, containers |
| **Surface Raised** | `#F1F5F9` | Hover states |
| **Surface Dark** | `#0F172A` | Dark sections (if needed) |

### Border Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Border Default** | `#E2E8F0` | Standard borders |
| **Border Subtle** | `#F1F5F9` | Subtle dividers |
| **Border Strong** | `#CBD5E1` | Emphasized borders |
| **Border Focus** | `#6d9dad` | Focus rings, active states |

### Text Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Text Primary** | `#0F172A` | Headlines, important text |
| **Text Secondary** | `#334155` | Body text, descriptions |
| **Text Tertiary** | `#64748B` | Subtle labels, metadata |

### Semantic Colors

| Purpose | Hex Code | Usage |
|---------|----------|-------|
| **Alert/Warning** | `#EF4444` | Error states, critical alerts |
| **Success** | `#22C55E` | Positive states, confirmations |
| **Brand Glow** | `rgba(109, 157, 173, 0.3)` | Shadow effects, ambient glow |

---

## Typography

### Font Families

| Font | Weight | Usage |
|------|--------|-------|
| **Poppins** | 400–900 | Headlines, titles, hero text |
| **Inter** | 400–600 | Body text, descriptions, UI elements |
| **JetBrains Mono** | 400–500 | Code, technical details, data |

### Font Loading
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Font | Weight | Size (Desktop) | Line Height |
|---------|------|--------|----------------|-------------|
| **Hero H1** | Poppins | 600–700 | 4rem–4.5rem | 1.15 |
| **Section H2** | Poppins | 600–700 | 2.5rem–3rem | 1.2 |
| **Subtitle H3** | Poppins | 500–600 | 1.5rem–1.875rem | 1.3 |
| **Body Large** | Inter | 400–500 | 1.25rem | 1.6 |
| **Body** | Inter | 400 | 1rem | 1.75 |
| **Caption** | Inter | 500 | 0.75rem | 1.4 |
| **Label (Uppercase)** | Inter | 700 | 0.625rem–0.75rem | 1.2 |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `tightest` | -0.04em | Hero headlines |
| `tighter` | -0.02em | Section titles |
| `normal` | 0em | Body text |
| `wide` | 0.025em | Buttons, labels |
| `widest` | 0.1em | Uppercase labels, tags |

---

## UI Components

### Buttons

#### Primary Button (CTA)
```
Background: #FFFFFF (white)
Text: #0F172A (dark)
Padding: 1rem 2rem
Border-radius: 9999px (pill)
Font: Bold
Shadow: 0 0 20px rgba(255, 255, 255, 0.2)
Hover: Scale up, enhanced glow
```

#### Secondary Button
```
Background: rgba(255, 255, 255, 0.05)
Text: #FFFFFF
Border: 1px solid rgba(255, 255, 255, 0.1)
Padding: 1rem 2rem
Border-radius: 9999px (pill)
Backdrop-filter: blur(12px)
```

### Cards

#### Glass Card (Light)
```
Background: rgba(255, 255, 255, 0.7)
Backdrop-filter: blur(20px)
Border: 1px solid rgba(255, 255, 255, 0.5)
Border-radius: 16px–24px
Shadow: 0 8px 32px rgba(45, 27, 105, 0.05)
Hover: bg-white/90, translate-y(-1px), brand shadow
```

#### Glass Card (Dark – for contrast elements)
```
Background: rgba(15, 23, 42, 0.8)
Backdrop-filter: blur(20px)
Border: 1px solid rgba(255, 255, 255, 0.1)
Border-radius: 16px–24px
Shadow: Large shadow
```

### Tags / Badges

#### Status Tag
```
Background: rgba(255, 255, 255, 0.1)
Border: 1px solid rgba(255, 255, 255, 0.2)
Text: White/90
Padding: 0.25rem 0.75rem
Border-radius: 9999px
Font: Bold, 10–12px, uppercase, letter-spacing: widest
```

### Border Radius Scale

| Token | Value |
|-------|-------|
| `sm` | 4px |
| `DEFAULT` | 8px |
| `md` | 10px |
| `lg` | 12px |
| `xl` | 16px |
| `2xl` | 24px |
| `3xl` | 32px |

---

## Gradients

### Hero Gradient
```css
background: linear-gradient(to bottom right, #082f40, #0d465f, rgba(109, 157, 173, 0.8));
```

### Text Gradient (Light)
```css
background: linear-gradient(to right, #eef6f8, #ffffff, #eef6f8);
-webkit-background-clip: text;
color: transparent;
```

### Accent Text Gradient
```css
background: linear-gradient(to right, #0d465f, #6d9dad);
-webkit-background-clip: text;
color: transparent;
```

---

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| `sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `DEFAULT` | 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06) | Standard cards |
| `md` | 0 4px 6px -1px rgba(0,0,0,0.1) | Elevated cards |
| `lg` | 0 10px 15px -3px rgba(0,0,0,0.1) | Modals, dropdowns |
| `xl` | 0 20px 25px -5px rgba(0,0,0,0.1) | Featured sections |
| `brand` | 0 20px 40px -10px rgba(109,157,173,0.3) | Branded hover states |
| `glow` | 0 0 20px rgba(109,157,173,0.5) | Accent glow effects |

---

## Animation

### Timing Functions
| Name | Value | Usage |
|------|-------|-------|
| `spring` | cubic-bezier(0.25, 0.46, 0.45, 0.94) | UI transitions |

### Key Animations
| Name | Description |
|------|-------------|
| `blob` | 7s infinite ambient movement |
| `shimmer` | 2.5s infinite loading state |
| `fade-in-up` | 0.8s entrance animation |

### Transition Defaults
- Duration: 300–500ms
- Easing: `ease-spring` or `ease-out`
- Properties: all, transform, opacity

---

## Iconography

We use **Lucide React** icons for consistent, clean iconography.

### Common Icons
| Icon | Usage |
|------|-------|
| `ArrowRight` | CTAs, navigation |
| `ArrowUpRight` | External links |
| `Activity` | Vitals, health data |
| `AlertTriangle` | Warnings, alerts |
| `MessageCircle` | Chat, patient interaction |
| `Users` | Team, patients |
| `CheckCircle` | Success, confirmed |
| `ShieldCheck` | Security, compliance |
| `Phone` | Contact |
| `Calendar` | Scheduling |

### Icon Sizing

| Context | Size |
|---------|------|
| Inline with text | 16px (w-4 h-4) |
| Card icons | 20–24px (w-5/6 h-5/6) |
| Feature icons | 40px (w-10 h-10) |

---

## Voice & Tone

### Brand Voice
- **Confident** but not arrogant
- **Clinical precision** with human warmth
- **Direct** and action-oriented
- **Empathetic** to healthcare challenges

### Writing Guidelines
1. Use active voice
2. Lead with benefits, not features
3. Keep sentences concise
4. Avoid jargon; explain technical terms
5. Numbers speak louder (e.g., "10x capacity", "50,000 nurses short")

### Key Phrases
- "Supervised AI" (emphasize human control)
- "10x Nurse Capacity"
- "Focus on exceptions"
- "Bridges the gap between visits"
- "AI Nurse Co-Pilot"

---

## CSS Variables Quick Reference

```css
:root {
  /* Brand Colors */
  --hana-primary: #6d9dad;
  --hana-accent: #0d465f;
  --hana-dark: #082f40;
  --hana-light: #eef6f8;
  
  /* Surfaces */
  --surface: #F8FAFC;
  --surface-subtle: #FFFFFF;
  --surface-raised: #F1F5F9;
  
  /* Text */
  --text-primary: #0F172A;
  --text-secondary: #334155;
  --text-tertiary: #64748B;
  
  /* Borders */
  --border: #E2E8F0;
  --border-subtle: #F1F5F9;
  --border-strong: #CBD5E1;
}
```

---

## File Structure

```
brand/
├── BRAND_KIT.md      # This document
└── hanna-logo.png    # Primary logo
```

---

**© 2026 Hanna AI. All rights reserved.**
