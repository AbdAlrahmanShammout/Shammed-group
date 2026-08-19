import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class DeleteProductCategoryRequestDto {
  @ApiPropertyOptional({
    description: 'Category that should receive products before this category is deleted',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: { value: string | undefined }) =>
    value === undefined ? undefined : parseInt(value, 10),
  )
  replacementCategoryId?: number;
}
