/**
 * Design Token Analyzer
 * This function runs in the context of the active tab.
 */
import { scanDocument } from './analyzer/scan.js';
import { buildVariableMap, buildTypographyEntries, splitSizes, toSortedEntries } from './analyzer/helpers.js';
import { ANALYZER_THRESHOLDS } from './analyzer/config.js';

export const analyzeDesignSystem = () => {
  const varMap = buildVariableMap();
  const stores = scanDocument(varMap);

  const palette = toSortedEntries(
    stores.colorData,
    ANALYZER_THRESHOLDS.palette,
    (left, right) => right.count - left.count
  );
  const radii = toSortedEntries(
    stores.radiusData,
    ANALYZER_THRESHOLDS.radii,
    (left, right) => right.count - left.count
  );
  const spacing = toSortedEntries(
    stores.spacingData,
    ANALYZER_THRESHOLDS.spacing,
    (left, right) => parseFloat(right.value) - parseFloat(left.value)
  );
  const effects = toSortedEntries(
    stores.effectsData,
    ANALYZER_THRESHOLDS.effects,
    (left, right) => right.count - left.count
  );
  const strokes = toSortedEntries(
    stores.strokeData,
    ANALYZER_THRESHOLDS.strokes,
    (left, right) => right.count - left.count
  );
  const containers = toSortedEntries(
    stores.containerData,
    1,
    (left, right) =>
      (right.isLayout ? 1 : 0) - (left.isLayout ? 1 : 0) || right.count - left.count
  ).map((entry) => ({
    ...entry,
    category: entry.isLayout ? 'Layout Grid' : 'Component Box',
  }));

  const fonts = buildTypographyEntries(stores, varMap);
  const allSizes = toSortedEntries(
    stores.sizeData,
    ANALYZER_THRESHOLDS.sizes,
    (left, right) => parseFloat(right.value) - parseFloat(left.value)
  );
  const { headings, body } = splitSizes(allSizes);

  return { palette, radii, fonts, headings, body, spacing, effects, strokes, containers };
};
