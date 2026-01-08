# Hanna LIFF App UI Mockup

**Mobile Interface Design (iPhone 14 Pro dimensions: 393×852px)**

---

## Visual Hierarchy (Top to Bottom)

### Background Layer
```
┌─────────────────────────────────┐
│  Gradient: emerald-50 → blue-50 │
│           → purple-50           │
│                                 │
│  🔵 Animated orb (top-left)    │
│     Size: 384px                 │
│     Color: emerald-300/20       │
│     Blur: 48px                  │
│                                 │
│              🔵 Animated orb    │
│              (bottom-right)     │
│              Size: 384px        │
│              Color: blue-300/20 │
│              Blur: 48px         │
└─────────────────────────────────┘
```

---

### Header Card (Glassmorphism)
```
┌───────────────────────────────┐
│ ╔═══════════════════════════╗ │
│ ║  Hanna Live        🎯     ║ │ ← Frosted glass card
│ ║  ● เชื่อมต่อแล้ว          ║ │   Background: rgba(255,255,255,0.7)
│ ╚═══════════════════════════╝ │   Blur: 20px
└───────────────────────────────┘   Border: white/30%
                                    Border-radius: 24px
                                    Shadow: soft
```

**Typography**:
- "Hanna" → Gray-800, 24px, Bold, Font: Prompt
- "Live" → Emerald-600, 24px, Bold, Font: Prompt  
- "● เชื่อมต่อแล้ว" → Gray-500, 14px, Font: Sarabun
- Green pulsing dot (2px, animated)

---

### Avatar Section (Center)
```
            ┌──────────────┐
            │              │
     ┌──────┴──────────────┴──────┐
     │   ╔════════════════════╗   │ ← Glassmorphic circle
     │   ║                    ║   │   256px diameter
     │   ║                    ║   │   Frosted white
     │   ║        🩺          ║   │   Gradient inside:
     │   ║                    ║   │   emerald/20 → blue/20
     │   ║    (emoji 72px)    ║   │   Border: white/50, 4px
     │   ╚════════════════════╝   │   Shadow: xl
     │                            │
     └────────────────────────────┘

              กำลังฟัง...          ← Emerald-600, 20px, semibold

            ▁ ▃ ▅ ▃ ▁             ← Voice waveform
           │ │ │ │ │ │            5 bars, emerald-500
           └─┴─┴─┴─┘              Animated heights
```

**Breathing Animation**:
- Scale: 1 → 1.08 → 1 (1.5s loop)
- Pulse ring expands outward when "listening"

---

### Controls Card (Bottom, Glassmorphism)
```
┌───────────────────────────────────┐
│   ╔═══════════════════════════╗   │ ← Frosted glass card
│   ║                           ║   │
│   ║          ◉               ║   │ ← Mic button
│   ║        ╱ │ ╲             ║   │   80px circle
│   ║       🎤  │               ║   │   Gradient: emerald-500→600
│   ║          ◉               ║   │   White mic icon (36px)
│   ║                           ║   │   Glow effect
│   ║  กดค้างเพื่อพูด · ปล่อยเพื่อส่ง ║   │
│   ║                           ║   │
│   ║  ┌──────────┐ ┌──────────┐║   │
│   ║  │📄 รายงาน │ │📞 วางสาย││   │ ← Secondary buttons
│   ║  └──────────┘ └──────────┘║   │   Rounded-2xl
│   ╚═══════════════════════════╝   │   Soft colors
└───────────────────────────────────┘
```

**Button Details**:
- **Mic Button**: 
  - Gradient: `linear-gradient(135deg, #10b981, #059669)`
  - Icon: White, 36px, 2.5px stroke
  - Shadow: 2xl
  - Glow: emerald-500, 50% opacity, blur 48px
  
- **Report Button**:
  - Background: blue-50
  - Text: blue-600, 14px, semibold
  - Icon: FileText, 18px
  
- **End Call Button**:
  - Background: gray-100
  - Text: gray-700, 14px, semibold
  - Icon: PhoneOff, 18px

---

## Color Palette

### Primary Colors
```css
--emerald-50:  #f0fdf4
--emerald-500: #10b981
--emerald-600: #059669

--blue-50:     #eff6ff
--blue-500:    #3b82f6
--blue-600:    #2563eb

--purple-50:   #faf5ff
--purple-600:  #9333ea
```

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.3);
```

---

## Animations

### 1. Avatar Breathing (Listening State)
```
Scale: [1, 1.08, 1]
Duration: 1.5s
Easing: ease-in-out
Loop: infinite
```

### 2. Pulse Ring (Listening State)
```
Scale: [0.8, 1.5, 2]
Opacity: [0, 1, 0]
Duration: 1.5s
Border: 4px emerald-500
Loop: infinite
```

### 3. Voice Waveform Bars
```
Heights: [12px, 24px, 12px]
Duration: 0.8s
Delay: staggered (0.1s each)
Color: emerald-500 (listening) | blue-500 (speaking)
```

### 4. Background Orbs
```
Orb 1 (top-left):
  Movement: x[0, 100, 0], y[0, -100, 0]
  Scale: [1, 1.2, 1]
  Duration: 20s

Orb 2 (bottom-right):
  Movement: x[0, -100, 0], y[0, 100, 0]  
  Scale: [1, 1.3, 1]
  Duration: 25s
```

### 5. Page Entrance
- Header: slide down from -50px, fade in (0.5s)
- Avatar: fade in, scale up (0.3s delay)
- Controls: slide up from 100px, fade in (0.5s, 0.2s delay)

---

## Status States & Colors

| State | Color | Animation |
|-------|-------|-----------|
| **Ready** | Gray-600 | Static |
| **Listening** | Emerald-600 | Breathing + pulse ring + waveform |
| **Thinking** | Purple-600 | Fade opacity |
| **Speaking** | Blue-600 | Subtle scale + waveform |
| **Error** | Red-600 | None |

---

## Typography

**Fonts**:
- Headers: `'Prompt'` (Google Fonts)
- Body: `'Sarabun'` (Google Fonts)
- Fallback: `-apple-system, BlinkMacSystemFont, sans-serif`

**Weights**:
- Headings: 700 (Bold)
- Subheadings: 600 (Semibold)
- Body: 400 (Regular)
- Labels: 500 (Medium)

---

## Spacing & Sizing

```
Margins/Padding:
- Page edges: 16px
- Card padding: 24px
- Card gaps: 16px

Border Radius:
- Cards: 24px
- Buttons (primary): 50% (circle)
- Buttons (secondary): 16px

Shadows:
- Cards: 0 4px 6px rgba(0,0,0,0.1)
- Mic button: 0 20px 25px rgba(0,0,0,0.15)
```

---

## Interactive States

### Mic Button
```
Normal:    emerald gradient, no scale
Hover:     +2px shadow (web only)
Active:    scale(0.95)
Disabled:  opacity 50%, cursor not-allowed
```

### Secondary Buttons
```
Normal:    blue-50 / gray-100
Hover:     blue-100 / gray-200
Active:    scale(0.98)
```

---

## Mobile Optimization

- Touch targets: minimum 44×44px
- Safe areas: respects iOS notch/home indicator
- Responsive: 320px - 428px width
- Orientation: portrait only
- Performance: 60fps animations via GPU acceleration

---

## Accessibility

- Color contrast: WCAG AA compliant
- Touch targets: 44px minimum
- Focus indicators: emerald-500 ring
- Screen reader labels on icons
- Reduced motion support (via CSS `prefers-reduced-motion`)

---

**Design Philosophy**: Clean, calming, medical-grade, premium, trustworthy

This is a **glassmorphic medical app** with soft aesthetics, smooth animations, and premium feel.
