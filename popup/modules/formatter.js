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

  context += "\n--- END OF CONTEXT ---\n";
  return context;
};
