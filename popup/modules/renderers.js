/**
 * UI Component Renderers
 * Generates HTML cards for design tokens.
 */

export const setupCopyListeners = (card, copyValue) => {
  card.querySelectorAll('.token-name').forEach(token => {
    token.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(token.dataset.copy);
      const originalText = token.innerText;
      token.innerText = 'COPIED!';
      token.classList.add('copied');
      setTimeout(() => { token.innerText = originalText; token.classList.remove('copied'); }, 800);
    });
  });

  card.addEventListener('click', () => {
    navigator.clipboard.writeText(copyValue);
    const meta = card.querySelector('.color-meta');
    const originalMeta = meta.innerHTML;
    meta.innerHTML = '<div class="copied-full">COPIED!</div>';
    setTimeout(() => { meta.innerHTML = originalMeta; }, 1000);
  });
};

export const renderColorCard = (colorData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical';
  const hasVariables = colorData.vars && colorData.vars.length > 0;
  const copyValue = hasVariables ? colorData.vars[0] : colorData.hex;

  let varsHTML = hasVariables ? `
    <div class="card-tokens">
      ${colorData.vars.map(v => `<span class="token-name" data-copy="${v}">${v}</span>`).join('')}
    </div>
  ` : '';

  card.innerHTML = `
    <div class="color-preview" style="background-color: ${colorData.hex}"></div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex">${colorData.hex}</span>
        <span class="usage-pill">${colorData.count}x</span>
      </div>
      <div class="usage-context-label">${colorData.usageContext}</div>
      ${varsHTML}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};

export const renderRadiusCard = (radiusData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical radius-card';
  const hasVariables = radiusData.vars && radiusData.vars.length > 0;
  const copyValue = hasVariables ? radiusData.vars[0] : radiusData.value;
  
  let varsHTML = hasVariables ? `
    <div class="card-tokens">
      ${radiusData.vars.map(v => `<span class="token-name" data-copy="${v}">${v}</span>`).join('')}
    </div>
  ` : '';

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
      ${varsHTML}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};

export const renderTypographyCard = (fontData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical font-card';
  const hasVariables = fontData.vars && fontData.vars.length > 0;
  const copyValue = hasVariables ? fontData.vars[0] : fontData.family;
  
  const varsHTML = hasVariables ? `
    <div class="card-tokens">
      ${fontData.vars.map(v => `<span class="token-name" data-copy="${v}">${v}</span>`).join('')}
    </div>
  ` : '';

  const weightsHTML = `
    <div class="weight-row">
      ${fontData.weights.map(w => `<span class="weight-pill" title="${w.vars.join(', ')}">${w.val}${w.vars.length ? '*' : ''}</span>`).join('')}
    </div>
  `;

  card.innerHTML = `
    <div class="font-preview-container" style="font-family: ${fontData.family}">
      <div class="font-preview-main">Aa</div>
      <div class="font-preview-sampleText">Abc 123...</div>
    </div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex font-family-name">${fontData.family.split(',')[0].replace(/['"]/g, '')}</span>
        <span class="usage-pill">${fontData.count}x</span>
      </div>
      <div class="usage-context-label">${fontData.usageContext}</div>
      ${weightsHTML}
      ${varsHTML}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};

export const renderSizeCard = (sizeData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical size-card';
  const hasVariables = sizeData.vars && sizeData.vars.length > 0;
  const copyValue = hasVariables ? sizeData.vars[0] : sizeData.value;
  
  let varsHTML = hasVariables ? `
    <div class="card-tokens">
      ${sizeData.vars.map(v => `<span class="token-name" data-copy="${v}">${v}</span>`).join('')}
    </div>
  ` : '';

  card.innerHTML = `
    <div class="size-preview-container">
      <span style="font-size: ${sizeData.value}; line-height: 1;">Aa</span>
    </div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex">${sizeData.value}</span>
        <span class="usage-pill">${sizeData.count}x</span>
      </div>
      <div class="usage-context-label">${sizeData.usageContext}</div>
      ${varsHTML}
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
  
  let varsHTML = hasVariables ? `
    <div class="card-tokens">
      ${spacingData.vars.map(v => `<span class="token-name" data-copy="${v}">${v}</span>`).join('')}
    </div>
  ` : '';

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
      ${varsHTML}
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
    previewStyle = `box-shadow: ${effectData.value}; background: #2A2A2D; width: 30px; height: 30px; border-radius: 4px;`;
  } else if (effectData.type === 'textShadow') {
    previewStyle = `text-shadow: ${effectData.value}; color: white; font-weight: bold; font-size: 1.2rem;`;
    previewContent = 'Aa';
  } else if (effectData.type === 'backgroundImage') {
    // Gradient preview
    previewStyle = `background: ${effectData.value}; width: 100%; height: 100%; border-radius: 4px;`;
  } else if (effectData.type === 'backdropFilter') {
    previewStyle = `backdrop-filter: ${effectData.value}; -webkit-backdrop-filter: ${effectData.value}; background: rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);`;
  } else if (effectData.type === 'filter') {
    previewStyle = `filter: ${effectData.value}; background: #FED403; width: 24px; height: 24px; border-radius: 50%;`;
  } else if (effectData.type === 'mixBlendMode') {
    previewStyle = `mix-blend-mode: ${effectData.value}; background: #FED403; width: 30px; height: 30px; border-radius: 4px;`;
  }

  let varsHTML = hasVariables ? `
    <div class="card-tokens">
      ${effectData.vars.map(v => `<span class="token-name" data-copy="${v}">${v}</span>`).join('')}
    </div>
  ` : '';

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
      ${varsHTML}
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

  let previewHTML = '';
  if (strokeData.type === 'stroke-width') {
    previewHTML = `<div class="stroke-preview-line" style="height: ${strokeData.value}; background: var(--primary);"></div>`;
  } else {
    // For stroke colors, show a hollow circle (typical of strokes)
    previewHTML = `<div class="stroke-preview-circle" style="border: 2px solid ${strokeData.value}; width: 24px; height: 24px; border-radius: 50%;"></div>`;
  }

  let varsHTML = hasVariables ? `
    <div class="card-tokens">
      ${strokeData.vars.map(v => `<span class="token-name" data-copy="${v}">${v}</span>`).join('')}
    </div>
  ` : '';

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
      ${varsHTML}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};

