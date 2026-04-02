export const ANALYZER_THRESHOLDS = {
  palette: 3,
  radii: 3,
  spacing: 8,
  effects: 2,
  strokes: 2,
  fonts: 20,
  sizes: 10,
  containerMinWidth: 300,
  headingSize: 22,
  layoutContainerWidth: 1000,
};

export const VARIABLE_BUCKETS = [
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

export const SPACING_PROPS = [
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'columnGap',
  'rowGap',
];

export const EFFECT_PROPS = [
  'boxShadow',
  'textShadow',
  'backdropFilter',
  'filter',
  'mixBlendMode',
  'backgroundImage',
];

export const STROKE_PROPS = [
  'stroke',
  'strokeWidth',
  'webkitTextStrokeWidth',
  'webkitTextStrokeColor',
];

export const TEXT_TAGS = ['SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'LI', 'LABEL'];
