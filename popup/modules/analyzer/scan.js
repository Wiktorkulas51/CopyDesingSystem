import { normalizeColor } from '../utils/color-utils.js';
import { isElementVisible, updateContext } from '../utils/dom-utils.js';
import {
  ANALYZER_THRESHOLDS,
  EFFECT_PROPS,
  SPACING_PROPS,
  STROKE_PROPS,
  TEXT_TAGS,
} from './config.js';
import { createStores, record } from './helpers.js';

const cleanFontFamily = (value) =>
  value.split(',')[0].replace(/['"]/g, '').trim();

export const scanDocument = (varMap) => {
  const stores = createStores();

  document.querySelectorAll('*').forEach((element) => {
    const style = window.getComputedStyle(element);

    ['backgroundColor', 'color', 'borderColor'].forEach((property) => {
      const hex = normalizeColor(style[property]);
      if (!hex) {
        return;
      }

      const entry = record(
        stores.colorData,
        hex,
        () => ({ count: 0, hex, vars: varMap.colors[hex] || [] }),
        element
      );
      updateContext(entry, element);
    });

    const radius = style.borderRadius;
    if (radius && radius !== '0px' && radius !== '0%') {
      const entry = record(
        stores.radiusData,
        radius,
        () => ({ count: 0, value: radius, vars: varMap.radii[radius] || [] }),
        element
      );
      updateContext(entry, element);
    }

    const maxWidth = style.maxWidth;
    if (maxWidth && maxWidth !== 'none' && maxWidth !== '100%' && maxWidth !== '0px') {
      const widthValue = parseFloat(maxWidth);
      if (widthValue > ANALYZER_THRESHOLDS.containerMinWidth) {
        const entry = record(
          stores.containerData,
          maxWidth,
          () => ({
            count: 0,
            value: maxWidth,
            vars: varMap.containers[maxWidth] || [],
            isLayout: false,
          }),
          element
        );
        updateContext(entry, element);

        const isLayoutContext =
          /container|inner|wrapper|layout|grid|section|page/i.test(
            `${element.className} ${element.id}`
          );

        if (isLayoutContext || widthValue > ANALYZER_THRESHOLDS.layoutContainerWidth) {
          stores.containerData[maxWidth].isLayout = true;
        }
      }
    }

    SPACING_PROPS.forEach((property) => {
      const value = style[property];
      if (
        !value ||
        value === '0px' ||
        value === '0' ||
        value === 'auto' ||
        value === 'normal' ||
        (!value.endsWith('px') && !value.endsWith('rem') && !value.endsWith('em'))
      ) {
        return;
      }

      const entry = record(
        stores.spacingData,
        value,
        () => ({ count: 0, value, vars: varMap.spacing[value] || [] }),
        element
      );
      updateContext(entry, element);
    });

    EFFECT_PROPS.forEach((property) => {
      let value = style[property];
      if (!value || value === 'none' || value === 'normal' || value.includes('rgba(0, 0, 0, 0)')) {
        return;
      }

      if (property === 'backgroundImage') {
        const gradientMatch = value.match(/(linear|radial|conic)-gradient\(.+?\)/);
        if (!gradientMatch) {
          return;
        }
        value = gradientMatch[0];
      }

      const entry = record(
        stores.effectsData,
        value,
        () => ({ count: 0, value, type: property, vars: varMap.effects[value] || [] }),
        element
      );
      updateContext(entry, element);
    });

    STROKE_PROPS.forEach((property) => {
      let value = style[property];
      if (!value || value === 'none' || value === '0px' || value === '0' || value.includes('rgba(0, 0, 0, 0)')) {
        return;
      }

      const isSvgProperty = property === 'stroke' || property === 'strokeWidth';
      const isTextProperty = property.includes('webkitTextStroke');

      if (isSvgProperty && !element.closest('svg')) {
        return;
      }

      if (isTextProperty) {
        if (!TEXT_TAGS.includes(element.tagName)) {
          return;
        }

        const widthValue = parseFloat(style.webkitTextStrokeWidth);
        if (Number.isNaN(widthValue) || widthValue <= 0) {
          return;
        }
      }

      if (property.includes('Color') || property === 'stroke') {
        const hex = normalizeColor(value);
        if (hex) {
          value = hex;
        }
      }

      const type = property.includes('Width') ? 'stroke-width' : 'stroke-color';
      const key = `${type}:${value}`;
      const entry = record(
        stores.strokeData,
        key,
        () => ({ count: 0, value, type, vars: varMap.strokes[value] || [] }),
        element
      );
      updateContext(entry, element);
    });

    const fontFamily = style.fontFamily;
    const fontWeight = style.fontWeight;
    const fontSize = style.fontSize;
    const hasText = element.innerText && element.innerText.trim().length > 0;

    if (!hasText || !isElementVisible(element, style)) {
      return;
    }

    const firstChild = element.firstElementChild;
    if (firstChild) {
      const childStyle = window.getComputedStyle(firstChild);
      if (childStyle.fontSize === fontSize) {
        return;
      }
    }

    if (fontFamily && fontFamily !== 'inherit' && fontFamily !== '') {
      const cleanFamily = cleanFontFamily(fontFamily);
      const entry = record(
        stores.fontData,
        cleanFamily,
        () => ({
          count: 0,
          family: fontFamily,
          vars: varMap.fonts[cleanFamily] || [],
          weightsMap: {},
        }),
        element
      );
      updateContext(entry, element);
      entry.weightsMap[fontWeight] = (entry.weightsMap[fontWeight] || 0) + 1;
    }

    if (fontSize) {
      const entry = record(
        stores.sizeData,
        fontSize,
        () => ({ count: 0, value: fontSize, vars: varMap.sizes[fontSize] || [] }),
        element
      );
      updateContext(entry, element);
    }
  });

  return stores;
};
