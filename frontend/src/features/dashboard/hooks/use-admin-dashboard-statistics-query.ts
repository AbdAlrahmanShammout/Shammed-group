import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminDashboardStatistics } from '@/features/dashboard/api/dashboard.api';

export function useAdminDashboardStatisticsQuery(accessToken: string) {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.statistics(),
    queryFn: getAdminDashboardStatistics,
    enabled: Boolean(accessToken),
    retry: false,
  });
}
