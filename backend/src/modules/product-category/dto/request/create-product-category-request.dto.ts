import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductCategoryRequestDto {
  @ApiProperty({ description: 'Category name', example: 'Pharmaceutical Products' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Medicines distributed by Shammed Group',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

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
    description: 'Hex color code for the category theme (e.g. #394285)',
    example: '#394285',
  })
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;
}
