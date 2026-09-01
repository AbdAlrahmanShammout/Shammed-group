import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class UpdateSiteSettingsPhoneItemDto {
  @ApiProperty({ description: 'Label shown above the phone number', example: 'Sales' })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({ description: 'Company phone number', example: '+963 11 000 0000' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({ description: 'Sort order among phones', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class UpdateSiteSettingsEmailItemDto {
  @ApiProperty({ description: 'Label shown above the email address', example: 'Sales' })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({ description: 'Company email address', example: 'sales@shammed-group.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: 'Sort order among emails', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

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

  @ApiPropertyOptional({ type: () => [UpdateSiteSettingsEmailItemDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateSiteSettingsEmailItemDto)
  emails?: UpdateSiteSettingsEmailItemDto[];

  @ApiPropertyOptional({ description: 'Main company phone', example: '+963 11 000 0000' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiPropertyOptional({ type: () => [UpdateSiteSettingsPhoneItemDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateSiteSettingsPhoneItemDto)
  phones?: UpdateSiteSettingsPhoneItemDto[];

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

  @ApiPropertyOptional({
    description: 'Image placeholder media identifier',
    example: 3,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  placeholderMediaId?: number | null;

  @ApiPropertyOptional({ description: 'Primary brand color (hex)', example: '#2C3470', nullable: true })
  @IsOptional()
  @IsString()
  primaryColor?: string | null;

  @ApiPropertyOptional({ description: 'Accent / highlight color (hex)', example: '#A32D24', nullable: true })
  @IsOptional()
  @IsString()
  accentColor?: string | null;

  @ApiPropertyOptional({ description: 'Page background color (hex)', example: '#FFFFFF', nullable: true })
  @IsOptional()
  @IsString()
  backgroundColor?: string | null;

  @ApiPropertyOptional({ description: 'Body text color (hex)', example: '#1F2937', nullable: true })
  @IsOptional()
  @IsString()
  textColor?: string | null;

  @ApiPropertyOptional({ description: 'Secondary / soft-tint color (hex)', example: '#E8ECF7', nullable: true })
  @IsOptional()
  @IsString()
  secondaryColor?: string | null;

  @ApiPropertyOptional({ description: 'Border / divider color (hex)', example: '#D9DEE8', nullable: true })
  @IsOptional()
  @IsString()
  borderColor?: string | null;
}
