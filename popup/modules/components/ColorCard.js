import { createTokenList, setupCopyListeners } from './shared.js';

export const renderColorCard = (colorData) => {
  const card = document.createElement('div');
  card.className = 'color-card technical';
  const hasVariables = colorData.vars && colorData.vars.length > 0;
  const copyValue = hasVariables ? colorData.vars[0] : colorData.hex;

  card.innerHTML = `
    <div class="color-preview" style="background-color: ${colorData.hex}"></div>
    <div class="color-meta">
      <div class="hex-row">
        <span class="color-hex">${colorData.hex}</span>
        <span class="usage-pill">${colorData.count}x</span>
      </div>
      <div class="usage-context-label">${colorData.usageContext}</div>
      ${createTokenList(colorData.vars || [])}
    </div>
  `;

  setupCopyListeners(card, copyValue);
  return card;
};
