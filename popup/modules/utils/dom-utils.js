const CONTEXT_NOISE_PATTERN =
  /^(m|p|bg|text|flex|grid|w|h|justify|align|items|rounded|font|border|opacity|shadow|relative|absolute|static|fixed|z-|p[xy]-|m[xy]-|top-|bottom-|left-|right-|gap-)/i;

export const isElementVisible = (element, style) =>
  style.display !== 'none' &&
  style.visibility !== 'hidden' &&
  style.opacity !== '0' &&
  element.offsetWidth > 0;

export const updateContext = (entry, element) => {
  if (!entry.context) {
    entry.context = { tags: {}, classes: {} };
  }

  const tagName = element.tagName;
  entry.context.tags[tagName] = (entry.context.tags[tagName] || 0) + 1;

  element.classList.forEach((className) => {
    entry.context.classes[className] =
      (entry.context.classes[className] || 0) + 1;
  });
};

export const getTopContext = (map, limit = 2) =>
  Object.entries(map)
    .filter(([name]) => name.length > 2 && !CONTEXT_NOISE_PATTERN.test(name))
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([name]) => name.toLowerCase());

export const createUsageContext = (entry) => {
  const topTags = Object.entries(entry.context?.tags || {})
    .sort((left, right) => right[1] - left[1])
    .slice(0, 2)
    .map(([tag]) => tag);
  const topClasses = getTopContext(entry.context?.classes || {}, 2);
  const tagPart = topTags.join(', ');
  const classPart = topClasses.length ? ` (.${topClasses.join(', .')})` : '';

  return `${tagPart}${classPart}`;
};
