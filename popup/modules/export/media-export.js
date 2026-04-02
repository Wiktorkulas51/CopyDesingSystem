import { createAssetFileName } from '../analyzer/media.js';

const fetchBlob = async (asset) => {
  if (asset.inlineMarkup) {
    return new Blob([asset.inlineMarkup], { type: 'image/svg+xml;charset=utf-8' });
  }

  const response = await fetch(asset.source);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${asset.source}`);
  }
  return await response.blob();
};

const getArchiveName = (title) => `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'assets'}.zip`;

export const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadSingleAsset = async (asset, index = 0) => {
  const blob = await fetchBlob(asset);
  downloadBlob(blob, createAssetFileName(asset, index));
};

export const exportAssetsAsZip = async (assets, archiveTitle = 'antigravity-assets') => {
  if (!window.JSZip) {
    throw new Error('JSZip is not available.');
  }

  const zip = new window.JSZip();
  const root = zip.folder('antigravity-assets');

  for (let index = 0; index < assets.length; index += 1) {
    const asset = assets[index];
    const blob = await fetchBlob(asset);
    const fileName = createAssetFileName(asset, index);
    root.file(fileName, blob);
  }

  const zipped = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipped, getArchiveName(archiveTitle));
};
