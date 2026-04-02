# Antigravity CopyDesignSystem - Implementation Plan

## Goal
Automate the extraction of website design tokens (starting with colors) to enable high-fidelity recreation.

## Batch 1: Construction & Manifest
- `manifest.json`: Manifest V3 setup.
- `popup/index.html`: Entry point for UI.
- `popup/index.css`: Design System (Glassmorphism).

## Batch 2: Core Logic (Extraction)
- `scripts/analyzer.js`: 
  - Function `analyzePalette()`: Iterate DOM and variables.
  - Function `rgbToHex()`: Conversion logic.
  - Function `getUsageStats()`: Counting instances.

## Batch 3: Interactivity (Popup)
- `popup/popup.js`:
  - `chrome.scripting.executeScript` to run analyzer on active tab.
  - Render list of colors.
  - Copy to clipboard functionality.

## Design Specs
- **Color Palette**: Darker theme (1A1A24 base), Accent (00FFD1 Neon Green).
- **Glassmorphism**: 
  - Background: `rgba(26, 26, 36, 0.8)`
  - Backdrop-filter: `blur(10px)`
  - Border: `1px solid rgba(255, 255, 255, 0.1)`

## Next Steps
1. Create `manifest.json`.
2. Create `popup/index.html` and `popup/index.css`.
3. Create `scripts/analyzer.js`.
