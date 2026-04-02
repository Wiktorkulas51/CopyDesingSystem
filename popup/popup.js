/**
 * Antigravity Popup Entry Point
 * Orchestrates design token extraction and UI rendering.
 */
import { analyzeDesignSystemRuntime } from './modules/analyzer/runtime.js';
import { 
  renderColorCard, 
  renderRadiusCard, 
  renderTypographyCard, 
  renderSizeCard,
  renderSpacingCard,
  renderEffectCard,
  renderStrokeCard,
  renderContainerCard
} from './modules/renderers.js';

import { generateAiPrompt } from './modules/formatter.js';

document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyze-btn');
  const copyContextBtn = document.getElementById('copy-context-btn');
  const colorGrid = document.getElementById('color-grid');
  let lastResults = null;

  const copyToClipboard = async (text, btn) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>COPIED TO CLIPBOARD!</span>';
      setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const createSectionHeader = (title) => {
    const h = document.createElement('div');
    h.className = 'category-header';
    h.innerHTML = `<span class="prefix">//</span> ${title}`;
    return h;
  };

  const renderGroup = (items, renderer) => {
    const g = document.createElement('div');
    g.className = 'color-group';
    items.forEach(item => g.appendChild(renderer(item)));
    return g;
  };

  analyzeBtn.addEventListener('click', async () => {
    analyzeBtn.disabled = true;
    copyContextBtn.disabled = true;
    analyzeBtn.querySelector('span').innerText = 'ANALYZING...';
    colorGrid.innerHTML = '<div class="status-message">Extraction tokens, scale, spacing & effects...</div>';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: analyzeDesignSystemRuntime
      });

      if (!results?.[0] || !results[0].result) {
        throw new Error('Analyzer did not return data.');
      }

      lastResults = results[0].result;
      const { palette, radii, fonts, headings, body, spacing, effects, strokes, containers } = lastResults;
      colorGrid.innerHTML = '';

      // 1. Palette
      if (palette.length > 0) {
        colorGrid.appendChild(createSectionHeader('DESIGN SYSTEM PALETTE'));
        colorGrid.appendChild(renderGroup(palette, renderColorCard));
      }

      // 2. Radii
      if (radii.length > 0) {
        colorGrid.appendChild(createSectionHeader('RADIUS TOKENS'));
        colorGrid.appendChild(renderGroup(radii, renderRadiusCard));
      }

      // 3. Typography
      if (fonts.length > 0) {
        colorGrid.appendChild(createSectionHeader('TYPOGRAPHY TOKENS'));
        colorGrid.appendChild(renderGroup(fonts, renderTypographyCard));
      }

      // 4. Headings Scale
      if (headings.length > 0) {
        colorGrid.appendChild(createSectionHeader('FONT SCALE: HEADINGS'));
        colorGrid.appendChild(renderGroup(headings, renderSizeCard));
      }

      // 5. Body Scale
      if (body.length > 0) {
        colorGrid.appendChild(createSectionHeader('FONT SCALE: BODY TEXT'));
        colorGrid.appendChild(renderGroup(body, renderSizeCard));
      }

      // 6. Spacing Scale
      if (spacing && spacing.length > 0) {
        colorGrid.appendChild(createSectionHeader('SPACING SCALE'));
        colorGrid.appendChild(renderGroup(spacing, renderSpacingCard));
      }

      // 7. Visual Effects
      if (effects && effects.length > 0) {
        colorGrid.appendChild(createSectionHeader('VISUAL EFFECTS'));
        colorGrid.appendChild(renderGroup(effects, renderEffectCard));
      }

      // 8. Strokes & Outlines
      if (strokes && strokes.length > 0) {
        colorGrid.appendChild(createSectionHeader('STROKES & OUTLINES'));
        colorGrid.appendChild(renderGroup(strokes, renderStrokeCard));
      }

      // 9. Containers
      if (containers && containers.length > 0) {
        colorGrid.appendChild(createSectionHeader('CONTAINERS & LAYOUT'));
        colorGrid.appendChild(renderGroup(containers, renderContainerCard));
      }

      copyContextBtn.disabled = false;

    } catch (error) {
      colorGrid.innerHTML = `<div class="status-message" style="color: #ff4444">Error: ${error.message}</div>`;
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.querySelector('span').innerText = 'CAPTURE DESIGN';
    }
  });

  copyContextBtn.addEventListener('click', () => {
    if (!lastResults) return;
    const prompt = generateAiPrompt(lastResults);
    copyToClipboard(prompt, copyContextBtn);
  });
});
