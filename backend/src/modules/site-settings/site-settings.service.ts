import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import {
  CreateSiteSettingsServiceInput,
  UpdateSiteSettingsServiceInput,
} from '@/modules/site-settings/defs/site-settings-service.defs';
import { SiteSettingsEntity } from '@/modules/site-settings/entity/site-settings.entity';
import { SiteSettingsAlreadyExistsException } from '@/modules/site-settings/exceptions/site-settings-already-exists.exception';
import { SiteSettingsRepository } from '@/modules/site-settings/repository/site-settings.repository';
import { DEFAULT_SITE_SETTINGS_EMAIL } from '@/modules/site-settings/site-settings.constants';

@Injectable()
export class SiteSettingsService {
  constructor(
    private readonly siteSettingsRepository: SiteSettingsRepository,
    private readonly mediaService: MediaService,
  ) {}

  async createSiteSettings(input: CreateSiteSettingsServiceInput): Promise<SiteSettingsEntity> {
    await this.assertSingletonAbsent();
    await this.assertMediaReference(input.logoMediaId);
    await this.assertMediaReference(input.faviconMediaId);
    await this.assertMediaReference(input.placeholderMediaId);
    return this.siteSettingsRepository.create({
      companyName: input.companyName,
      companyNameEnglish: input.companyNameEnglish,
      companyNameArabic: input.companyNameArabic ?? null,
      email: input.email ?? DEFAULT_SITE_SETTINGS_EMAIL,
      phone: input.phone,
      whatsApp: input.whatsApp ?? null,
      address: input.address ?? null,
      logoMediaId: input.logoMediaId ?? null,
      faviconMediaId: input.faviconMediaId ?? null,
      placeholderMediaId: input.placeholderMediaId ?? null,
      primaryColor: input.primaryColor ?? null,
      accentColor: input.accentColor ?? null,
      backgroundColor: input.backgroundColor ?? null,
      textColor: input.textColor ?? null,
      secondaryColor: input.secondaryColor ?? null,
      borderColor: input.borderColor ?? null,
    });
  }

  async findSiteSettings(): Promise<SiteSettingsEntity | null> {
    return this.siteSettingsRepository.findSingleton();
  }

  async getSiteSettings(): Promise<SiteSettingsEntity> {
    const siteSettings = await this.findSiteSettings();
    if (!siteSettings) {
      throw new ResourceNotFoundException('SiteSettings', 'default');
    }
    return siteSettings;
  }

  async updateSiteSettings(input: UpdateSiteSettingsServiceInput): Promise<SiteSettingsEntity> {
    const existing = await this.getSiteSettings();
    await this.assertMediaReference(input.logoMediaId);
    await this.assertMediaReference(input.faviconMediaId);
    await this.assertMediaReference(input.placeholderMediaId);
    return this.siteSettingsRepository.update({
      id: existing.id,
      companyName: input.companyName,
      companyNameEnglish: input.companyNameEnglish,
      companyNameArabic: input.companyNameArabic,
      email: input.email,
      phone: input.phone,
      whatsApp: input.whatsApp,
      address: input.address,
      logoMediaId: input.logoMediaId,
      faviconMediaId: input.faviconMediaId,
      placeholderMediaId: input.placeholderMediaId,
      primaryColor: input.primaryColor,
      accentColor: input.accentColor,
      backgroundColor: input.backgroundColor,
      textColor: input.textColor,
      secondaryColor: input.secondaryColor,
      borderColor: input.borderColor,
    });
  }

  private async assertSingletonAbsent(): Promise<void> {
    const existing = await this.findSiteSettings();
    if (existing) {
      throw new SiteSettingsAlreadyExistsException();
    }
  }

  private async assertMediaReference(mediaId?: number | null): Promise<void> {
    if (mediaId === undefined || mediaId === null) {
      return;
    }
    await this.mediaService.getMediaById(mediaId);
  }
}
