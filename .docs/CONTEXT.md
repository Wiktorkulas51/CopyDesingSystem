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
- `scripts/`: Content scripts for DOM analysis.
- `assets/`: Icons and static resources.
- `.docs/`: Project documentation and plans.

## Design System Tokens
- **Theme**: Dark/Anthracite
- **Primary Accent**: Electric Blue / Neon Cyan
- **Surface**: Glassmorphism with Backdrop-filter.
- **Typography**: Inter (System default)

## Key Constraints (Rules)
- LF line endings.
- Mobile-first approach for popup.
- No Tailwind (unless requested later).
- "Wow" factor aesthetics.
