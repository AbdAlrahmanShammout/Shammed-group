import { ApiProperty } from '@nestjs/swagger';

import { CatalogCount } from '@/modules/dashboard/defs/dashboard-read-model.defs';

export class CatalogCountResponse {
  @ApiProperty({ description: 'Total rows', example: 4 })
  total: number;

  @ApiProperty({ description: 'Visible rows', example: 3 })
  visible: number;

  @ApiProperty({ description: 'Hidden rows', example: 1 })
  hidden: number;

  constructor(count: CatalogCount) {
    this.total = count.total;
    this.visible = count.visible;
    this.hidden = count.hidden;
  }
}
