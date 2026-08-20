import { ApiProperty } from '@nestjs/swagger';

import { DashboardStatistics } from '@/modules/dashboard/defs/dashboard-read-model.defs';
import { DashboardStatisticsResponse } from '@/modules/dashboard/dto/response/model/dashboard-statistics.response';

export class DashboardStatisticsResponseDto {
  @ApiProperty({ type: () => DashboardStatisticsResponse })
  statistics: DashboardStatisticsResponse;

  constructor(statistics: DashboardStatistics) {
    this.statistics = new DashboardStatisticsResponse(statistics);
  }
}
