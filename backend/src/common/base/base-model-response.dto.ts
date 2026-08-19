import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/common/base/base.entity';

export class BaseModelResponseDto {
  @ApiProperty({ description: 'Resource identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(data: Pick<BaseEntity, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
