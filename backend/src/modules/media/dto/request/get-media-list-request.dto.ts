import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetMediaListRequestDto {
  @ApiPropertyOptional({ description: 'Maximum rows to return', example: 50 })
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
}
