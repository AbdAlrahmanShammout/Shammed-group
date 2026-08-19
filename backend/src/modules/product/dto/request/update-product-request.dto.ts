import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductRequestDto {
  @ApiPropertyOptional({ description: 'Product name', example: 'Amoxicillin 500 mg' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Short public description',
    example: 'Broad-spectrum antibiotic capsules',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Detailed public description',
    example: 'Used under medical supervision for bacterial infections.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  detailedDescription?: string | null;

  @ApiPropertyOptional({
    description: 'Manufacturer name',
    example: 'Example Pharma',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  manufacturer?: string | null;

  @ApiPropertyOptional({ description: 'Whether the product is public', example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order among products', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Product category identifier', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Associated partner identifier',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  partnerId?: number | null;

  @ApiPropertyOptional({
    description: 'Product image media identifier',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  imageMediaId?: number | null;
}
