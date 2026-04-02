import {
  renderColorCard,
  renderRadiusCard,
  renderTypographyCard,
  renderSizeCard,
  renderSpacingCard,
  renderEffectCard,
  renderStrokeCard,
  renderContainerCard,
} from './renderers.js';
import { renderAssetCard } from './components/AssetCard.js';

const createElement = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const summaryCard = (label, value, note, icon) => {
  const card = createElement('article', 'summary-card');
  card.innerHTML = `
    <div class="summary-header">
      <div class="summary-kicker">${label}</div>
      ${icon ? `<div class="summary-icon">${icon}</div>` : ''}
    </div>
    <div class="summary-value">${value}</div>
    <div class="summary-note">${note}</div>
  `;
  return card;
};

const sectionShell = (title, count) => {
  const section = createElement('section', 'section-shell');
  section.innerHTML = `
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-title">${title}</div>
        <div class="section-count">${count} items</div>
      </div>
    </div>
  `;
  return section;
};

const createGrid = (items, renderItem, emptyMessage) => {
  const grid = createElement('div', 'color-group');
  if (!items.length) {
    grid.append(createElement('div', 'empty-state', emptyMessage));
    return grid;
  }

  items.forEach((item) => grid.append(renderItem(item)));
  return grid;
};

const mountSection = (title, items, renderItem, emptyMessage) => {
  const section = sectionShell(title, items.length);
  section.querySelector('.section-card').append(createGrid(items, renderItem, emptyMessage));
  return section;
};

const createSummaryGrid = (...cards) => {
  const grid = createElement('div', 'summary-grid');
  cards.forEach((card) => grid.append(card));
  return grid;
};

const createContentStack = (...sections) => {
  const stack = createElement('div', 'content-stack');
  sections.forEach((section) => stack.append(section));
  return stack;
};

const createViewShell = () => createElement('div', 'view-shell');

const SUMMARY_ICONS = {
  capture: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"></path><path d="m11 10-2.5 2L6 10"></path><path d="M12 21h9"></path><path d="m18 18 3 3-3 3"></path></svg>`,
  media: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
  images: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  svgs: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2 4-4"></path><path d="m3 17 2 2 4-4"></path><path d="m13 6 2-2 4 4"></path><path d="m5 6 2-2 4 4"></path></svg>`,
};

export const renderOverviewSummary = () => null;

export const renderOverviewSections = (results) =>
  createContentStack(
    mountSection('Top Palette', results.palette.slice(0, 4), renderColorCard, 'No color tokens found.'),
    mountSection('Typography Signals', results.fonts.slice(0, 3), renderTypographyCard, 'No font tokens found.')
  );

export const renderColorsView = (results) =>
  createContentStack(
    mountSection('Color Palette', results.palette, renderColorCard, 'No color tokens found.'),
    mountSection('Radii', results.radii, renderRadiusCard, 'No radius tokens found.')
  );

export const renderFontsView = (results) =>
  createContentStack(
    mountSection('Typography', results.fonts, renderTypographyCard, 'No font families found.'),
    mountSection('Headings Scale', results.headings, renderSizeCard, 'No heading sizes found.'),
    mountSection('Body Scale', results.body, renderSizeCard, 'No body sizes found.')
  );

export const renderMediaView = (assets, filter, summary) => {
  const view = createViewShell();
  const filtered = filter === 'all' 
    ? assets 
    : assets.filter((asset) => asset.category === filter || asset.kind === filter || (filter === 'svgs' && asset.kind === 'svg'));
  
  const toolbar = createElement('div', 'view-toolbar');
  const filterGroup = createElement('div', 'filter-group');
  const chips = [
    ['all', 'All'],
    ['images', 'Images'],
    ['videos', 'Videos'],
    ['backgrounds', 'CSS'],
    ['svgs', 'SVGs'],
  ];

  chips.forEach(([key, label]) => {
    const button = createElement('button', `filter-btn${filter === key ? ' is-active' : ''}`, label);
    button.type = 'button';
    button.dataset.mediaFilter = key;
    filterGroup.append(button);
  });

  const exportButton = createElement('button', 'export-btn', 'Export ZIP');
  exportButton.type = 'button';
  exportButton.dataset.action = 'export-zip';

  const meta = createElement('div', 'view-toolbar__meta', `${filtered.length} items`);
  toolbar.append(filterGroup, meta, exportButton);

  const grid = createElement('div', 'asset-grid');
  if (!filtered.length) {
    grid.append(createElement('div', 'empty-state', 'No assets found.'));
  } else {
    filtered.forEach((asset, index) => grid.append(renderAssetCard(asset, index, filtered.length)));
  }

  view.append(toolbar, grid);
  return view;
};

export const renderSvgView = () => null;

export const renderHistoryView = (history) => {
  const list = createElement('div', 'history-list');
  if (!history.length) {
    list.append(createElement('div', 'empty-state', 'No history yet.'));
    return list;
  }

  history.forEach((entry) => {
    const item = createElement('article', 'history-item');
    item.innerHTML = `
      <div>
        <div class="history-item__title">${entry.title}</div>
        <div class="history-item__meta">${new Date(entry.createdAt).toLocaleString()}</div>
      </div>
      <div class="history-item__meta">${entry.mediaCount} media · ${entry.totalTokens} tokens</div>
    `;
    list.append(item);
  });

  return list;
};
