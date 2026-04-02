# Implementation Plan - UI & Aesthetic Elevation

The goal is to transform the core UI components of the **Antigravity Mapper** from a functional layout into a **premium, "Wow-factor" experience**. We will focus on the elements identified in the user-provided images: the Header, Summary Cards, and Bottom Navigation.

## 1. Design Vision: "Techno-Glass"
We will evolve the current theme toward a "Techno-Glass" aesthetic—combining heavy glassmorphism, precise neon accents, and high-contrast typography.

## 2. Granular Task List

### Phase 1: Token & Base Refinement
- [ ] **Enhance `style/tokens.css`**:
  - Add sophisticated color variables (e.g., `--accent-glow`, `--surface-border-light`, `--surface-glow`).
  - Introduce fluid spacing tokens for better card breathing room.
- [ ] **Refine `style/base.css`**:
  - Fine-tune global transition timing for "snappy" feeling interactions.
  - Implement a more refined scrollbar for the `main` container.

### Phase 2: Navigation (Visual Overhaul)
- [ ] **Update `Navigation.js`**:
  - Replace text-based icons (`◈`, `◉`, etc.) with high-fidelity, custom-crafted SVGs.
  - Wrap the label in a more readable bold/uppercase treatment.
- [ ] **Enhance `style/navigation.css`**:
  - Create a "Floating Pill" active state with a heavy blur and subtle inner shadow.
  - Add a micro-bounce animation when switching tabs.
  - Scale icons slightly on active.

### Phase 3: Header & Primary Actions
- [ ] **Elevate Brand/Logo**:
  - Add a subtle pulse animation to the `logo-box`.
  - Apply a subtle `text-shadow` or horizontal offset to "ANTIGRAVITY" for a tech-logotype feel.
- [ ] **Redesign Buttons in `style/components.css`**:
  - **Copy Button**: Add a persistent but subtle glow (`box-shadow: 0 0 15px var(--accent-glow)`).
  - **Refresh Button**: Convert to a "ghost" style with a precise border-image or gradient border.
  - Implement high-fidelity `:active` states (slight scale down and shadow tightening).

### Phase 4: Summary Grid & Dashboard
- [ ] **Enhance `summary-card` in `style/layout.css`**:
  - Use a vertical gradient background with a "high-glass" top section.
  - Add a 1px top-accent line (teal/blue) to guide the eye.
  - Make `summary-value` (the count) larger and more prominent with a slight emerald tint.
- [ ] **Improve Section Headers**:
  - Refine the "Top Palette" and "Typography Signals" section typography for better hierarchy.

## 3. Aesthetic Improvements (Visual Reference)

| Component | Current State | Improved State (Proposed) |
| :--- | :--- | :--- |
| **Nav Icons** | ASCII characters (`◈`) | Precise SVGs (Stroke-based, Neon) |
| **Active Tab** | Solid teal box | Floating glass pill with glow |
| **Primary Btn** | Flat teal | Gradient + Outer Glow + Active Scale |
| **Stat Cards** | Dark grey border | Layered glass + Accent top line |
| **Typography** | Default weighting | Variable weighting (800 for counts, 600 for labels) |

---
> [!IMPORTANT]
> **Action Required**: Once these changes are approved, please type **"działaj"** to initiate the implementation of this visual overhaul.
