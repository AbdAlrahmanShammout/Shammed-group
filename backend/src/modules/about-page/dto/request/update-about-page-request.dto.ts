import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateIf } from 'class-validator';

export class UpdateAboutPageRequestDto {
  @ApiPropertyOptional({
    description: 'Free-form company overview',
    example:
      'Shammed Group was established in 2005 to distribute pharmaceutical and medical products.',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  overview?: string;

  @ApiPropertyOptional({
    description: 'Overview image media identifier',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  overviewImageMediaId?: number | null;

  @ApiPropertyOptional({
    description: 'Free-form company vision',
    example: 'To be a trusted regional partner for international healthcare companies.',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  vision?: string;

  @ApiPropertyOptional({
    description: 'Free-form company mission',
    example: 'Provide reliable distribution, representation, and commercial support.',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  mission?: string;

  @ApiPropertyOptional({
    description: 'Free-form company values as a single text field',
    example: 'Quality, trust, professionalism, innovation, partnership, and commitment.',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  values?: string;

  @ApiPropertyOptional({
    description: 'Free-form company capabilities',
    example: 'Distribution, international representation, and a regional sales network.',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  capabilities?: string;
}
