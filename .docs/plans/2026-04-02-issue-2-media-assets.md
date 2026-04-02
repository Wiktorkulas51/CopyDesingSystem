# Issue #2 Implementation Plan

> **For Antigravity:** Use `executing-plans` logic to implement this plan task-by-task.

**Goal:** Add a bottom navigation dashboard for the popup, extract media assets from the active page, and support batch ZIP export using JSZip.

**Architecture:** Keep the existing token analyzer and renderer stack, but expand the popup into a multi-view app with a sticky bottom nav. Extract media assets in the page runtime, normalize them in popup-side helpers, render them as asset cards, and use a dedicated ZIP export helper to download a structured archive. Preserve the premium Blueprint/CAD visual language.

**Tech Stack:** Vanilla HTML, CSS, ES modules, Chrome Extension MV3, JSZip.

### Task 1: Navigation Shell
**Files:**
- Modify: `popup/index.html`
- Modify: `popup/style/layout.css`
- Create: `popup/style/navigation.css`
- Modify: `popup/style/tokens.css`
- Modify: `popup/popup.js`

**Steps:**
1. Replace the top tab strip with a bottom navigation bar.
2. Add overview, media, SVGs, colors, fonts, and history views.
3. Update layout tokens for the fixed bottom shell.
4. Wire view switching in the popup controller.

### Task 2: Media Analyzer
**Files:**
- Modify: `popup/modules/analyzer/runtime.js`
- Create: `popup/modules/analyzer/media.js`

**Steps:**
1. Extract `img`, `video`, `audio`, `source`, `background-image`, and inline `svg` assets from the page runtime.
2. Capture basic metadata such as source, alt text, dimensions, and usage context.
3. Normalize media assets for popup-side rendering and grouping.

### Task 3: Asset UI
**Files:**
- Create: `popup/modules/components/AssetCard.js`
- Create: `popup/modules/views.js`
- Create: `popup/style/media.css`

**Steps:**
1. Render responsive asset cards with preview, metadata, copy link, and download actions.
2. Add filter chips for media types.
3. Render overview, colors, fonts, media, SVGs, and history views.

### Task 4: ZIP Export
**Files:**
- Create: `popup/modules/export/media-export.js`
- Modify: `popup/index.html`
- Add: `popup/vendor/jszip.min.js`
- Modify: `manifest.json`

**Steps:**
1. Add a local JSZip runtime to the popup.
2. Fetch asset blobs and package them into a structured ZIP archive.
3. Trigger a browser download from the popup.
4. Enable cross-origin asset fetching through host permissions.

### Task 5: Verification
**Files:**
- Modify: `.docs/CONTEXT.md`

**Steps:**
1. Verify all JS files remain under the 300-line limit.
2. Run syntax checks for every popup module.
3. Confirm the popup shell still behaves correctly after the new layout and navigation changes.
