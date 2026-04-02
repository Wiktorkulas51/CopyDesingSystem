import { createTokenList, setupCopyListeners } from './shared.js';

export const renderRadiusCard = (radiusData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical radius-card';
  const hasVariables = radiusData.vars && radiusData.vars.length > 0;
  const copyValue = hasVariables ? radiusData.vars[0] : radiusData.value;

  card.innerHTML = `
    <div class="radius-preview-container">
      <div class="radius-preview-box" style="border-radius: ${radiusData.value}"></div>
    </div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex">${radiusData.value}</span>
        <span class="usage-pill">${radiusData.count}x</span>
      </div>
      <div class="usage-context-label">${radiusData.usageContext}</div>
      ${createTokenList(radiusData.vars || [])}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};

export const renderSpacingCard = (spacingData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical size-card spacing-card';
  const hasVariables = spacingData.vars && spacingData.vars.length > 0;
  const copyValue = hasVariables ? spacingData.vars[0] : spacingData.value;

  card.innerHTML = `
    <div class="size-preview-container">
      <div class="spacing-bar" style="width: ${spacingData.value};"></div>
    </div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex">${spacingData.value}</span>
        <span class="usage-pill">${spacingData.count}x</span>
      </div>
      <div class="usage-context-label">${spacingData.usageContext}</div>
      ${createTokenList(spacingData.vars || [])}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};

export const renderEffectCard = (effectData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical effect-card';
  const hasVariables = effectData.vars && effectData.vars.length > 0;
  const copyValue = hasVariables ? effectData.vars[0] : effectData.value;
  let previewStyle = '';
  let previewContent = '';

  if (effectData.type === 'boxShadow') {
    previewStyle =
      'box-shadow: ' +
      effectData.value +
      '; background: #2A2A2D; width: 30px; height: 30px; border-radius: 4px;';
  } else if (effectData.type === 'textShadow') {
    previewStyle =
      'text-shadow: ' +
      effectData.value +
      '; color: white; font-weight: bold; font-size: 1.2rem;';
    previewContent = 'Aa';
  } else if (effectData.type === 'backgroundImage') {
    previewStyle =
      'background: ' +
      effectData.value +
      '; width: 100%; height: 100%; border-radius: 4px;';
  } else if (effectData.type === 'backdropFilter') {
    previewStyle =
      'backdrop-filter: ' +
      effectData.value +
      '; -webkit-backdrop-filter: ' +
      effectData.value +
      '; background: rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);';
  } else if (effectData.type === 'filter') {
    previewStyle =
      'filter: ' +
      effectData.value +
      '; background: #FED403; width: 24px; height: 24px; border-radius: 50%;';
  } else if (effectData.type === 'mixBlendMode') {
    previewStyle =
      'mix-blend-mode: ' +
      effectData.value +
      '; background: #FED403; width: 30px; height: 30px; border-radius: 4px;';
  }

  const typeLabel = effectData.type.replace(/([A-Z])/g, ' $1').toLowerCase();

  card.innerHTML = `
    <div class="effect-preview-container">
      <div class="effect-preview-box" style="${previewStyle}">
        ${previewContent}
      </div>
    </div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex effect-type-label">${typeLabel}</span>
        <span class="usage-pill">${effectData.count}x</span>
      </div>
      <div class="usage-context-label">${effectData.usageContext}</div>
      ${createTokenList(effectData.vars || [])}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};

export const renderStrokeCard = (strokeData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical stroke-card';
  const hasVariables = strokeData.vars && strokeData.vars.length > 0;
  const copyValue = hasVariables ? strokeData.vars[0] : strokeData.value;

  const previewHTML =
    strokeData.type === 'stroke-width'
      ? `<div class="stroke-preview-line" style="height: ${strokeData.value}; background: var(--primary);"></div>`
      : `<div class="stroke-preview-circle" style="border: 2px solid ${strokeData.value}; width: 24px; height: 24px; border-radius: 50%;"></div>`;

  card.innerHTML = `
    <div class="stroke-preview-container">
      ${previewHTML}
    </div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex">${strokeData.value}</span>
        <span class="usage-pill">${strokeData.count}x</span>
      </div>
      <div class="usage-context-label">${strokeData.usageContext}</div>
      ${createTokenList(strokeData.vars || [])}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};

export const renderContainerCard = (containerData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical container-card';
  const hasVariables = containerData.vars && containerData.vars.length > 0;
  const copyValue = hasVariables ? containerData.vars[0] : containerData.value;

  card.innerHTML = `
    <div class="container-preview-outer">
      <div class="container-preview-inner" style="width: 80%;">
        <div class="container-preview-measure"></div>
      </div>
    </div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex">${containerData.value}</span>
        <span class="usage-pill">${containerData.count}x</span>
      </div>
      <div class="usage-context-label">${containerData.usageContext}</div>
      <div class="container-category-label ${containerData.isLayout ? 'is-layout' : ''}">[${containerData.category}]</div>
      ${createTokenList(containerData.vars || [])}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};
