import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { MediaResponse } from '@/modules/media/dto/response/model/media.response';
import { SiteSettingsEntity } from '@/modules/site-settings/entity/site-settings.entity';

export class SiteSettingsResponse extends BaseModelResponseDto {
  @ApiProperty({ description: 'Company display name', example: 'Shammed Group' })
  companyName: string;

  @ApiProperty({ description: 'Official English company name', example: 'Shammed Group' })
  companyNameEnglish: string;

  @ApiPropertyOptional({ description: 'Official Arabic company name', example: 'مجموعة شاميد' })
  companyNameArabic?: string;

  @ApiProperty({ description: 'Main company email', example: 'info@shammed-group.com' })
  email: string;

  @ApiProperty({ description: 'Main company phone', example: '+963 11 000 0000' })
  phone: string;

  @ApiPropertyOptional({ description: 'WhatsApp contact number', example: '+963 11 000 0000' })
  whatsApp?: string;

  @ApiPropertyOptional({ description: 'Main company address', example: 'Damascus, Syria' })
  address?: string;

  @ApiPropertyOptional({ description: 'Logo media identifier', example: 1 })
  logoMediaId?: number;

  @ApiPropertyOptional({ description: 'Favicon media identifier', example: 2 })
  faviconMediaId?: number;

  @ApiPropertyOptional({ description: 'Image placeholder media identifier', example: 3 })
  placeholderMediaId?: number;

  @ApiPropertyOptional({ description: 'Primary brand color (hex)', example: '#2C3470' })
  primaryColor?: string;

  @ApiPropertyOptional({ description: 'Accent / highlight color (hex)', example: '#A32D24' })
  accentColor?: string;

  @ApiPropertyOptional({ description: 'Page background color (hex)', example: '#FFFFFF' })
  backgroundColor?: string;

  @ApiPropertyOptional({ description: 'Body text color (hex)', example: '#1F2937' })
  textColor?: string;

  @ApiPropertyOptional({ description: 'Secondary / soft-tint color (hex)', example: '#E8ECF7' })
  secondaryColor?: string;

  @ApiPropertyOptional({ description: 'Border / divider color (hex)', example: '#D9DEE8' })
  borderColor?: string;

  @ApiPropertyOptional({ type: () => MediaResponse })
  logo?: MediaResponse;

  @ApiPropertyOptional({ type: () => MediaResponse })
  favicon?: MediaResponse;

  @ApiPropertyOptional({ type: () => MediaResponse })
  placeholder?: MediaResponse;

  constructor(data: SiteSettingsEntity) {
    super(data);
    this.companyName = data.companyName;
    this.companyNameEnglish = data.companyNameEnglish;
    this.companyNameArabic = data.companyNameArabic ?? undefined;
    this.email = data.email;
    this.phone = data.phone;
    this.whatsApp = data.whatsApp ?? undefined;
    this.address = data.address ?? undefined;
    this.logoMediaId = data.logoMediaId ?? undefined;
    this.faviconMediaId = data.faviconMediaId ?? undefined;
    this.placeholderMediaId = data.placeholderMediaId ?? undefined;
    this.primaryColor = data.primaryColor ?? undefined;
    this.accentColor = data.accentColor ?? undefined;
    this.backgroundColor = data.backgroundColor ?? undefined;
    this.textColor = data.textColor ?? undefined;
    this.secondaryColor = data.secondaryColor ?? undefined;
    this.borderColor = data.borderColor ?? undefined;
    this.logo = data.logo ? new MediaResponse(data.logo) : undefined;
    this.favicon = data.favicon ? new MediaResponse(data.favicon) : undefined;
    this.placeholder = data.placeholder ? new MediaResponse(data.placeholder) : undefined;
  }
}
