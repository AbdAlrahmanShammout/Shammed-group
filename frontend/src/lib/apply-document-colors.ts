import type { SiteSettingsResponse } from '@/generated/public-site.contract';

/**
 * Default brand palette — mirrors the values in index.css :root.
 * Used as fallback when a color has not been customised.
 */
export const DEFAULT_COLORS = {
  primary: '#2C3470',
  accent: '#A32D24',
  background: '#FFFFFF',
  text: '#1F2937',
  secondary: '#E8ECF7',
  border: '#D9DEE8',
} as const;

/**
 * Returns white (`#FFFFFF`) for dark colours and near-black (`#1F2937`) for
 * light colours, so foreground text always meets WCAG AA contrast.
 */
function computeContrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1F2937' : '#FFFFFF';
}

function setVar(property: string, value: string | null | undefined): void {
  if (value) {
    document.documentElement.style.setProperty(property, value);
  } else {
    document.documentElement.style.removeProperty(property);
  }
}

/**
 * Applies theme color overrides from site-settings to CSS custom properties on
 * `document.documentElement`.  When a field is null / undefined the inline
 * style is removed so the `index.css` default takes over automatically.
 *
 * Call this inside a `useEffect` whenever `siteSettings` changes.
 */
export function applyDocumentColors(
  settings: Pick<
    SiteSettingsResponse,
    'primaryColor' | 'accentColor' | 'backgroundColor' | 'textColor' | 'secondaryColor' | 'borderColor'
  >,
): void {
  const primary = settings.primaryColor ?? null;
  const accent = settings.accentColor ?? null;
  const background = settings.backgroundColor ?? null;
  const text = settings.textColor ?? null;
  const secondary = settings.secondaryColor ?? null;
  const border = settings.borderColor ?? null;

  // Primary — drives buttons, nav active states, sidebar, ring
  setVar('--primary', primary);
  if (primary) {
    const fg = computeContrastText(primary);
    document.documentElement.style.setProperty('--primary-foreground', fg);
    document.documentElement.style.setProperty('--ring', primary);
    document.documentElement.style.setProperty('--secondary-foreground', primary);
    document.documentElement.style.setProperty('--accent-foreground', primary);
    document.documentElement.style.setProperty('--sidebar', primary);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', primary);
    document.documentElement.style.setProperty('--sidebar-primary', fg);
    document.documentElement.style.setProperty('--sidebar-accent', adjustBrightness(primary, -12));
  } else {
    for (const prop of [
      '--primary-foreground',
      '--ring',
      '--secondary-foreground',
      '--accent-foreground',
      '--sidebar',
      '--sidebar-primary',
      '--sidebar-primary-foreground',
      '--sidebar-accent',
    ]) {
      document.documentElement.style.removeProperty(prop);
    }
  }

  // Accent → used as the brand highlight / destructive color
  setVar('--destructive', accent);
  if (accent) {
    document.documentElement.style.setProperty(
      '--destructive-foreground',
      computeContrastText(accent),
    );
  } else {
    document.documentElement.style.removeProperty('--destructive-foreground');
  }

  // Background — page, card, popover
  setVar('--background', background);
  setVar('--card', background);
  setVar('--popover', background);

  // Text
  setVar('--foreground', text);
  setVar('--card-foreground', text);
  setVar('--popover-foreground', text);

  // Secondary soft tint
  setVar('--secondary', secondary);
  setVar('--accent', secondary);

  // Border
  setVar('--border', border);
  setVar('--input', border);
}

/** Lightens (+) or darkens (–) a hex colour by `amount` (0–255). */
function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
