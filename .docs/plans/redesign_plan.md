# Redesign Plan: Antigravity Chrome Extension

## Objective
Redesign the Antigravity Mapper extension to improve information density, provide a more premium feel, and prepare the UI for future feature expansions.

## Current Issues
- **Excessive Scrolling**: All token categories are listed vertically, leading to long pages.
- **Button Placement**: "Copy AI Context" is at the bottom, making it less accessible after analysis.
- **Manual Trigger**: Users have to click "Capture Design" manually upon opening.
- **Limited Scalability**: Vertical stack doesn't leave room for more complex options (e.g., section selection, history).

## Proposed Solution: The "Dashboard" Aesthetic
Transition from a simple vertical list to a structured dashboard with:
1. **Persistent Header Action Bar**: Critical tools (Copy Context, Settings) always available.
2. **Tabbed Navigation**: Categorize tokens (Colors, Typography, Layout, Effects) to eliminate scrolling.
3. **Auto-Capture Sequence**: Automatically start analysis on popup load.
4. **Bento Grid Enhancement**: More compact cards for better screen utilization.

---

## Task List

### Phase 1: Foundation & Header
- [ ] **T1.1**: Update `popup/index.html` structure:
    - Move `copy-context-btn` to high-priority header area.
    - Introduce navigation tabs (Dashboard, Tokens, Studio).
- [ ] **T1.2**: Update `popup/style/tokens.css` with new design tokens for glassmorphism and neon accents.
- [ ] **T1.3**: Update `popup/style/layout.css` for a "Fixed UI, Scrollable Content" model.

### Phase 2: Navigation & Compact Rendering
- [ ] **T2.1**: Implement Tab switching logic in `popup/popup.js`.
- [ ] **T2.2**: Update rendering logic to filter tokens by active tab or use a unified dashboard view.
- [ ] **T2.3**: Optimize `popup/style/cards.css` for higher density (smaller footprint, richer visuals).

### Phase 3: Automation & Polish
- [ ] **T3.1**: Update `popup/popup.js` to trigger "Capture Design" on `DOMContentLoaded`.
- [ ] **T3.2**: Add subtle micro-animations for card entry and status transitions.
- [ ] **T3.3**: Final aesthetic polish (backdrops, shadows, typography).

---

## Detailed Implementation Breakdown

### Phase 1: Header & Tabs
**File**: `popup/index.html`
- Move `copy-context-btn` next to the logo.
- Add `<nav class="tabs">`.
- Update main content container to support tab views.

### Phase 2: Compact Design
**File**: `popup/style/cards.css`
- Reduce padding and margin for token cards.
- Use `display: grid` with more columns where appropriate.

### Phase 3: Auto-Capture Logic
**File**: `popup/popup.js`
- Logic: `window.onload` -> query tab -> execute script.
- Show "Analyzing..." state instantly.
