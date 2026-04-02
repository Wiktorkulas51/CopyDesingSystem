/**
 * Antigravity Smart Color Analyzer
 * Categorizes colors into semantic roles (Accent, Background, Text, UI)
 */

function analyzePalette() {
  const elements = document.querySelectorAll('*');
  const colorData = {}; // { hex: { count: 0, props: Set(), isBg: 0, isText: 0 } }

  const rgbToHex = (rgb) => {
    if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return null;
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    if (!match) return null;
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] ? parseFloat(match[4]) : 1;
    if (a < 0.1) return null;
    const components = [r, g, b].map(x => x.toString(16).padStart(2, '0'));
    return `#${components.join('')}`.toUpperCase();
  };

  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    const props = {
      backgroundColor: 'bg',
      color: 'text',
      borderColor: 'border'
    };

    Object.entries(props).forEach(([prop, type]) => {
      const hex = rgbToHex(style[prop]);
      if (!hex) return;

      if (!colorData[hex]) {
        colorData[hex] = { count: 0, bgCount: 0, textCount: 0, borderCount: 0, hex };
      }
      colorData[hex].count++;
      if (type === 'bg') colorData[hex].bgCount++;
      if (type === 'text') colorData[hex].textCount++;
      if (type === 'border') colorData[hex].borderCount++;
    });
  });

  // Calculate Total Usage for Thresholding
  const totalSamples = Object.values(colorData).reduce((sum, d) => sum + d.count, 0);
  const threshold = Math.max(5, totalSamples * 0.005); // Min 5 uses or 0.5%

  const categories = {
    Accents: [],
    Backgrounds: [],
    Typography: [],
    UI: []
  };

  Object.values(colorData)
    .filter(d => d.count >= threshold)
    .forEach(d => {
      const hsl = hexToHsl(d.hex);
      
      // Heuristic Categorization
      if (hsl.s > 40 && hsl.l < 90 && hsl.l > 10) {
        categories.Accents.push(d);
      } else if (d.bgCount > d.textCount && d.bgCount > d.borderCount) {
        categories.Backgrounds.push(d);
      } else if (d.textCount > d.bgCount) {
        categories.Typography.push(d);
      } else {
        categories.UI.push(d);
      }
    });

  // Sort each category by count descending
  Object.keys(categories).forEach(cat => {
    categories[cat].sort((a, b) => b.count - a.count);
  });

  return categories;
}

analyzePalette();
