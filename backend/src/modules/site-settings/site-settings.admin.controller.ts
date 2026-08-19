import { Body, Controller, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CreateSiteSettingsRequestDto } from '@/modules/site-settings/dto/request/create-site-settings-request.dto';
import { UpdateSiteSettingsRequestDto } from '@/modules/site-settings/dto/request/update-site-settings-request.dto';
import { SiteSettingsResponseDto } from '@/modules/site-settings/dto/response/site-settings-response.dto';
import { SiteSettingsService } from '@/modules/site-settings/site-settings.service';

@ApiTags('Admin - Site Settings')
@Controller('admin/site-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class SiteSettingsAdminController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create the singleton site settings record' })
  @ApiBody({ type: CreateSiteSettingsRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: SiteSettingsResponseDto })
  async createSiteSettings(
    @Body() requestDto: CreateSiteSettingsRequestDto,
  ): Promise<SiteSettingsResponseDto> {
    const siteSettings = await this.siteSettingsService.createSiteSettings({
      companyName: requestDto.companyName,
      companyNameEnglish: requestDto.companyNameEnglish,
      companyNameArabic: requestDto.companyNameArabic,
      email: requestDto.email,
      phone: requestDto.phone,
      whatsApp: requestDto.whatsApp,
      address: requestDto.address,
      logoMediaId: requestDto.logoMediaId,
      faviconMediaId: requestDto.faviconMediaId,
    });
    return new SiteSettingsResponseDto(siteSettings);
  }

  @Get()
  @ApiOperation({ summary: 'Get the singleton site settings record' })
  @ApiResponse({ status: HttpStatus.OK, type: SiteSettingsResponseDto })
  async getSiteSettings(): Promise<SiteSettingsResponseDto> {
    const siteSettings = await this.siteSettingsService.getSiteSettings();
    return new SiteSettingsResponseDto(siteSettings);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the singleton site settings record' })
  @ApiBody({ type: UpdateSiteSettingsRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: SiteSettingsResponseDto })
  async updateSiteSettings(
    @Body() requestDto: UpdateSiteSettingsRequestDto,
  ): Promise<SiteSettingsResponseDto> {
    const siteSettings = await this.siteSettingsService.updateSiteSettings({
      companyName: requestDto.companyName,
      companyNameEnglish: requestDto.companyNameEnglish,
      companyNameArabic: requestDto.companyNameArabic,
      email: requestDto.email,
      phone: requestDto.phone,
      whatsApp: requestDto.whatsApp,
      address: requestDto.address,
      logoMediaId: requestDto.logoMediaId,
      faviconMediaId: requestDto.faviconMediaId,
    });
    return new SiteSettingsResponseDto(siteSettings);
  }
}
