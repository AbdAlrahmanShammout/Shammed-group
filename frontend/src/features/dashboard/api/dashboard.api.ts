import { requestApi } from '@/api/http-client';
import type { DashboardStatisticsResponseDto } from '@/generated/admin-dashboard.contract';

const ADMIN_DASHBOARD_PATH = '/admin/dashboard';

export async function getAdminDashboardStatistics(): Promise<DashboardStatisticsResponseDto> {
  return requestApi<DashboardStatisticsResponseDto>({
    path: ADMIN_DASHBOARD_PATH,
    method: 'GET',
  });
}
