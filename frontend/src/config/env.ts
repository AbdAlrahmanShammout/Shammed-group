const DEFAULT_API_BASE_URL = 'http://localhost:3000';
const DEFAULT_PUBLIC_SITE_URL = 'http://localhost:5173';

function normalizeSiteUrl(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  publicSiteUrl: normalizeSiteUrl(
    import.meta.env.VITE_PUBLIC_SITE_URL || DEFAULT_PUBLIC_SITE_URL,
  ),
} as const;
