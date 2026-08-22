import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class GetProductsRequestDto {
  @ApiPropertyOptional({ description: 'Maximum rows to return', example: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }: { value: string | undefined }) =>
    value === undefined ? undefined : parseInt(value, 10),
  )
  limit?: number;

  @ApiPropertyOptional({ description: 'Number of rows to skip', example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }: { value: string | undefined }) =>
    value === undefined ? undefined : parseInt(value, 10),
  )
  offset?: number;

  @ApiPropertyOptional({ description: 'Filter by product category identifier', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }: { value: string | undefined }) =>
    value === undefined ? undefined : parseInt(value, 10),
  )
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Filter by partner identifier', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }: { value: string | undefined }) =>
    value === undefined ? undefined : parseInt(value, 10),
  )
  partnerId?: number;

  @ApiPropertyOptional({
    description: 'Search by product name, manufacturer, or description',
    example: 'amoxicillin',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: string | undefined }) => {
    if (value === undefined) {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  })
  search?: string;
}
