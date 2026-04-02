import { normalizeColor } from '../utils/color-utils.js';
import { createUsageContext } from '../utils/dom-utils.js';
import { ANALYZER_THRESHOLDS, VARIABLE_BUCKETS } from './config.js';

export const cleanFontFamily = (value) =>
  value.split(',')[0].replace(/['"]/g, '').trim();

export const createEmptyVarMap = () =>
  VARIABLE_BUCKETS.reduce((map, bucket) => {
    map[bucket.key] = {};
    return map;
  }, {});

export const createStores = () => ({
  colorData: {},
  radiusData: {},
  fontData: {},
  sizeData: {},
  spacingData: {},
  effectsData: {},
  strokeData: {},
  containerData: {},
});

export const getBucketValue = (bucketKey, rawValue) => {
  if (bucketKey === 'colors') {
    return normalizeColor(rawValue);
  }

  if (bucketKey === 'fonts') {
    return cleanFontFamily(rawValue);
  }

  return rawValue;
};

export const registerVariable = (varMap, prop, value) => {
  VARIABLE_BUCKETS.forEach(({ key, pattern }) => {
    if (!pattern.test(prop)) {
      return;
    }

    const bucketValue = getBucketValue(key, value);
    if (!bucketValue) {
      return;
    }

    if (!varMap[key][bucketValue]) {
      varMap[key][bucketValue] = [];
    }

    varMap[key][bucketValue].push(prop);
  });
};

export const buildVariableMap = () => {
  const varMap = createEmptyVarMap();
  const rootStyle = window.getComputedStyle(document.documentElement);

  for (let index = 0; index < rootStyle.length; index += 1) {
    const prop = rootStyle[index];
    if (!prop.startsWith('--')) {
      continue;
    }

    const value = rootStyle.getPropertyValue(prop).trim();
    registerVariable(varMap, prop, value);
  }

  return varMap;
};

export const getOrCreate = (store, key, factory) => {
  if (!store[key]) {
    store[key] = factory();
  }

  return store[key];
};

export const record = (store, key, factory, element) => {
  const entry = getOrCreate(store, key, factory);
  entry.count += 1;
  return entry;
};

export const finalizeEntry = (entry) => {
  const { context, ...rest } = entry;
  return {
    ...rest,
    usageContext: createUsageContext(entry),
  };
};

export const toSortedEntries = (store, threshold, sorter, predicate = () => true) =>
  Object.values(store)
    .filter((entry) => (entry.count >= threshold || entry.vars.length > 0) && predicate(entry))
    .map(finalizeEntry)
    .sort(sorter);

export const buildTypographyEntries = (stores, varMap) =>
  Object.values(stores.fontData)
    .filter((entry) => entry.count >= ANALYZER_THRESHOLDS.fonts || entry.vars.length > 0)
    .map((entry) => {
      const weights = Object.keys(entry.weightsMap)
        .map((value) => ({
          val: value,
          count: entry.weightsMap[value],
          vars: varMap.weights[value] || [],
        }))
        .sort((left, right) => parseInt(left.val, 10) - parseInt(right.val, 10));

      return finalizeEntry({
        ...entry,
        weights,
      });
    })
    .sort((left, right) => right.count - left.count);

export const splitSizes = (sizes) => {
  const headings = sizes.filter((size) => {
    const pixelValue = parseFloat(size.value);
    const hasHeadingToken = size.vars.some((token) =>
      /h1|h2|h3|h4|h5|h6|title|heading/i.test(token)
    );
    return pixelValue >= ANALYZER_THRESHOLDS.headingSize || hasHeadingToken;
  });

  const body = sizes.filter((size) => {
    const pixelValue = parseFloat(size.value);
    const isHeadingToken = size.vars.some((token) =>
      /h1|h2|h3|h4|h5|h6|title|heading/i.test(token)
    );
    return pixelValue < ANALYZER_THRESHOLDS.headingSize && !isHeadingToken;
  });

  return { headings, body };
};
