# Implementation Plan: B2B Redesign

## Goal
Transform Hanna from a B2C direct-to-consumer app to a B2B enterprise platform for insurers.

## Safe Migration Strategy
1.  **Component Isolation**: Build new B2B components separately from existing B2C components.
2.  **Configuration Separation**: Use `constants-b2b.tsx` for new content, keeping `constants-mvp.tsx` intact.
3.  **Route Switching**: Update `App.tsx` to serve the B2B page at `/` but ensure the code is modular so we can revert or move it to a sub-route if needed.
4.  **Preservation**: Do not delete existing B2C components yet; just stop using them in the main route.

## Step 1: Content & Assets
- Create `constants-b2b.tsx` with all the text from the brief.

## Step 2: Component Development
Create the following new components in `/components`:
- `HeroB2B`
- `SocialProof`
- `ProblemB2B`
- `SolutionB2B`
- `RoiCalculator` (Interactive)
- `Technology`
- `WhoItsFor` (Interactive Tabs)
- `PilotProgram`
- `Team`
- `FAQB2B`
- `FinalCTAB2B`
- `FooterB2B`

## Step 3: Page Assembly
- Create `LandingPageB2B` component to hold the layout.
- Update `App.tsx` to render `LandingPageB2B`.

## Step 4: Styling
- Ensure Tailwind classes match the "Premium" and "Enterprise" aesthetic.
- Use "Hanna Green" for primary actions but shift to a more corporate/medical clean look (white/gray/blue accents).

## Step 5: Verification
- Verify responsiveness.
- Verify ROI calculator logic.
- Verify all links (Book Demo -> Calendly placeholder).
