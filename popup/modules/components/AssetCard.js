const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const createIconButton = (action, label, pathData) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'asset-action-icon';
  button.dataset.assetAction = action;
  button.setAttribute('aria-label', label);
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="${pathData}"></path>
    </svg>
  `;
  return button;
};

const previewMarkup = (asset) => {
  if (asset.kind === 'video') {
    return `<video src="${escapeHtml(asset.previewUrl || asset.source)}" muted playsinline preload="metadata"></video>`;
  }

  if (asset.kind === 'audio') {
    return `<audio controls src="${escapeHtml(asset.previewUrl || asset.source)}"></audio>`;
  }

  if (asset.kind === 'background') {
    return '';
  }

  return `<img loading="lazy" src="${escapeHtml(asset.previewUrl || asset.source)}" alt="${escapeHtml(asset.alt || asset.fileName || asset.kind)}">`;
};

export const renderAssetCard = (asset, index = 0, total = 0) => {
  const card = document.createElement('article');
  card.className = 'color-card technical asset-card';
  card.dataset.assetId = asset.id;

  const title = asset.alt || asset.fileName || asset.sourceLabel || asset.kind;
  const subtitle = [asset.kind, asset.context].filter(Boolean).join(' · ');
  const previewUrl = asset.previewUrl || asset.source;
  const counterLabel = total ? `${index + 1} / ${total}` : `${index + 1}`;

  const preview = document.createElement('div');
  preview.className = `asset-preview ${asset.kind === 'background' ? 'asset-preview--background' : ''}`;
  if (asset.kind === 'background' && previewUrl) {
    preview.style.backgroundImage = `url("${previewUrl.replace(/"/g, '%22')}")`;
  }

  preview.innerHTML = `
    <div class="asset-preview__counter">${counterLabel}</div>
    <div class="asset-preview__actions"></div>
    ${previewMarkup(asset)}
  `;

  const actions = preview.querySelector('.asset-preview__actions');
  actions.append(
    createIconButton('copy', 'Copy asset link', 'M18 2H8C6.9 2 6 2.9 6 4v10h2V4h10V2zm3 4H10c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 14H10V8h11v12z'),
    createIconButton('download', 'Download asset', 'M5 20h14v-2H5v2zm7-18l-5 5h3v6h4V7h3l-5-5z')
  );

  const meta = document.createElement('div');
  meta.className = 'asset-meta';
  meta.innerHTML = `
    <div class="hex-row asset-meta__header">
      <span class="asset-title">${escapeHtml(title)}</span>
      <span class="usage-pill">${escapeHtml(asset.kind)}</span>
    </div>
    <div class="asset-subtitle">${escapeHtml(subtitle || 'media asset')}</div>
    <div class="asset-details">
      ${asset.width && asset.height ? `<span>${asset.width} × ${asset.height}</span>` : ''}
      ${asset.count > 1 ? `<span>${asset.count} uses</span>` : ''}
    </div>
  `;

  card.append(preview, meta);
  return card;
};
