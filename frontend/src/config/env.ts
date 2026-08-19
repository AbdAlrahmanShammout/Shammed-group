const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
} as const;
