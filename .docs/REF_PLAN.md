# Refactoring & Modularization Plan

This plan aims to improve the codebase by splitting large files into smaller, more focused modules, adhering to the project's standards (300-line limit) and Atomic Design principles.

## 1. CSS Modularization
`popup/index.css` is currently over 500 lines. We will split it into functional units in a new `popup/style/` directory.

### Proposed Structure:
- `popup/style/tokens.css`: Root variables and design tokens.
- `popup/style/base.css`: Global resets, body styles, and scrollbars.
- `popup/style/layout.css`: App structure (#app, .header, .main, .footer, grids).
- `popup/style/components.css`: Reusable UI atoms like buttons (.primary-btn), pills (.usage-pill), and labels (.section-label).
- `popup/style/cards.css`: Molecule-level components (.color-card) and their technical variants.
- `popup/style/previews.css`: Specific styles for preview containers (radius-preview, font-preview, spacing-bar, etc.).

## 2. Analyzer Logic Decomposition
`popup/modules/analyzer.js` contains a complex 270-line function with nested helpers and long loops. We will move helpers to a utility directory.

### Proposed Structure:
- `popup/modules/utils/color-utils.js`: `normalizeColor` and color conversion logic.
- `popup/modules/utils/dom-utils.js`: `updateContext`, `getTopContext`, and visibility checks.
- `popup/modules/analyzer/config.js`: Thresholds and property lists (spacingProps, effectProps, etc.).
- `popup/modules/analyzer.js`: Simplified main orchestrator.

## 3. Renderer Componentization
`popup/modules/renderers.js` is essentially a component library. We will split it into atomic/molecular components.

### Proposed Structure:
- `popup/modules/components/shared.js`: `setupCopyListeners` and common item behaviors.
- `popup/modules/components/ColorCard.js`: Specific renderer for color tokens.
- `popup/modules/components/TypographyCard.js`: Font and size renderers.
- `popup/modules/components/VisualCard.js`: Radius, effect, stroke, and container renderers.
- `popup/modules/renderers.js`: Re-exporting main entry point.

## 4. Steps to Execute:
1. **Batch 1: CSS Refining**
   - Create `popup/style/` directory.
   - Extract sections from `index.css` into new files.
   - Update `index.html` to include the new CSS files.
   - Delete `index.css`.
2. **Batch 2: Utility Extraction**
   - Create `popup/modules/utils/` directory.
   - Move color and DOM helpers from `analyzer.js` and `renderers.js`.
3. **Batch 3: Component Splitting**
   - Create `popup/modules/components/` directory.
   - Move individual renderers into their own files.
   - Update imports in `popup.js`.
4. **Batch 4: Analyzer Cleanup**
   - Refactor `analyzer.js` to use the new utilities and simplified logic blocks.

## Verification:
- Ensure the extension popup looks and functions IDENTICALLY to its current state.
- Verify that every file is well below 300 lines.
- Remove all `console.log` and temporary artifacts.

> [!IMPORTANT]
> This refactoring will significantly improve the "DX" (Developer Experience) and make it easier to add new extractors in the future.
