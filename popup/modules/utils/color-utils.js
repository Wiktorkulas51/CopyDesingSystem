export const normalizeColor = (value) => {
  if (!value || value === 'transparent' || value.includes('rgba(0,0,0,0)')) {
    return null;
  }

  if (value.startsWith('#')) {
    return value.toUpperCase();
  }

  const match = value.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
  );

  if (!match) {
    return null;
  }

  const red = parseInt(match[1], 10);
  const green = parseInt(match[2], 10);
  const blue = parseInt(match[3], 10);
  const alpha = match[4] ? parseFloat(match[4]) : 1;

  if (alpha < 0.1) {
    return null;
  }

  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();
};
