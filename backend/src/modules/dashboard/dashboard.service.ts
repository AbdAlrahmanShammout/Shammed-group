import { Injectable } from '@nestjs/common';

import { DashboardStatistics } from '@/modules/dashboard/defs/dashboard-read-model.defs';
import { DashboardReadModelRepository } from '@/modules/dashboard/repository/dashboard-read-model.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardReadModelRepository: DashboardReadModelRepository) {}

  async getDashboardStatistics(): Promise<DashboardStatistics> {
    return this.dashboardReadModelRepository.getCatalogCounts();
  }
}
