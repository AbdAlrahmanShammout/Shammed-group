import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductRequestDto {
  @ApiProperty({ description: 'Product name', example: 'Amoxicillin 500 mg' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Short public description',
    example: 'Broad-spectrum antibiotic capsules',
  })
  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @ApiPropertyOptional({
    description: 'Detailed public description',
    example: 'Used under medical supervision for bacterial infections.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  detailedDescription?: string;

  @ApiPropertyOptional({ description: 'Manufacturer name', example: 'Example Pharma' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  manufacturer?: string;

  @ApiPropertyOptional({ description: 'Whether the product is public', example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order among products', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiProperty({ description: 'Product category identifier', example: 1 })
  @IsInt()
  @Min(1)
  categoryId!: number;

  @ApiPropertyOptional({ description: 'Associated partner identifier', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  partnerId?: number;

  @ApiPropertyOptional({ description: 'Product image media identifier', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  imageMediaId?: number;
}
