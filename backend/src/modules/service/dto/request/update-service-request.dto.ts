import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateServiceRequestDto {
  @ApiPropertyOptional({
    description: 'Public service title',
    example: 'Pharmaceutical Product Distribution',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    description: 'Public service description',
    example: 'Distribution of licensed pharmaceutical products across regional markets.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether the service is public', example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order among services', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({
    description: 'Primary image media identifier',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  imageMediaId?: number | null;
}
