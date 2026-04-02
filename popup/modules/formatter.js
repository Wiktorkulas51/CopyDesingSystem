/**
 * AI Context Formatter
 * Generates a structured Markdown prompt from extracted tokens.
 */

export const generateAiPrompt = (data) => {
  let context = "### GLOBAL DESIGN SYSTEM CONTEXT\n";
  context += "Use these tokens for high-fidelity reconstruction. If you see a screenshot, match the layout using these specific variables and values.\n\n";

  context += "#### 🎨 COLOR PALETTE\n";
  data.palette.forEach(p => {
    const vars = p.vars.length > 0 ? ` (Tokens: ${p.vars.join(', ')})` : "";
    context += `- ${p.hex}: Used ${p.count} times${vars}\n  - Usage: ${p.usageContext}\n`;
  });

  context += "\n#### 📐 BORDER RADII\n";
  data.radii.forEach(r => {
    const vars = r.vars.length > 0 ? ` (Tokens: ${r.vars.join(', ')})` : "";
    context += `- ${r.value}: Used ${r.count} times${vars}\n  - Usage: ${r.usageContext}\n`;
  });

  context += "\n#### 🔡 TYPOGRAPHY\n";
  data.fonts.forEach(f => {
    const vars = f.vars.length > 0 ? ` (Tokens: ${f.vars.join(', ')})` : "";
    const weights = f.weights.map(w => `${w.val}${w.vars.length ? ` [${w.vars.join(', ')}]` : ""}`).join(", ");
    context += `- ${f.family}: Used ${f.count} times${vars}\n  - Weights: ${weights}\n  - Usage: ${f.usageContext}\n`;
  });

  context += "\n#### 📏 FONT SCALE (HEADINGS)\n";
  data.headings.forEach(s => {
    const vars = s.vars.length > 0 ? ` (Tokens: ${s.vars.join(', ')})` : "";
    context += `- ${s.value}: Used ${s.count} times${vars}\n  - Usage: ${s.usageContext}\n`;
  });

  context += "\n#### 📄 FONT SCALE (BODY TEXT)\n";
  data.body.forEach(s => {
    const vars = s.vars.length > 0 ? ` (Tokens: ${s.vars.join(', ')})` : "";
    context += `- ${s.value}: Used ${s.count} times${vars}\n  - Usage: ${s.usageContext}\n`;
  });
  context += "\n#### 📐 SPACING & LAYOUT\n";
  data.spacing.forEach(s => {
    const vars = s.vars.length > 0 ? ` (Tokens: ${s.vars.join(', ')})` : "";
    context += `- ${s.value}: Used ${s.count} times${vars}\n  - Usage: ${s.usageContext}\n`;
  });

  context += "\n#### ⚡ VISUAL EFFECTS\n";

  data.effects.forEach(e => {
    const vars = e.vars.length > 0 ? ` (Tokens: ${e.vars.join(', ')})` : "";
    const typeLabel = e.type.replace(/([A-Z])/g, ' $1').toLowerCase();
    context += `- ${e.value} [Type: ${typeLabel}]: Used ${e.count} times${vars}\n  - Usage: ${e.usageContext}\n`;
  });

  context += "\n#### 🖊 STROKES & OUTLINES\n";
  data.strokes.forEach(s => {
    const vars = s.vars.length > 0 ? ` (Tokens: ${s.vars.join(', ')})` : "";
    context += `- ${s.value} [Type: ${s.type}]: Used ${s.count} times${vars}\n  - Usage: ${s.usageContext}\n`;
  });

  context += "\n#### 📦 CONTAINERS & LAYOUT\n";
  data.containers.forEach(c => {
    const vars = c.vars.length > 0 ? ` (Tokens: ${c.vars.join(', ')})` : "";
    context += `- ${c.value} [${c.category}]: Used ${c.count} times${vars}\n  - Usage: ${c.usageContext}\n`;
  });

  context += "\n#### 🖼 MEDIA ASSETS\n";
  const mediaAssets = (data.media || []).slice(0, 20);
  mediaAssets.forEach((asset, index) => {
    const sourceLine = asset.source
      ? `Source URL: ${asset.source}`
      : asset.previewUrl
        ? `Preview URL: ${asset.previewUrl}`
        : 'Source URL: inline asset';
    const locationLine = asset.contextPath || asset.context
      ? `Used in: ${asset.contextPath || asset.context}`
      : 'Used in: unknown';
    const sizeLine = asset.width && asset.height ? ` · ${asset.width}x${asset.height}px` : '';
    context += `- ${asset.kind.toUpperCase()} ${index + 1}: ${asset.fileName}${sizeLine}\n  - ${sourceLine}\n  - ${locationLine}\n`;
  });
  if ((data.media || []).length > mediaAssets.length) {
    context += `- ... and ${(data.media || []).length - mediaAssets.length} more media assets\n`;
  }

  context += "\n--- END OF CONTEXT ---\n";

  return context;
};
