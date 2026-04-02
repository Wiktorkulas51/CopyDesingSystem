# Issue #3 Implementation Plan

> **For Antigravity:** Use `executing-plans` logic to implement this plan task-by-task.

**Goal:** Redesign the popup into a fixed-header dashboard with tabs and automatic capture on open, while preserving the current design-system extraction behavior.

**Architecture:** Keep analysis and formatting logic intact, but reframe presentation around a compact dashboard shell. Use a single stateful popup controller to manage capture, tab switching, loading feedback, and section rendering. Keep the UI mobile-first and consistent with the existing Blueprint/CAD aesthetic.

**Tech Stack:** Vanilla HTML, CSS, and ES modules in a Chrome Extension popup.

### Task 1: Header and Navigation
**Files:**
- Modify: `popup/index.html`
- Modify: `popup/style/tokens.css`
- Modify: `popup/style/layout.css`

**Steps:**
1. Move the AI context action into the header.
2. Add tab navigation for Dashboard, Tokens, Layout, and Graphics.
3. Introduce premium glassmorphism tokens for the fixed header/nav surface.
4. Make the main content scrollable beneath a sticky header.

### Task 2: Auto-Capture Controller
**Files:**
- Modify: `popup/popup.js`

**Steps:**
1. Trigger analysis automatically on `DOMContentLoaded`.
2. Render loading, success, and error states explicitly.
3. Keep `Copy AI Context` disabled until capture finishes.
4. Add tab switching logic that shows only the active content group.

### Task 3: Dashboard Rendering
**Files:**
- Modify: `popup/popup.js`
- Modify: `popup/style/cards.css`

**Steps:**
1. Render a dashboard summary with compact metrics.
2. Group token cards by tab category.
3. Reduce spacing and increase density for a bento-style layout.
4. Add subtle transitions for tab changes and card entry.

### Task 4: Verification
**Files:**
- Modify: `.docs/CONTEXT.md`

**Steps:**
1. Update project context with the tabbed dashboard structure.
2. Verify file line limits remain under 300 lines.
3. Run syntax checks on popup JavaScript.
4. Confirm there are no debug leftovers or whitespace issues.
