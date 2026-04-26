/**
 * Perceived brightness check: (0.299R + 0.587G + 0.114B) / 255 > 0.5 = light
 */
export function isLightColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Build a complete CSS vars string based on background color and detected brightness.
 * isLight=true → use dark foreground (#13122a); isLight=false → use white foreground (#ffffff)
 */
export function buildCssVars(bg: string, isLight: boolean): string {
  if (isLight) {
    return [
      `--background: ${bg}`,
      `--foreground: #13122a`,
      `--fg-60: rgba(19, 18, 42, 0.65)`,
      `--fg-55: rgba(19, 18, 42, 0.62)`,
      `--fg-50: rgba(19, 18, 42, 0.58)`,
      `--fg-45: rgba(19, 18, 42, 0.52)`,
      `--fg-40: rgba(19, 18, 42, 0.46)`,
      `--fg-35: rgba(19, 18, 42, 0.42)`,
      `--fg-25: rgba(19, 18, 42, 0.32)`,
      `--fg-20: rgba(19, 18, 42, 0.25)`,
      `--surface: rgba(255, 255, 255, 0.72)`,
      `--surface-2: rgba(255, 255, 255, 0.85)`,
      `--border: rgba(139, 92, 246, 0.18)`,
      `--grid-line: rgba(139, 92, 246, 0.055)`,
      `--nav-scrolled-bg: rgba(244, 241, 255, 0.92)`,
      `--nav-border-scrolled: rgba(139, 92, 246, 0.15)`,
    ].join("; ");
  } else {
    return [
      `--background: ${bg}`,
      `--foreground: #ffffff`,
      `--fg-60: rgba(255, 255, 255, 0.60)`,
      `--fg-55: rgba(255, 255, 255, 0.55)`,
      `--fg-50: rgba(255, 255, 255, 0.50)`,
      `--fg-45: rgba(255, 255, 255, 0.45)`,
      `--fg-40: rgba(255, 255, 255, 0.40)`,
      `--fg-35: rgba(255, 255, 255, 0.35)`,
      `--fg-25: rgba(255, 255, 255, 0.25)`,
      `--fg-20: rgba(255, 255, 255, 0.20)`,
      `--surface: rgba(255, 255, 255, 0.030)`,
      `--surface-2: rgba(255, 255, 255, 0.040)`,
      `--border: rgba(255, 255, 255, 0.08)`,
      `--grid-line: rgba(255, 255, 255, 0.025)`,
      `--nav-scrolled-bg: rgba(5, 5, 16, 0.88)`,
      `--nav-border-scrolled: rgba(255, 255, 255, 0.06)`,
    ].join("; ");
  }
}
