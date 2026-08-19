import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateIf } from 'class-validator';

export class UpdateSiteSettingsRequestDto {
  @ApiPropertyOptional({ description: 'Company display name', example: 'Shammed Group' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  companyName?: string;

  @ApiPropertyOptional({ description: 'Official English company name', example: 'Shammed Group' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  companyNameEnglish?: string;

  @ApiPropertyOptional({
    description: 'Official Arabic company name',
    example: 'مجموعة شاميد',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  companyNameArabic?: string | null;

  @ApiPropertyOptional({
    description: 'Main company email',
    example: 'info@shammed-group.com',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Main company phone', example: '+963 11 000 0000' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiPropertyOptional({
    description: 'WhatsApp contact number',
    example: '+963 11 000 0000',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  whatsApp?: string | null;

  @ApiPropertyOptional({
    description: 'Main company address',
    example: 'Damascus, Syria',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string | null;

  @ApiPropertyOptional({ description: 'Logo media identifier', example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  logoMediaId?: number | null;

  @ApiPropertyOptional({ description: 'Favicon media identifier', example: 2, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  faviconMediaId?: number | null;
}
