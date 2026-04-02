# CopyDesignSystem - Context

## Project Overview
A Chrome Extension for extracting high-fidelity design systems from websites, starting with color palettes and usage metrics.

## Tech Stack
- **Core**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: Vanilla CSS (Premium Dark Mode, Glassmorphism)
- **Manifest**: Manifest V3
- **Architecture**: Atomic Design principles (though contained within a popup environment)

## Current Structure
- `manifest.json`: Extension entry point.
- `popup/`: UI and Popup-specific logic.
- `popup/index.html`: Fixed-header popup shell with bottom navigation and multiple views.
- `popup/style/`: Modular popup CSS split into tokens, base, layout, navigation, media, components, cards, and previews.
- `popup/modules/utils/`: Shared pure helpers for color and DOM analysis.
- `popup/modules/components/`: Atomic token-card renderers, navigation, asset cards, and shared copy interactions.
- `popup/modules/analyzer/`: Analyzer configuration, DOM scanning, media extraction, and result assembly helpers.
- `popup/modules/export/`: ZIP export helpers powered by local JSZip.
- `scripts/`: Content scripts for DOM analysis.
- `assets/`: Icons and static resources.
- `.docs/`: Project documentation and plans.

## Design System Tokens
- **Theme**: Dark/Anthracite Dashboard logic.
- **Primary Accent**: Electric Blue / Neon Cyan (#00ffd1).
- **Surface**: Heavy Glassmorphism (20px blur).
- **Navigation**: Tabbed Dashboard (Dashboard, Tokens, Layout, Graphics).
- **Typography**: Inter (System default).

## Key Constraints (Rules)
- LF line endings.
- Mobile-first approach for popup.
- No Tailwind (unless requested later).
- "Wow" factor aesthetics.
