/**
 * Design Token Analyzer
 * This function runs in the context of the active tab.
 */
export const analyzeDesignSystem = () => {
  const normalizeColor = (val) => {
    if (!val || val === 'transparent' || val.includes('rgba(0,0,0,0)')) return null;
    if (val.startsWith('#')) return val.toUpperCase();
    const match = val.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    if (!match) return null;
    const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
    const a = match[4] ? parseFloat(match[4]) : 1;
    if (a < 0.1) return null;
    return `#${[r,g,b].map(x => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  };

  const colorData = {}; 
  const radiusData = {};
  const fontData = {};
  const sizeData = {};
  const spacingData = {};
  const effectsData = {};
  const strokeData = {};
  const containerData = {};
  const varMap = { colors: {}, radii: {}, fonts: {}, weights: {}, sizes: {}, spacing: {}, effects: {}, strokes: {}, containers: {} };

  // 1. Map CSS Variables from :root
  const rootStyle = window.getComputedStyle(document.documentElement);
  for (let i = 0; i < rootStyle.length; i++) {
    const prop = rootStyle[i];
    if (prop.startsWith('--')) {
      const val = rootStyle.getPropertyValue(prop).trim();
      const hex = normalizeColor(val);
      if (hex) {
        if (!varMap.colors[hex]) varMap.colors[hex] = [];
        if (/color|bg|fg|text|link|brand|accent|primary|border/i.test(prop)) varMap.colors[hex].push(prop);
      } else if (/radius|rounded/i.test(prop)) {
        if (!varMap.radii[val]) varMap.radii[val] = [];
        varMap.radii[val].push(prop);
      } else if (/font|family|title|menu|heading/i.test(prop)) {
        const cleanVal = val.split(',')[0].replace(/['"]/g, '').trim();
        if (!varMap.fonts[cleanVal]) varMap.fonts[cleanVal] = [];
        varMap.fonts[cleanVal].push(prop);
      } else if (/weight|fw|bold|medium|regular|black/i.test(prop)) {
        if (!varMap.weights[val]) varMap.weights[val] = [];
        varMap.weights[val].push(prop);
      } else if (/size|fs|text|h1|h2|h3|h4|h5|h6/i.test(prop)) {
        if (!varMap.sizes[val]) varMap.sizes[val] = [];
        varMap.sizes[val].push(prop);
      } else if (/spacing|gap|padding|margin|gutter/i.test(prop)) {
        if (!varMap.spacing[val]) varMap.spacing[val] = [];
        varMap.spacing[val].push(prop);
      } else if (/shadow|glow|glass|blur|gradient|blend/i.test(prop)) {
        if (!varMap.effects[val]) varMap.effects[val] = [];
        varMap.effects[val].push(prop);
      } else if (/stroke|outline/i.test(prop)) {
        if (!varMap.strokes[val]) varMap.strokes[val] = [];
        varMap.strokes[val].push(prop);
      } else if (/container|width|wrapper/i.test(prop)) {
        if (!varMap.containers[val]) varMap.containers[val] = [];
        varMap.containers[val].push(prop);
      }
    }
  }

  const getTopContext = (map, limit = 2) => {
    const noise = /^(m|p|bg|text|flex|grid|w|h|justify|align|items|rounded|font|border|opacity|shadow|relative|absolute|static|fixed|z-|p[xy]-|m[xy]-|top-|bottom-|left-|right-|gap-)/i;
    return Object.entries(map)
      .filter(([name]) => name.length > 2 && !noise.test(name))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name]) => name.toLowerCase());
  };

  const updateContext = (dataObj, el) => {
    if (!dataObj.context) dataObj.context = { tags: {}, classes: {} };
    const tag = el.tagName;
    dataObj.context.tags[tag] = (dataObj.context.tags[tag] || 0) + 1;
    el.classList.forEach(c => {
      dataObj.context.classes[c] = (dataObj.context.classes[c] || 0) + 1;
    });
  };

  // 2. Deep DOM Scan
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.offsetWidth > 0;

    // Colors
    ['backgroundColor', 'color', 'borderColor'].forEach(p => {
      const hex = normalizeColor(style[p]);
      if (hex) {
        if (!colorData[hex]) colorData[hex] = { count: 0, hex, vars: varMap.colors[hex] || [] };
        colorData[hex].count++;
        updateContext(colorData[hex], el);
      }
    });

    // Radii
    const r = style.borderRadius;
    if (r && r !== '0px' && r !== '0%') {
      if (!radiusData[r]) radiusData[r] = { count: 0, value: r, vars: varMap.radii[r] || [] };
      radiusData[r].count++;
      updateContext(radiusData[r], el);
    }

    // Containers (Max Widths)
    const mw = style.maxWidth;
    if (mw && mw !== 'none' && mw !== '100%' && mw !== '0px') {
        const px = parseFloat(mw);
        if (px > 300) { // Ignore small component max-widths
            if (!containerData[mw]) containerData[mw] = { count: 0, value: mw, vars: varMap.containers?.[mw] || [], isLayout: false };
            containerData[mw].count++;
            
            // Heuristic: identify if this looks like a page-level container
            const isLayoutContext = /container|inner|wrapper|layout|grid|section|page/i.test(el.className + el.id);
            if (isLayoutContext || px > 1000) containerData[mw].isLayout = true;

            updateContext(containerData[mw], el);
        }
    }

    // Spacing (Padding, Margin, Gap)
    const spacingProps = ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'columnGap', 'rowGap'];
    spacingProps.forEach(p => {
      const val = style[p];
      if (val && val !== '0px' && val !== '0' && val !== 'auto' && val !== 'normal' && (val.endsWith('px') || val.endsWith('rem') || val.endsWith('em'))) {
        if (!spacingData[val]) spacingData[val] = { count: 0, value: val, vars: varMap.spacing[val] || [] };
        spacingData[val].count++;
        updateContext(spacingData[val], el);
      }
    });

    // Effects
    const effectProps = ['boxShadow', 'textShadow', 'backdropFilter', 'filter', 'mixBlendMode', 'backgroundImage'];
    effectProps.forEach(p => {
      let val = style[p];
      if (!val || val === 'none' || val === 'normal' || val.includes('rgba(0, 0, 0, 0)')) return;
      
      // Handle Gradients specifically
      if (p === 'backgroundImage') {
        const gradMatch = val.match(/(linear|radial|conic)-gradient\(.+?\)/);
        if (!gradMatch) return;
        val = gradMatch[0];
      }

      if (!effectsData[val]) effectsData[val] = { count: 0, value: val, type: p, vars: varMap.effects[val] || [] };
      effectsData[val].count++;
      updateContext(effectsData[val], el);
    });

    // Strokes & Outlines
    const strokeProps = ['stroke', 'strokeWidth', 'webkitTextStrokeWidth', 'webkitTextStrokeColor'];
    strokeProps.forEach(p => {
      let val = style[p];
      if (!val || val === 'none' || val === '0px' || val === '0' || val.includes('rgba(0, 0, 0, 0)')) return;
      
      const isSvgAttr = p === 'stroke' || p === 'strokeWidth';
      const isTextAttr = p.includes('webkitTextStroke');
      
      // VALIDATION: Only capture if context is correct to avoid noise on DIVs
      if (isSvgAttr && !el.closest('svg')) return;
      
      if (isTextAttr) {
        const textTags = ['SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'LI', 'LABEL'];
        if (!textTags.includes(el.tagName)) return;
        const widthVal = parseFloat(style.webkitTextStrokeWidth);
        if (isNaN(widthVal) || widthVal <= 0) return;
      }

      // Normalize colors for strokes
      if (p.includes('Color') || p === 'stroke') {
        const hex = normalizeColor(val);
        if (hex) val = hex;
      }

      const category = p.includes('Width') ? 'stroke-width' : 'stroke-color';
      const key = `${category}:${val}`;

      if (!strokeData[key]) strokeData[key] = { count: 0, value: val, type: category, vars: varMap.strokes?.[val] || [] };
      strokeData[key].count++;
      updateContext(strokeData[key], el);
    });

    // Typography
    const f = style.fontFamily;
    const w = style.fontWeight;
    const s = style.fontSize;
    const cleanF = f.split(',')[0].replace(/['"]/g, '').trim();
    
    // VISIBILITY & CONTENT CHECK
    const hasText = el.innerText && el.innerText.trim().length > 0;

    if (isVisible && hasText) {
      // DEDUPLICATION
      const firstChild = el.firstElementChild;
      if (firstChild) {
        const childStyle = window.getComputedStyle(firstChild);
        if (childStyle.fontSize === s) return;
      }

      if (f && f !== 'inherit' && f !== '') {
        if (!fontData[cleanF]) fontData[cleanF] = { count: 0, family: f, vars: varMap.fonts[cleanF] || [], weightsMap: {} };
        fontData[cleanF].count++;
        if (!fontData[cleanF].weightsMap[w]) fontData[cleanF].weightsMap[w] = 0;
        fontData[cleanF].weightsMap[w]++;
        updateContext(fontData[cleanF], el);
      }

      if (s) {
        if (!sizeData[s]) sizeData[s] = { count: 0, value: s, vars: varMap.sizes[s] || [] };
        sizeData[s].count++;
        updateContext(sizeData[s], el);
      }
    }
  });

  // 3. Post-process and Filter
  const processEntry = (d) => {
    const topTags = Object.entries(d.context?.tags || {}).sort((a,b) => b[1] - a[1]).slice(0, 2).map(([t]) => t);
    const topClasses = getTopContext(d.context?.classes || {}, 2);
    const tagPart = topTags.join(', ');
    const classPart = topClasses.length ? ` (.${topClasses.join(', .')})` : "";
    d.usageContext = `${tagPart}${classPart}`;
    delete d.context;
    return d;
  };

  const threshold = 3;
  const palette = Object.values(colorData).filter(d => d.count >= threshold || d.vars.length > 0).map(processEntry).sort((a,b) => b.count - a.count);
  const radii = Object.values(radiusData).filter(d => d.count >= threshold || d.vars.length > 0).map(processEntry).sort((a,b) => b.count - a.count);
  const spacing = Object.values(spacingData).filter(d => d.count >= 8 || d.vars.length > 0).map(processEntry).sort((a,b) => parseFloat(b.value) - parseFloat(a.value));
  const effects = Object.values(effectsData).filter(d => d.count >= 2 || d.vars.length > 0).map(processEntry).sort((a,b) => b.count - a.count);
  const strokes = Object.values(strokeData).filter(d => d.count >= 2 || d.vars.length > 0).map(processEntry).sort((a,b) => b.count - a.count);
  const containers = Object.values(containerData)
    .filter(d => d.count >= 1 || d.vars.length > 0)
    .map(d => {
        d.category = d.isLayout ? "Layout Grid" : "Component Box";
        return processEntry(d);
    })
    .sort((a,b) => (b.isLayout ? 1 : 0) - (a.isLayout ? 1 : 0) || b.count - a.count);
  
  const fonts = Object.values(fontData).filter(d => d.count >= 20 || d.vars.length > 0).map(f => {
    const weights = Object.keys(f.weightsMap).map(val => ({
      val,
      count: f.weightsMap[val],
      vars: varMap.weights[val] || []
    })).sort((a,b) => parseInt(a.val) - parseInt(b.val));
    return processEntry({ ...f, weights });
  }).sort((a,b) => b.count - a.count);

  const allSizes = Object.values(sizeData).filter(d => d.count >= 10 || d.vars.length > 0).map(processEntry).sort((a,b) => parseFloat(b.value) - parseFloat(a.value));
  
  // 4. Split Scale into Headings and Body
  const headings = allSizes.filter(s => {
    const px = parseFloat(s.value);
    const hasHeadingToken = s.vars.some(v => /h1|h2|h3|h4|h5|h6|title|heading/i.test(v));
    return px >= 22 || hasHeadingToken;
  });

  const body = allSizes.filter(s => {
    const px = parseFloat(s.value);
    const isHeadingToken = s.vars.some(v => /h1|h2|h3|h4|h5|h6|title|heading/i.test(v));
    return px < 22 && !isHeadingToken;
  });

  return { palette, radii, fonts, headings, body, spacing, effects, strokes, containers };
};

