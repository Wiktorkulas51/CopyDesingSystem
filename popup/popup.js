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
  renderContainerCard,
} from './modules/renderers.js';
import { generateAiPrompt } from './modules/formatter.js';

document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyze-btn');
  const copyContextBtn = document.getElementById('copy-context-btn');
  const tabButtons = [...document.querySelectorAll('.tab-btn')];
  const panels = [...document.querySelectorAll('.tab-panel')];
  const targets = {
    dashboard: {
      summary: document.getElementById('dashboard-summary'),
      content: document.getElementById('dashboard-grid'),
    },
    tokens: document.getElementById('tokens-grid'),
    layout: document.getElementById('layout-grid'),
    graphics: document.getElementById('graphics-grid'),
  };
  let lastResults = null;
  let captureInFlight = false;

  const copyToClipboard = async (text, button) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalHTML = button.innerHTML;
      button.innerHTML = '<span>COPIED TO CLIPBOARD!</span>';
      setTimeout(() => {
        button.innerHTML = originalHTML;
      }, 1500);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const createEmptyState = (message) => {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = message;
    return empty;
  };

  const createSummaryCard = (label, value, note) => {
    const card = document.createElement('article');
    card.className = 'summary-card';
    card.innerHTML = `
      <div class="summary-kicker">${label}</div>
      <div class="summary-value">${value}</div>
      <div class="summary-note">${note}</div>
    `;
    return card;
  };

  const createSection = (title, items, renderer, emptyMessage) => {
    const section = document.createElement('section');
    section.className = 'section-shell';

    const shell = document.createElement('div');
    shell.className = 'section-card';
    shell.innerHTML = `
      <div class="section-card-header">
        <div class="section-title">${title}</div>
        <div class="section-count">${items.length} items</div>
      </div>
    `;

    if (!items.length) {
      shell.appendChild(createEmptyState(emptyMessage));
    } else {
      const grid = document.createElement('div');
      grid.className = 'color-group';
      items.forEach((item) => grid.appendChild(renderer(item)));
      shell.appendChild(grid);
    }

    section.appendChild(shell);
    return section;
  };

  const renderTabSections = (container, sections) => {
    container.innerHTML = '';
    sections.forEach((section) => container.appendChild(section));
  };

  const renderDashboard = (results) => {
    const { palette, radii, fonts, headings, body, spacing, effects, strokes, containers } = results;
    const totalTokens =
      palette.length + radii.length + fonts.length + headings.length + body.length + spacing.length + effects.length + strokes.length + containers.length;

    targets.dashboard.summary.innerHTML = '';
    [
      createSummaryCard('Capture', `${totalTokens}`, 'distinct token groups'),
      createSummaryCard('Tokens', `${palette.length + radii.length + fonts.length}`, 'core system primitives'),
      createSummaryCard('Layout', `${spacing.length + containers.length}`, 'spacing and containers'),
      createSummaryCard('Graphics', `${effects.length + strokes.length}`, 'effects and outlines'),
    ].forEach((card) => targets.dashboard.summary.appendChild(card));

    renderTabSections(targets.dashboard.content, [
      createSection('Top Palette', palette.slice(0, 4), renderColorCard, 'No color tokens found.'),
      createSection('Typography Signals', fonts.slice(0, 3), renderTypographyCard, 'No font tokens found.'),
      createSection('Layout Density', spacing.slice(0, 4), renderSpacingCard, 'No spacing tokens found.'),
      createSection('Graphics', effects.slice(0, 3), renderEffectCard, 'No visual effects found.'),
    ]);
  };

  const renderCategoryTabs = (results) => {
    const { palette, radii, fonts, headings, body, spacing, effects, strokes, containers } = results;
    renderTabSections(targets.tokens, [
      createSection('Color Palette', palette, renderColorCard, 'No color tokens found.'),
      createSection('Radii', radii, renderRadiusCard, 'No radius tokens found.'),
      createSection('Typography', fonts, renderTypographyCard, 'No font families found.'),
      createSection('Headings Scale', headings, renderSizeCard, 'No heading sizes found.'),
      createSection('Body Scale', body, renderSizeCard, 'No body sizes found.'),
    ]);
    renderTabSections(targets.layout, [
      createSection('Spacing Scale', spacing, renderSpacingCard, 'No spacing tokens found.'),
      createSection('Containers', containers, renderContainerCard, 'No layout containers found.'),
    ]);
    renderTabSections(targets.graphics, [
      createSection('Effects', effects, renderEffectCard, 'No visual effects found.'),
      createSection('Strokes', strokes, renderStrokeCard, 'No stroke tokens found.'),
    ]);
  };

  const setActiveTab = (tabName) => {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === tabName;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === tabName));
  };

  const setBusyState = (isBusy) => {
    analyzeBtn.disabled = isBusy;
    copyContextBtn.disabled = isBusy || !lastResults;
    analyzeBtn.querySelector('span').innerText = isBusy ? 'CAPTURING...' : 'REFRESH';
  };

  const captureDesignSystem = async () => {
    if (captureInFlight) return;
    captureInFlight = true;
    setBusyState(true);
    targets.dashboard.summary.innerHTML = '<div class="status-message">Auto-capturing active page...</div>';
    targets.dashboard.content.innerHTML = '';
    targets.tokens.innerHTML = '';
    targets.layout.innerHTML = '';
    targets.graphics.innerHTML = '';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: analyzeDesignSystemRuntime,
      });
      if (!results?.[0]?.result) throw new Error('Analyzer did not return data.');

      lastResults = results[0].result;
      renderDashboard(lastResults);
      renderCategoryTabs(lastResults);
      copyContextBtn.disabled = false;
      setActiveTab('dashboard');
    } catch (error) {
      targets.dashboard.summary.innerHTML = '';
      targets.dashboard.content.innerHTML = '';
      targets.dashboard.summary.appendChild(createEmptyState(`Capture failed: ${error.message}`));
      copyContextBtn.disabled = true;
    } finally {
      captureInFlight = false;
      setBusyState(false);
    }
  };

  analyzeBtn.addEventListener('click', captureDesignSystem);
  copyContextBtn.addEventListener('click', () => {
    if (!lastResults) return;
    copyToClipboard(generateAiPrompt(lastResults), copyContextBtn);
  });
  tabButtons.forEach((button) => button.addEventListener('click', () => setActiveTab(button.dataset.tab)));

  setActiveTab('dashboard');
  captureDesignSystem();
});
