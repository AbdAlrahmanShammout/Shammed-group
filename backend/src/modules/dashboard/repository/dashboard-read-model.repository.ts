import { DashboardStatistics } from '@/modules/dashboard/defs/dashboard-read-model.defs';

export abstract class DashboardReadModelRepository {
  abstract getCatalogCounts(): Promise<DashboardStatistics>;
}
