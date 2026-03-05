# Hanna AI Nurse B2B - Design Language System & Wireframe
> **status**: Approved for Implementation
> **version**: 2.0 (Unicorn Polish)

---

## 🎨 1. Design Language System (DLS)
*Non-negotiable standards for all visual elements.*

### 1.1 Color Palette (Strict Limit: 5)
| Role | Color Name | Hex Code | Usage Rules |
| :--- | :--- | :--- | :--- |
| **Primary CTA** | **Hanna Blue** | `#6d9dad` | Main buttons, active states, key data highlights. |
| **Secondary** | **Hanna Accent** | `#0d465f` | Primary text, headings, icons, footer bg. |
| **Neutral BG** | **Pure White** | `#FFFFFF` | Default page background, card backgrounds. |
| **Alt BG** | **Cool Gray** | `#F8FAFC` | Alternating section backgrounds, subtle dividers. |
| **Body Text** | **Slate** | `#334155` | Paragraph text, secondary labels, borders. |

### 1.2 Typography
| Role | Font Family | Weights | Usage |
| :--- | :--- | :--- | :--- |
| **Headings** | `Plus Jakarta Sans` | 700 (Bold), 600 (Semi) | H1 (56px), H2 (40px), H3 (32px), H4 (24px). |
| **Body** | `Inter` | 400 (Regular), 500 (Med) | P (16px/24px), Small (14px), Buttons (16px). |

### 1.3 Iconography
- **Style**: **Outline** only.
- **Stroke**: Fixed **2px** width.
- **Color**: **Deep Navy** (`#0F172A`) or **Hanna Green** (`#2EB872`) for success states.
- **Size**: 24x24px (Standard), 48x48px (Features).

### 1.4 Spacing & Layout (8px Grid)
- **Base Unit**: `8px`
- **Section Padding**: `96px` (vertical)
- **Component Padding**: `16px` (small), `24px` (medium), `32px` (large).
- **Gaps**: `8, 16, 24, 32, 48, 64, 80, 96px`.
- **Max Width**: `1280px` (Desktop Container).

### 1.5 Component Styles
- **Border Radius**: `8px` (Buttons, Inputs, Cards).
- **Shadows**:
    - Default: `0px 1px 3px rgba(15, 23, 42, 0.1)`
    - Hover: `0px 10px 15px -3px rgba(15, 23, 42, 0.1)`
- **Buttons**:
    - **Primary**: Fill `#2EB872`, Text `#FFFFFF`, Height `48px`.
    - **Secondary**: Border `2px solid #0F172A`, Text `#0F172A`, Height `48px`.

---

## 🏗️ 2. Wireframe Specifications

### Section 1: Hero (Above the Fold)
**Background**: `#FFFFFF` | **Paddle-Y**: `96px`
- **Layout**: Split Screen (Grid: 1fr 1fr, Gap: `64px`).
- **Left Column**:
    - **Eyebrow**: "AI-Powered Care Management" (Caps, 12px, Color: `#2EB872`, Margin-B: `16px`).
    - **H1**: "Reduce Insurance Claims by 30%+" (Font: `Plus Jakarta`, Size: `56px`, Color: `#0F172A`, Margin-B: `24px`).
    - **Subhead**: "Daily voice check-ins via LINE catch chronic disease complications..." (Font: `Inter`, Size: `18px`, Color: `#334155`, Margin-B: `40px`).
    - **CTA Group** (Gap: `16px`):
        - [Button Primary]: "Book a Demo" (Fill: `#2EB872`).
        - [Button Secondary]: "View Pilot Proposal" (Outline: `#0F172A`).
    - **Trust Note**: "Trusted by leading Thai Insurers" (Size: `14px`, Color: `#334155`, Margin-T: `32px`).
- **Right Column**:
    - **Visual**: Composite Image (Radius: `24px`, Shadow: `Hover`).
        - *Base*: Elderly user holding phone.
        - *Overlay*: UI Card "Alert: Blood Pressure High" (Bg: `#FFFFFF`, Radius: `8px`).

### Section 2: Social Proof
**Background**: `#F8FAFC` | **Padding-Y**: `48px`
- **Layout**: Flex Row (Center, Gap: `48px`).
- **Content**: Horizontal list of monochrome logos or value props.
    - Icon: `CheckBadge` + Text: "PDPA Compliant"
    - Icon: `Beaker` + Text: "Clinical Research Backed"
    - Icon: `Building` + Text: "Built for Thai Insurers"
    - *Style*: Icons/Text color `#334155` (Opacity 80%).

### Section 3: The Problem
**Background**: `#FFFFFF` | **Padding-Y**: `96px`
- **Header**: Center Aligned.
    - H2: "The 361-Day Data Gap" (Size: `40px`, Margin-B: `16px`).
    - Sub: "Why traditional care management fails." (Size: `18px`, Margin-B: `64px`).
- **Grid**: 3 Columns (Gap: `32px`).
- **Card Design** (Repeat x3):
    - **Container**: Border `1px solid #E2E8F0`, Radius `8px`, Padding `32px`.
    - **Icon**: 48px, Color `#0F172A`. (Calendar / Money / Signal).
    - **H3**: "Unmonitored Gap" (Size: `24px`, Margin-Y: `16px`).
    - **Text**: "Patients see doctors 4 days/year. 361 days are blind." (Color: `#334155`).

### Section 4: Solution (How it Works)
**Background**: `#F8FAFC` | **Padding-Y**: `96px`
- **Layout**: 4-Step Horizontal Process (Desktop).
- **Header**: H2 "Hanna Fills the Gap" (Center, Margin-B: `80px`).
- **Step Component** (Repeat x4):
    - **Visual**: Circular Icon Container (Bg: `#FFFFFF`, Size: `80px`, Shadow: `Default`).
    - **Connector**: Line between steps (Color: `#E2E8F0`, Height: `2px`).
    - **Title**: "1. Daily Voice Check-in" (Font: `Plus Jakarta`, Size: `20px`, Margin-T: `24px`).
    - **Desc**: "Chat bubble: 'How is your sugar?'" (Font: `Inter`, Size: `16px`).

### Section 5: ROI Calculator
**Background**: `#0F172A` (Inverted) | **Padding-Y**: `96px`
- **Layout**: 2 Columns (Text Left, Interactive Right).
- **Left (Text)**:
    - H2: "Calculate Your Savings" (Color: `#FFFFFF`).
    - Text: "Based on 30% reduction in hospitalization rates." (Color: `#94A3B8`).
- **Right (Widget)**:
    - **Container**: Bg `#FFFFFF`, Radius `16px`, Padding `40px`.
    - **Input**: "Number of Lives" (Slider + Input Field).
    - **Result Box**: Bg `#F8FAFC`, Radius `8px`, Padding `24px`.
        - Label: "Projected Annual Savings"
        - Value: "฿ 15,000,000" (Color: `#2EB872`, Size: `40px`, Weight: `700`).

### Section 6: Technology Pillars
**Background**: `#FFFFFF` | **Padding-Y**: `96px`
- **Grid**: 3 Columns.
- **Features**:
    1. **Voice-First AI**: "Elderly-friendly LINE interface."
    2. **Human-in-the-Loop**: "Clinical triage dashboard."
    3. **Enterprise Security**: "AES-256 Encryption, PDPA."

### Section 7: Target Audience (Tabs)
**Background**: `#F8FAFC` | **Padding-Y**: `96px`
- **Tabs**: [Insurers] [Employers] [Hospitals].
    - *Active*: Bg `#0F172A`, Text `#FFFFFF`.
    - *Inactive*: Bg `Transparent`, Text `#334155`.
- **Content Area**: Dynamic panel showing "Challenge" vs "Solution" for selected segment.

### Section 8: Pilot Program (The Offer)
**Background**: `#FFFFFF` | **Padding-Y**: `96px`
- **Container**: Max-Width `800px`, Center.
- **Card**: Border `2px solid #2EB872` (Hanna Green), Radius `16px`, Shadows `Hover`.
- **Content**:
    - Badge: "Q1 2026 Cohort" (Bg `#2EB872`, Text White).
    - H2: "Launch Pilot Program".
    - Price: "Risk-Share Model" (No upfront implementation fee).
    - List: "Includes 100 patient licenses", "Custom Dashboard", "Weekly Reports".
    - CTA: [Book Pilot Call] (Primary Button).

### Section 9: Team
**Background**: `#F8FAFC` | **Padding-Y**: `96px`
- H2 "Leadership".
- Grid: photos + bios.

### Section 10: FAQ & Final CTA
**Background**: `#FFFFFF` | **Padding-Y**: `96px`
- **FAQ**: Accordion (Border-Bottom `1px solid #E2E8F0`, Padding `24px`).
- **Final CTA** (Bottom):
    - H2: "Ready to transform care?"
    - Button: [Book a Demo] (Size: Large, Height `64px`).
    - Footer Links: Privacy, Terms.

---
*End of Wireframe*
