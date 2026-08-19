import { QueryClient } from '@tanstack/react-query';

const QUERY_STALE_TIME_MS = 30_000;

/**
 * Creates the application QueryClient with dashboard-wide defaults.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: QUERY_STALE_TIME_MS,
      },
    },
  });
}
