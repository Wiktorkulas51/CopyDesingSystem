import { createTokenList, setupCopyListeners } from './shared.js';

const getFontName = (fontFamily) => fontFamily.split(',')[0].replace(/['"]/g, '');

export const renderTypographyCard = (fontData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical font-card';
  const hasVariables = fontData.vars && fontData.vars.length > 0;
  const copyValue = hasVariables ? fontData.vars[0] : fontData.family;

  const weightsHTML = `
    <div class="weight-row">
      ${fontData.weights
        .map((weight) => `<span class="weight-pill" title="${weight.vars.join(', ')}">${weight.val}${weight.vars.length ? '*' : ''}</span>`)
        .join('')}
    </div>
  `;

  card.innerHTML = `
    <div class="font-preview-container" style="font-family: ${fontData.family}">
      <div class="font-preview-main">Aa</div>
      <div class="font-preview-sampleText">Abc 123...</div>
    </div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex font-family-name">${getFontName(fontData.family)}</span>
        <span class="usage-pill">${fontData.count}x</span>
      </div>
      <div class="usage-context-label">${fontData.usageContext}</div>
      ${weightsHTML}
      ${createTokenList(fontData.vars || [])}
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
      ${createTokenList(sizeData.vars || [])}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};
