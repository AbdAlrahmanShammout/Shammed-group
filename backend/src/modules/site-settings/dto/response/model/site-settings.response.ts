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

  @ApiPropertyOptional({ type: () => MediaResponse })
  logo?: MediaResponse;

  @ApiPropertyOptional({ type: () => MediaResponse })
  favicon?: MediaResponse;

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
    this.logo = data.logo ? new MediaResponse(data.logo) : undefined;
    this.favicon = data.favicon ? new MediaResponse(data.favicon) : undefined;
  }
}
