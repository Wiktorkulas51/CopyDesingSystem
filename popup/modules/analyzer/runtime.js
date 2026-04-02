export const analyzeDesignSystemRuntime = () => {
  const thresholds = { palette: 3, radii: 3, spacing: 8, effects: 2, strokes: 2, fonts: 20, sizes: 10, containerMinWidth: 300, headingSize: 22, layoutContainerWidth: 1000 };
  const spacingProps = ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'columnGap', 'rowGap'];
  const effectProps = ['boxShadow', 'textShadow', 'backdropFilter', 'filter', 'mixBlendMode', 'backgroundImage'];
  const strokeProps = ['stroke', 'strokeWidth', 'webkitTextStrokeWidth', 'webkitTextStrokeColor'];
  const textTags = ['SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'LI', 'LABEL'];
  const mediaData = {};
  const variableBuckets = [
    { key: 'colors', pattern: /color|bg|fg|text|link|brand|accent|primary|border/i },
    { key: 'radii', pattern: /radius|rounded/i },
    { key: 'fonts', pattern: /font|family|title|menu|heading/i },
    { key: 'weights', pattern: /weight|fw|bold|medium|regular|black/i },
    { key: 'sizes', pattern: /size|fs|text|h1|h2|h3|h4|h5|h6/i },
    { key: 'spacing', pattern: /spacing|gap|padding|margin|gutter/i },
    { key: 'effects', pattern: /shadow|glow|glass|blur|gradient|blend/i },
    { key: 'strokes', pattern: /stroke|outline/i },
    { key: 'containers', pattern: /container|width|wrapper/i },
  ];

  const normalizeColor = (value) => {
    if (!value || value === 'transparent' || value.includes('rgba(0,0,0,0)')) return null;
    if (value.startsWith('#')) return value.toUpperCase();
    const match = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    if (!match) return null;
    const alpha = match[4] ? parseFloat(match[4]) : 1;
    if (alpha < 0.1) return null;
    return `#${[match[1], match[2], match[3]].map((channel) => parseInt(channel, 10).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  };

  const cleanFontFamily = (value) => value.split(',')[0].replace(/['"]/g, '').trim();
  const isVisible = (element, style) => style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && element.offsetWidth > 0;
  const getTopContext = (map, limit = 2) => Object.entries(map).filter(([name]) => name.length > 2 && !/^(m|p|bg|text|flex|grid|w|h|justify|align|items|rounded|font|border|opacity|shadow|relative|absolute|static|fixed|z-|p[xy]-|m[xy]-|top-|bottom-|left-|right-|gap-)/i.test(name)).sort((left, right) => right[1] - left[1]).slice(0, limit).map(([name]) => name.toLowerCase());

  const updateContext = (entry, element) => {
    if (!entry.context) entry.context = { tags: {}, classes: {} };
    entry.context.tags[element.tagName] = (entry.context.tags[element.tagName] || 0) + 1;
    element.classList.forEach((className) => { entry.context.classes[className] = (entry.context.classes[className] || 0) + 1; });
  };

  const createUsageContext = (entry) => {
    const topTags = Object.entries(entry.context?.tags || {}).sort((left, right) => right[1] - left[1]).slice(0, 2).map(([tag]) => tag);
    const topClasses = getTopContext(entry.context?.classes || {}, 2);
    return `${topTags.join(', ')}${topClasses.length ? ` (.${topClasses.join(', .')})` : ''}`;
  };

  const createEmptyVarMap = () => variableBuckets.reduce((map, bucket) => ((map[bucket.key] = {}), map), {});
  const getBucketValue = (bucketKey, rawValue) => (bucketKey === 'colors' ? normalizeColor(rawValue) : bucketKey === 'fonts' ? cleanFontFamily(rawValue) : rawValue);
  const registerVariable = (varMap, prop, value) => {
    variableBuckets.forEach(({ key, pattern }) => {
      if (!pattern.test(prop)) return;
      const bucketValue = getBucketValue(key, value);
      if (!bucketValue) return;
      if (!varMap[key][bucketValue]) varMap[key][bucketValue] = [];
      varMap[key][bucketValue].push(prop);
    });
  };
  const buildVariableMap = () => {
    const varMap = createEmptyVarMap();
    const rootStyle = window.getComputedStyle(document.documentElement);
    for (let index = 0; index < rootStyle.length; index += 1) {
      const prop = rootStyle[index];
      if (!prop.startsWith('--')) continue;
      registerVariable(varMap, prop, rootStyle.getPropertyValue(prop).trim());
    }
    return varMap;
  };

  const createStores = () => ({ colorData: {}, radiusData: {}, fontData: {}, sizeData: {}, spacingData: {}, effectsData: {}, strokeData: {}, containerData: {} });
  const record = (store, key, factory) => ((store[key] ||= factory()).count += 1, store[key]);
  const finalizeEntry = (entry) => ({ ...entry, usageContext: createUsageContext(entry) });
  const toSortedEntries = (store, threshold, sorter, predicate = () => true) =>
    Object.values(store).filter((entry) => (entry.count >= threshold || entry.vars.length > 0) && predicate(entry)).map(finalizeEntry).sort(sorter);
  const buildTypographyEntries = (stores, varMap) =>
    Object.values(stores.fontData)
      .filter((entry) => entry.count >= thresholds.fonts || entry.vars.length > 0)
      .map((entry) => {
        const weights = Object.keys(entry.weightsMap).map((value) => ({ val: value, count: entry.weightsMap[value], vars: varMap.weights[value] || [] })).sort((left, right) => parseInt(left.val, 10) - parseInt(right.val, 10));
        return finalizeEntry({ ...entry, weights });
      })
      .sort((left, right) => right.count - left.count);
  const splitSizes = (sizes) => {
    const headings = sizes.filter((size) => {
      const pixelValue = parseFloat(size.value);
      const hasHeadingToken = size.vars.some((token) => /h1|h2|h3|h4|h5|h6|title|heading/i.test(token));
      return pixelValue >= thresholds.headingSize || hasHeadingToken;
    });
    const body = sizes.filter((size) => {
      const pixelValue = parseFloat(size.value);
      const isHeadingToken = size.vars.some((token) => /h1|h2|h3|h4|h5|h6|title|heading/i.test(token));
      return pixelValue < thresholds.headingSize && !isHeadingToken;
    });
    return { headings, body };
  };

  const makeMediaKey = (kind, source, extra = '') => `${kind}|${source || extra}`;
  const normalizeUrl = (rawUrl) => {
    if (!rawUrl) return '';
    try { return new URL(rawUrl, document.baseURI).href; } catch { return rawUrl; }
  };
  const isSvgSource = (source) => /\.svg(\?|$)/i.test(source || '') || /^data:image\/svg\+xml/i.test(source || '');
  const describeElement = (element) => {
    if (!element) return '';
    const idPart = element.id ? `#${element.id}` : '';
    const classPart = element.className
      ? `.${String(element.className).split(/\s+/).filter(Boolean).slice(0, 2).join('.')}`
      : '';
    return `${element.tagName}${idPart}${classPart}`;
  };
  const getContextTrail = (element, maxDepth = 3) => {
    const trail = [];
    let current = element;
    while (current && trail.length < maxDepth) {
      const label = describeElement(current);
      if (label) trail.push(label);
      current = current.parentElement;
    }
    return trail.join(' > ');
  };
  const getContextLabel = (element) => {
    const contextEl = element.closest('[id], [class]');
    if (!contextEl) return '';
    const idPart = contextEl.id ? `#${contextEl.id}` : '';
    const classPart = contextEl.className ? `.${String(contextEl.className).split(/\s+/).filter(Boolean).slice(0, 2).join('.')}` : '';
    return `${contextEl.tagName}${idPart}${classPart}`;
  };
  const buildMediaRecord = (element, kind, source, extra = {}) => {
    const normalizedSource = normalizeUrl(source);
    const key = makeMediaKey(kind, normalizedSource, extra.inlineMarkup || '');
    if (!mediaData[key]) {
      const fileName = extra.fileName || (normalizedSource ? (normalizedSource.split('/').pop() || `${kind}.bin`).split('?')[0] : `${kind}.svg`);
      mediaData[key] = { id: key, kind, source: normalizedSource, fileName, count: 0, context: '', ...extra };
    }
    const entry = mediaData[key];
    entry.count += 1;
    if (!entry.context) entry.context = getContextLabel(element);
    return entry;
  };
  const scanMediaElement = (element) => {
    const tag = element.tagName;
    if (tag === 'IMG') {
      const src = element.currentSrc || element.src || element.getAttribute('src');
      if (src) {
        const kind = isSvgSource(src) ? 'svg' : 'image';
        buildMediaRecord(element, kind, src, { alt: element.alt || '', previewUrl: normalizeUrl(src), width: element.naturalWidth || element.width || 0, height: element.naturalHeight || element.height || 0, contextPath: getContextTrail(element, 4) });
      }
    }
    if (tag === 'VIDEO') {
      const src = element.currentSrc || element.src || element.getAttribute('src') || element.querySelector('source')?.src || element.querySelector('source')?.getAttribute('src');
      if (src) buildMediaRecord(element, 'video', src, { previewUrl: normalizeUrl(src), width: element.videoWidth || element.width || 0, height: element.videoHeight || element.height || 0, contextPath: getContextTrail(element, 4) });
    }
    if (tag === 'AUDIO') {
      const src = element.currentSrc || element.src || element.getAttribute('src') || element.querySelector('source')?.src || element.querySelector('source')?.getAttribute('src');
      if (src) buildMediaRecord(element, 'audio', src, { previewUrl: normalizeUrl(src), contextPath: getContextTrail(element, 4) });
    }
    if (tag === 'SOURCE') {
      const parentTag = element.parentElement?.tagName || '';
      const src = element.src || element.getAttribute('src');
      if (src && ['VIDEO', 'AUDIO', 'PICTURE'].includes(parentTag)) {
        const kind = parentTag === 'VIDEO' ? 'video' : parentTag === 'AUDIO' ? 'audio' : isSvgSource(src) ? 'svg' : 'image';
        buildMediaRecord(element, kind, src, { previewUrl: normalizeUrl(src), contextPath: getContextTrail(element, 4) });
      }
    }
    if (tag === 'SVG') {
      buildMediaRecord(element, 'svg', '', { inlineMarkup: element.outerHTML, previewUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(element.outerHTML)}`, contextPath: getContextTrail(element, 4) });
    }

    const backgroundImage = window.getComputedStyle(element).backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
      const urls = [...backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)].map((match) => match[1]).filter(Boolean);
      urls.forEach((url) => buildMediaRecord(element, isSvgSource(url) ? 'svg' : 'background', url, { previewUrl: normalizeUrl(url), contextPath: getContextTrail(element, 4) }));
    }
  };

  const varMap = buildVariableMap();
  const stores = createStores();

  document.querySelectorAll('*').forEach((element) => {
    const style = window.getComputedStyle(element);

    ['backgroundColor', 'color', 'borderColor'].forEach((property) => {
      const hex = normalizeColor(style[property]);
      if (!hex) return;
      const entry = record(stores.colorData, hex, () => ({ count: 0, hex, vars: varMap.colors[hex] || [] }));
      updateContext(entry, element);
    });

    const radius = style.borderRadius;
    if (radius && radius !== '0px' && radius !== '0%') {
      const entry = record(stores.radiusData, radius, () => ({ count: 0, value: radius, vars: varMap.radii[radius] || [] }));
      updateContext(entry, element);
    }

    const maxWidth = style.maxWidth;
    if (maxWidth && maxWidth !== 'none' && maxWidth !== '100%' && maxWidth !== '0px') {
      const widthValue = parseFloat(maxWidth);
      if (widthValue > thresholds.containerMinWidth) {
        const entry = record(stores.containerData, maxWidth, () => ({ count: 0, value: maxWidth, vars: varMap.containers[maxWidth] || [], isLayout: false }));
        updateContext(entry, element);
        const isLayoutContext = /container|inner|wrapper|layout|grid|section|page/i.test(`${element.className} ${element.id}`);
        if (isLayoutContext || widthValue > thresholds.layoutContainerWidth) stores.containerData[maxWidth].isLayout = true;
      }
    }

    spacingProps.forEach((property) => {
      const value = style[property];
      if (!value || value === '0px' || value === '0' || value === 'auto' || value === 'normal' || (!value.endsWith('px') && !value.endsWith('rem') && !value.endsWith('em'))) return;
      const entry = record(stores.spacingData, value, () => ({ count: 0, value, vars: varMap.spacing[value] || [] }));
      updateContext(entry, element);
    });

    effectProps.forEach((property) => {
      let value = style[property];
      if (!value || value === 'none' || value === 'normal' || value.includes('rgba(0, 0, 0, 0)')) return;
      if (property === 'backgroundImage') {
        const gradientMatch = value.match(/(linear|radial|conic)-gradient\(.+?\)/);
        if (!gradientMatch) return;
        value = gradientMatch[0];
      }
      const entry = record(stores.effectsData, value, () => ({ count: 0, value, type: property, vars: varMap.effects[value] || [] }));
      updateContext(entry, element);
    });

    strokeProps.forEach((property) => {
      let value = style[property];
      if (!value || value === 'none' || value === '0px' || value === '0' || value.includes('rgba(0, 0, 0, 0)')) return;
      const isSvgProperty = property === 'stroke' || property === 'strokeWidth';
      const isTextProperty = property.includes('webkitTextStroke');
      if (isSvgProperty && !element.closest('svg')) return;
      if (isTextProperty) {
        if (!textTags.includes(element.tagName)) return;
        const widthValue = parseFloat(style.webkitTextStrokeWidth);
        if (Number.isNaN(widthValue) || widthValue <= 0) return;
      }
      if (property.includes('Color') || property === 'stroke') {
        const hex = normalizeColor(value);
        if (hex) value = hex;
      }
      const type = property.includes('Width') ? 'stroke-width' : 'stroke-color';
      const key = `${type}:${value}`;
      const entry = record(stores.strokeData, key, () => ({ count: 0, value, type, vars: varMap.strokes[value] || [] }));
      updateContext(entry, element);
    });

    scanMediaElement(element);

    const fontFamily = style.fontFamily;
    const fontWeight = style.fontWeight;
    const fontSize = style.fontSize;
    const hasText = element.innerText && element.innerText.trim().length > 0;
    if (!hasText || !isVisible(element, style)) return;

    const firstChild = element.firstElementChild;
    if (firstChild) {
      const childStyle = window.getComputedStyle(firstChild);
      if (childStyle.fontSize === fontSize) return;
    }

    if (fontFamily && fontFamily !== 'inherit' && fontFamily !== '') {
      const cleanFamily = cleanFontFamily(fontFamily);
      const entry = record(stores.fontData, cleanFamily, () => ({ count: 0, family: fontFamily, vars: varMap.fonts[cleanFamily] || [], weightsMap: {} }));
      updateContext(entry, element);
      entry.weightsMap[fontWeight] = (entry.weightsMap[fontWeight] || 0) + 1;
    }

    if (fontSize) {
      const entry = record(stores.sizeData, fontSize, () => ({ count: 0, value: fontSize, vars: varMap.sizes[fontSize] || [] }));
      updateContext(entry, element);
    }
  });

  const palette = toSortedEntries(stores.colorData, thresholds.palette, (left, right) => right.count - left.count);
  const radii = toSortedEntries(stores.radiusData, thresholds.radii, (left, right) => right.count - left.count);
  const spacing = toSortedEntries(stores.spacingData, thresholds.spacing, (left, right) => parseFloat(right.value) - parseFloat(left.value));
  const effects = toSortedEntries(stores.effectsData, thresholds.effects, (left, right) => right.count - left.count);
  const strokes = toSortedEntries(stores.strokeData, thresholds.strokes, (left, right) => right.count - left.count);
  const containers = toSortedEntries(stores.containerData, 1, (left, right) => (right.isLayout ? 1 : 0) - (left.isLayout ? 1 : 0) || right.count - left.count).map((entry) => ({ ...entry, category: entry.isLayout ? 'Layout Grid' : 'Component Box' }));
  const fonts = buildTypographyEntries(stores, varMap);
  const allSizes = toSortedEntries(stores.sizeData, thresholds.sizes, (left, right) => parseFloat(right.value) - parseFloat(left.value));
  const { headings, body } = splitSizes(allSizes);
  const media = Object.values(mediaData).sort((left, right) => right.count - left.count);

  return { palette, radii, fonts, headings, body, spacing, effects, strokes, containers, media };
};
