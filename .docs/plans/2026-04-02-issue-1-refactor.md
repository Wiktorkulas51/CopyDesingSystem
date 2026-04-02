# Issue #1 Implementation Plan

> **For Antigravity:** Use `executing-plans` logic to implement this plan task-by-task.

**Goal:** Refactor the popup codebase into modular CSS and JavaScript files while preserving the current UI and behavior.

**Architecture:** Split presentation into dedicated style layers, move pure analysis helpers into reusable utility modules, and break renderer logic into atomic component files. Keep `popup/popup.js` as the orchestration entry point and keep all files under the 300-line limit.

**Tech Stack:** Vanilla JS ES modules, vanilla CSS, Chrome Extension MV3 popup.

### Task 1: CSS Modularization
**Files:**
- Create: `popup/style/tokens.css`
- Create: `popup/style/base.css`
- Create: `popup/style/layout.css`
- Create: `popup/style/components.css`
- Create: `popup/style/cards.css`
- Create: `popup/style/previews.css`
- Modify: `popup/index.html`
- Delete: `popup/index.css`

**Steps:**
1. Move design tokens and shared variables into `tokens.css`.
2. Move resets, body styling, and scrollbars into `base.css`.
3. Move structural layout rules into `layout.css`.
4. Move reusable controls and labels into `components.css`.
5. Move card shell and content rules into `cards.css`.
6. Move preview-specific rules into `previews.css`.
7. Update `index.html` to load the new style files in order.
8. Verify the popup still renders the same structure by loading the extension manually.

### Task 2: Analyzer Utilities
**Files:**
- Create: `popup/modules/utils/color-utils.js`
- Create: `popup/modules/utils/dom-utils.js`
- Create: `popup/modules/analyzer/config.js`
- Modify: `popup/modules/analyzer.js`

**Steps:**
1. Extract color normalization into `color-utils.js`.
2. Extract visibility, context, and usage helpers into `dom-utils.js`.
3. Move thresholds and DOM property lists into `config.js`.
4. Refactor `analyzer.js` into smaller orchestration helpers that use the new modules.
5. Run syntax checks on the analyzer files.

### Task 3: Renderer Components
**Files:**
- Create: `popup/modules/components/shared.js`
- Create: `popup/modules/components/ColorCard.js`
- Create: `popup/modules/components/TypographyCard.js`
- Create: `popup/modules/components/VisualCard.js`
- Modify: `popup/modules/renderers.js`
- Modify: `popup/popup.js`

**Steps:**
1. Extract shared copy behavior into `shared.js`.
2. Split token card renderers into focused component modules.
3. Turn `renderers.js` into a clean re-export entry point.
4. Update `popup.js` imports only if required by the new module structure.
5. Verify the popup still renders all token sections and copy interactions.

### Task 4: Documentation and Validation
**Files:**
- Modify: `.docs/CONTEXT.md`

**Steps:**
1. Update the project context with the new popup folder layout.
2. Verify all popup JavaScript files remain under 300 lines.
3. Confirm there are no `console.log` or temporary debug statements left in the popup modules.
4. Capture the final git diff and status before closing the issue.
