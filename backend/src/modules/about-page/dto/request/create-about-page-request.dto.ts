import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateAboutPageRequestDto {
  @ApiProperty({
    description: 'Free-form company overview',
    example:
      'Shammed Group was established in 2005 to distribute pharmaceutical and medical products.',
  })
  @IsString()
  @IsNotEmpty()
  overview!: string;

  @ApiPropertyOptional({ description: 'Overview image media identifier', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  overviewImageMediaId?: number;

  @ApiProperty({
    description: 'Free-form company vision',
    example: 'To be a trusted regional partner for international healthcare companies.',
  })
  @IsString()
  @IsNotEmpty()
  vision!: string;

  @ApiProperty({
    description: 'Free-form company mission',
    example: 'Provide reliable distribution, representation, and commercial support.',
  })
  @IsString()
  @IsNotEmpty()
  mission!: string;

  @ApiProperty({
    description: 'Free-form company values as a single text field',
    example: 'Quality, trust, professionalism, innovation, partnership, and commitment.',
  })
  @IsString()
  @IsNotEmpty()
  values!: string;

  @ApiProperty({
    description: 'Free-form company capabilities',
    example: 'Distribution, international representation, and a regional sales network.',
  })
  @IsString()
  @IsNotEmpty()
  capabilities!: string;
}
