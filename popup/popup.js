/**
 * Antigravity Popup Entry Point
 * Orchestrates design token extraction and UI rendering.
 */
import { analyzeDesignSystemRuntime } from './modules/analyzer/runtime.js';
import { normalizeMediaAssets, filterMediaAssets, buildMediaSummary, createMediaHistoryItem } from './modules/analyzer/media.js';
import { renderNavigation } from './modules/components/Navigation.js';
import { exportAssetsAsZip, downloadSingleAsset } from './modules/export/media-export.js';
import { generateAiPrompt } from './modules/formatter.js';
import {
  renderOverviewSummary,
  renderOverviewSections,
  renderColorsView,
  renderFontsView,
  renderMediaView,
  renderSvgView,
  renderHistoryView,
} from './modules/views.js';

document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyze-btn');
  const copyContextBtn = document.getElementById('copy-context-btn');
  const navRoot = document.getElementById('bottom-nav');
  const tabs = [...document.querySelectorAll('.tab-panel')];
  const viewRoots = {
    overview: document.getElementById('dashboard-summary'),
    overviewContent: document.getElementById('dashboard-grid'),
    media: document.getElementById('media-view'),
    svgs: document.getElementById('svgs-view'),
    colors: document.getElementById('colors-view'),
    fonts: document.getElementById('fonts-view'),
    history: document.getElementById('history-view'),
  };

  const state = {
    activeTab: 'overview',
    mediaFilter: 'all',
    results: null,
    mediaAssets: [],
    history: loadHistory(),
    activeTitle: 'Antigravity Capture',
    captureInFlight: false,
  };

  const mount = (target, content) => {
    target.replaceChildren();
    if (!content) return;
    if (typeof content === 'string') {
      target.innerHTML = content;
      return;
    }
    target.append(content);
  };

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem('antigravity.capture-history') || '[]');
    } catch {
      return [];
    }
  }

  function saveHistory() {
    localStorage.setItem('antigravity.capture-history', JSON.stringify(state.history.slice(0, 10)));
  }

  async function copyToClipboard(text, button) {
    const originalHTML = button.innerHTML;
    try {
      if (!text) {
        throw new Error('No copyable value available.');
      }
      await navigator.clipboard.writeText(text);
      button.innerHTML = '<span>COPIED TO CLIPBOARD!</span>';
    } catch (error) {
      try {
        const fallback = document.createElement('textarea');
        fallback.value = text;
        fallback.setAttribute('readonly', 'true');
        fallback.style.position = 'fixed';
        fallback.style.opacity = '0';
        document.body.appendChild(fallback);
        fallback.select();
        const copied = document.execCommand('copy');
        fallback.remove();
        if (!copied) throw error;
        button.innerHTML = '<span>COPIED TO CLIPBOARD!</span>';
      } catch (fallbackError) {
        console.error('Copy failed:', fallbackError);
        button.innerHTML = '<span>COPY FAILED</span>';
      }
    } finally {
      setTimeout(() => { button.innerHTML = originalHTML; }, 1500);
    }
  }

  function setBusyState(isBusy) {
    analyzeBtn.disabled = isBusy;
    copyContextBtn.disabled = isBusy || !state.results;
    analyzeBtn.querySelector('span').innerText = isBusy ? 'CAPTURING...' : 'REFRESH';
  }

  function setActiveTab(tabName) {
    state.activeTab = tabName;
    tabs.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === tabName));
    renderNav();
    renderActiveView();
  }

  function renderNav() {
    navRoot.innerHTML = renderNavigation(state.activeTab);
  }

  function renderEmpty(message) {
    return `<div class="empty-state">${message}</div>`;
  }

  function renderActiveView() {
    if (!state.results) {
      mount(viewRoots.overview, renderEmpty('Waiting for capture...'));
      mount(viewRoots.overviewContent, null);
      mount(viewRoots.media, renderEmpty('Capture a page to inspect media assets.'));
      mount(viewRoots.svgs, renderEmpty('Capture a page to inspect SVG assets.'));
      mount(viewRoots.colors, renderEmpty('Capture a page to inspect colors.'));
      mount(viewRoots.fonts, renderEmpty('Capture a page to inspect fonts.'));
      mount(viewRoots.history, renderHistoryView(state.history));
      return;
    }

    const mediaSummary = buildMediaSummary(state.mediaAssets);
    mount(viewRoots.overview, renderOverviewSummary(state.results, mediaSummary));
    mount(viewRoots.overviewContent, renderOverviewSections(state.results));
    mount(viewRoots.colors, renderColorsView(state.results));
    mount(viewRoots.fonts, renderFontsView(state.results));
    mount(viewRoots.media, renderMediaView(state.mediaAssets, state.mediaFilter, mediaSummary));
    mount(viewRoots.svgs, renderSvgView(state.mediaAssets));
    mount(viewRoots.history, renderHistoryView(state.history));
  }

  function findAsset(id) {
    return state.mediaAssets.find((asset) => asset.id === id);
  }

  async function handleMediaAction(action, assetId, triggerButton) {
    const asset = findAsset(assetId);
    if (!asset) return;

    if (action === 'copy') {
      const copyValue = asset.source || asset.previewUrl || asset.inlineMarkup || '';
      await copyToClipboard(copyValue, triggerButton || copyContextBtn);
      return;
    }

    if (action === 'download') {
      const index = state.mediaAssets.findIndex((item) => item.id === asset.id);
      await downloadSingleAsset(asset, index);
    }
  }

  async function handleExportZip() {
    const assets = filterMediaAssets(state.mediaAssets, state.mediaFilter);
    if (!assets.length) return;
    await exportAssetsAsZip(assets, state.activeTitle);
  }

  async function captureDesignSystem() {
    if (state.captureInFlight) return;
    state.captureInFlight = true;
    setBusyState(true);
    renderNav();
    renderActiveView();

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      state.activeTitle = tab?.title || 'Antigravity Capture';

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: analyzeDesignSystemRuntime,
      });

      if (!results?.[0]?.result) {
        throw new Error('Analyzer did not return data.');
      }

      state.results = results[0].result;
      state.mediaAssets = normalizeMediaAssets(state.results.media || []);
      state.history = [createMediaHistoryItem(state.results, state.mediaAssets, state.activeTitle), ...state.history].slice(0, 10);
      saveHistory();
      copyContextBtn.disabled = false;
      setActiveTab('overview');
    } catch (error) {
      state.results = null;
      state.mediaAssets = [];
      viewRoots.overview.innerHTML = renderEmpty(`Capture failed: ${error.message}`);
      copyContextBtn.disabled = true;
    } finally {
      state.captureInFlight = false;
      setBusyState(false);
      renderNav();
      renderActiveView();
    }
  }

  navRoot.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;
    setActiveTab(button.dataset.tab);
  });

  document.addEventListener('click', (event) => {
    const filterButton = event.target.closest('[data-media-filter]');
    if (filterButton) {
      state.mediaFilter = filterButton.dataset.mediaFilter;
      renderActiveView();
      return;
    }

    const mediaAction = event.target.closest('[data-asset-action]');
    if (mediaAction) {
      const card = mediaAction.closest('[data-asset-id]');
      const assetId = mediaAction.dataset.assetId || card?.dataset.assetId;
      handleMediaAction(mediaAction.dataset.assetAction, assetId, mediaAction);
      return;
    }

    if (event.target.closest('[data-action="export-zip"]')) {
      handleExportZip();
    }
  });

  analyzeBtn.addEventListener('click', captureDesignSystem);
  copyContextBtn.addEventListener('click', () => {
    if (!state.results) return;
    copyToClipboard(generateAiPrompt(state.results), copyContextBtn);
  });

  renderNav();
  renderActiveView();
  captureDesignSystem();
});
