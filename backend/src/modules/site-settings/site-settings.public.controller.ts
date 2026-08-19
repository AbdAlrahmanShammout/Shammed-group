import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SiteSettingsResponseDto } from '@/modules/site-settings/dto/response/site-settings-response.dto';
import { SiteSettingsService } from '@/modules/site-settings/site-settings.service';

@ApiTags('Public - Site Settings')
@Controller('site-settings')
export class SiteSettingsPublicController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get public site settings' })
  @ApiResponse({ status: HttpStatus.OK, type: SiteSettingsResponseDto })
  async getSiteSettings(): Promise<SiteSettingsResponseDto> {
    const siteSettings = await this.siteSettingsService.getSiteSettings();
    return new SiteSettingsResponseDto(siteSettings);
  }
}
