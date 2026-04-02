const MEDIA_FILTERS = ['all', 'images', 'videos', 'audio', 'backgrounds', 'svgs'];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'asset';

const getContext = (element) => {
  const contextEl = element.closest('[id], [class]');
  if (!contextEl) return '';
  const idPart = contextEl.id ? `#${contextEl.id}` : '';
  const classPart = contextEl.className
    ? `.${String(contextEl.className).split(/\s+/).filter(Boolean).slice(0, 2).join('.')}`
    : '';
  return `${contextEl.tagName}${idPart}${classPart}`;
};

const normalizeUrl = (rawUrl) => {
  if (!rawUrl) return '';
  try {
    return new URL(rawUrl, document.baseURI).href;
  } catch {
    return rawUrl;
  }
};

const getFileName = (url, fallback) => {
  if (!url) return fallback;
  try {
    const pathname = new URL(url).pathname;
    const fileName = pathname.split('/').pop() || fallback;
    return fileName.split('?')[0] || fallback;
  } catch {
    return fallback;
  }
};

const normalizeContextPath = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const isSvgSource = (source) => /\.svg(\?|$)/i.test(source || '') || /^data:image\/svg\+xml/i.test(source || '');

const getKind = (asset) => {
  if (asset.kind === 'svg' || isSvgSource(asset.source || '') || isSvgSource(asset.previewUrl || '')) return 'svgs';
  if (asset.kind === 'background') return 'backgrounds';
  if (asset.kind === 'image') return 'images';
  if (asset.kind === 'video') return 'videos';
  if (asset.kind === 'audio') return 'audio';
  return 'all';
};

export const normalizeMediaAssets = (assets = []) => {
  const seen = new Map();

  return assets
    .map((asset, index) => {
      const source = normalizeUrl(asset.source || asset.url || '');
      const inlineMarkup = asset.inlineMarkup || '';
      const key = `${asset.kind}|${source || inlineMarkup}`;
      if (seen.has(key)) return null;
      const fileName =
        asset.fileName || getFileName(source, `${asset.kind}-${index + 1}.${asset.kind === 'audio' ? 'mp3' : asset.kind === 'video' ? 'mp4' : 'png'}`);
      const previewUrl = asset.previewUrl || source || (inlineMarkup ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(inlineMarkup)}` : '');
      const normalized = {
        ...asset,
        id: key,
        source,
        fileName,
        previewUrl,
        context: asset.context || '',
        contextPath: normalizeContextPath(asset.contextPath || asset.context || ''),
        kind: asset.kind,
        category: getKind(asset),
      };
      seen.set(key, true);
      return normalized;
    })
    .filter(Boolean);
};

export const filterMediaAssets = (assets, filter) =>
  filter === 'all' ? assets : assets.filter((asset) => asset.category === filter || asset.kind === filter);

export const buildMediaSummary = (assets) => ({
  total: assets.length,
  images: assets.filter((asset) => asset.category === 'images').length,
  videos: assets.filter((asset) => asset.category === 'videos').length,
  audio: assets.filter((asset) => asset.category === 'audio').length,
  backgrounds: assets.filter((asset) => asset.category === 'backgrounds').length,
  svgs: assets.filter((asset) => asset.category === 'svgs').length,
});

export const createMediaHistoryItem = (results, assets, title) => ({
  id: crypto.randomUUID?.() || `${Date.now()}`,
  title,
  createdAt: new Date().toISOString(),
  totalTokens: results.palette.length + results.radii.length + results.fonts.length + results.headings.length + results.body.length + results.spacing.length + results.effects.length + results.strokes.length + results.containers.length,
  mediaCount: assets.length,
  assetCount: assets.length,
});

export const createAssetFileName = (asset, index) => {
  const base = slugify(asset.alt || asset.fileName || asset.sourceLabel || `${asset.kind}-${index + 1}`);
  const extension = asset.kind === 'audio' ? 'mp3' : asset.kind === 'video' ? 'mp4' : asset.kind === 'svg' ? 'svg' : 'png';
  return `${base}.${extension}`;
};
