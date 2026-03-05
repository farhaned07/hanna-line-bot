# Unicorn Design Polish Plan

## Vision
Transform the Hanna B2B landing page into a world-class, "Framer-style" SaaS website. The aesthetic will be "Medical Futurism" — clean, trustworthy, yet high-tech and warm.

## Core Design Pillars
1.  **Typography**: Adopt a "Tech-First" font stack.
    *   **Headings**: `Plus Jakarta Sans` or `Inter` (Tight tracking, bold weights).
    *   **Body**: `Inter` or `Geist` (High readability).
    *   **Thai Support**: Keep `Prompt` but ensure weight harmonization.
2.  **Color Palette (Refined)**:
    *   **Primary**: Reduce usage of "Hanna Main" purple. Use deep richness (`#1a1033`) for backgrounds and electric purple/green for accents only.
    *   **Surface**: Move from "White" to "Off-white" and "Glass".
    *   **Gradients**: Subtle "Aurora" blurs behind sections (Blue -> Purple -> Teal).
3.  **Layout & Spacing**:
    *   **Desktop**: Move to "Bento Grid" layouts for features.
    *   **Mobile**: Ensure touch targets are 44px+ and padding is unified (24px side padding).
    *   **Whitespace**: Increase section padding from `py-20` to `py-32` to let content breathe.
4.  **Motion (Framer Motion)**:
    *   **Scroll**: Elements fade in and float up (`y: 20 -> 0`, `opacity: 0 -> 1`).
    *   **Hover**: Cards lift (`scale: 1.02`), borders glow.
    *   **Micro**: Buttons have a "shine" pass-through effect.
5.  **Glassmorphism 2.0**:
    *   Add "noise" texture overlays to glass cards to prevent banding and increase realism.
    *   Use multiple border layers (inner white border for highlight, outer dark border for shadow).

## Actionable Steps

### 1. Global Styles Update (`index.css` & `index.html`)
- [ ] Import `Plus Jakarta Sans`.
- [ ] Add `noise.png` background pattern (css-generated).
- [ ] Define precise CSS variables for colors to ensure consistency.

### 2. Motion System Setup (`utils/animations.ts`)
- [ ] Create reusable `FadeIn`, `StaggerContainer`, `ScaleOnHover` components using `framer-motion`.

### 3. Component Deep-Dive Refactor

#### Navigation
- [ ] **Problem**: Too basic.
- [ ] **Fix**: Floating "Island" navbar (detached from top), glass background, distinct "Book Demo" button.

#### Hero Section
- [ ] **Problem**: Text feels loose. Image is a simple box.
- [ ] **Fix**: Tighter typography (letter-spacing -0.02em). Image gets a "Device Frame" or "Browser Window" wrapper. Background needs "moving" aurora gradients.

#### "Bento" Features (Problem/Solution)
- [ ] **Problem**: Standard icon grids are boring.
- [ ] **Fix**: Convert to mixed-span grid (some span 2 cols, some 1). Add rich gradients to card backgrounds.

#### ROI Calculator (The "Wow" Moment)
- [ ] **Problem**: Looks like a form.
- [ ] **Fix**: Make it look like a **Financial Instrument**. Dark mode, monospaced numbers, animated counters that count up when sliders move.

#### Social Proof
- [ ] **Problem**: Static text.
- [ ] **Fix**: Infinite scrolling marquee of insurer logos (use placeholders if needed, or generic shield icons).

### 4. Asset Generation
- [ ] Generate "clean" 3D icons for the 3 pillars (Voice, Nurse, Platform) to replace Lucide icons in key areas.
- [ ] Generate a subtle "medical mesh" background.

## Mobile Specifics
- [ ] **Hero**: Stack order (Text -> Image).
- [ ] **Nav**: Hamburger menu with full-screen glass overlay.
- [ ] **Cards**: Horizontal scroll snap for feature grids instead of vertical stacking to save height.
