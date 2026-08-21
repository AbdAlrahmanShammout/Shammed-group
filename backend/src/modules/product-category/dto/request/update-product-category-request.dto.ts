import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductCategoryRequestDto {
  @ApiPropertyOptional({ description: 'Category name', example: 'Pharmaceutical Products' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Medicines distributed by Shammed Group',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string | null;

  @ApiPropertyOptional({ description: 'Whether the category is public', example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order among categories', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({
    description: 'Hex color code for the category theme, or null to clear',
    example: '#394285',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string | null;
}
