import { ApiProperty } from '@nestjs/swagger';

import { DashboardStatistics } from '@/modules/dashboard/defs/dashboard-read-model.defs';
import { CatalogCountResponse } from '@/modules/dashboard/dto/response/model/catalog-count.response';

export class DashboardStatisticsResponse {
  @ApiProperty({ type: () => CatalogCountResponse })
  products: CatalogCountResponse;

  @ApiProperty({ type: () => CatalogCountResponse })
  categories: CatalogCountResponse;

  @ApiProperty({ type: () => CatalogCountResponse })
  partners: CatalogCountResponse;

  @ApiProperty({ type: () => CatalogCountResponse })
  services: CatalogCountResponse;

  constructor(statistics: DashboardStatistics) {
    this.products = new CatalogCountResponse(statistics.products);
    this.categories = new CatalogCountResponse(statistics.categories);
    this.partners = new CatalogCountResponse(statistics.partners);
    this.services = new CatalogCountResponse(statistics.services);
  }
}
