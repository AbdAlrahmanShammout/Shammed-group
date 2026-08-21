import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSiteSettingsRequestDto {
  @ApiProperty({ description: 'Company display name', example: 'Shammed Group' })
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty({ description: 'Official English company name', example: 'Shammed Group' })
  @IsString()
  @IsNotEmpty()
  companyNameEnglish!: string;

  @ApiPropertyOptional({ description: 'Official Arabic company name', example: 'مجموعة شاميد' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  companyNameArabic?: string;

  @ApiPropertyOptional({
    description: 'Main company email',
    example: 'info@shammed-group.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Main company phone', example: '+963 11 000 0000' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({ description: 'WhatsApp contact number', example: '+963 11 000 0000' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  whatsApp?: string;

  @ApiPropertyOptional({ description: 'Main company address', example: 'Damascus, Syria' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiPropertyOptional({ description: 'Logo media identifier', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  logoMediaId?: number;

  @ApiPropertyOptional({ description: 'Favicon media identifier', example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  faviconMediaId?: number;

  @ApiPropertyOptional({ description: 'Image placeholder media identifier', example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  placeholderMediaId?: number;

  @ApiPropertyOptional({ description: 'Primary brand color (hex)', example: '#2C3470' })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({ description: 'Accent / highlight color (hex)', example: '#A32D24' })
  @IsOptional()
  @IsString()
  accentColor?: string;

  @ApiPropertyOptional({ description: 'Page background color (hex)', example: '#FFFFFF' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: 'Body text color (hex)', example: '#1F2937' })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional({ description: 'Secondary / soft-tint color (hex)', example: '#E8ECF7' })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiPropertyOptional({ description: 'Border / divider color (hex)', example: '#D9DEE8' })
  @IsOptional()
  @IsString()
  borderColor?: string;
}
