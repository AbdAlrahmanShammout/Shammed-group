import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import {
  CreateSiteSettingsServiceInput,
  SiteSettingsEmailServiceInput,
  SiteSettingsPhoneServiceInput,
  UpdateSiteSettingsServiceInput,
} from '@/modules/site-settings/defs/site-settings-service.defs';
import {
  SiteSettingsEmailRepoInput,
  SiteSettingsPhoneRepoInput,
  UpdateSiteSettingsRepoInput,
} from '@/modules/site-settings/defs/site-settings-repository.defs';
import { SiteSettingsEntity } from '@/modules/site-settings/entity/site-settings.entity';
import { SiteSettingsAlreadyExistsException } from '@/modules/site-settings/exceptions/site-settings-already-exists.exception';
import { SiteSettingsEmailsRequiredException } from '@/modules/site-settings/exceptions/site-settings-emails-required.exception';
import { SiteSettingsPhonesRequiredException } from '@/modules/site-settings/exceptions/site-settings-phones-required.exception';
import { SiteSettingsRepository } from '@/modules/site-settings/repository/site-settings.repository';
import {
  DEFAULT_SITE_SETTINGS_EMAIL,
  DEFAULT_SITE_SETTINGS_EMAIL_LABEL,
  DEFAULT_SITE_SETTINGS_PHONE_LABEL,
} from '@/modules/site-settings/site-settings.constants';

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
    const emails = this.resolveCreateEmails(input);
    const phones = this.resolveCreatePhones(input);
    return this.siteSettingsRepository.create({
      companyName: input.companyName,
      companyNameEnglish: input.companyNameEnglish,
      companyNameArabic: input.companyNameArabic ?? null,
      email: this.getPrimaryEmailAddress(emails),
      emails,
      phone: this.getPrimaryPhoneNumber(phones),
      phones,
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
    const emails = this.resolveUpdateEmails(existing, input);
    const phones = this.resolveUpdatePhones(existing, input);
    const updateInput: UpdateSiteSettingsRepoInput = {
      id: existing.id,
      companyName: input.companyName,
      companyNameEnglish: input.companyNameEnglish,
      companyNameArabic: input.companyNameArabic,
      email: emails ? this.getPrimaryEmailAddress(emails) : input.email,
      emails,
      phone: phones ? this.getPrimaryPhoneNumber(phones) : input.phone,
      phones,
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
    };
    return this.siteSettingsRepository.update(updateInput);
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

  private resolveCreateEmails(input: CreateSiteSettingsServiceInput): SiteSettingsEmailRepoInput[] {
    if (input.emails !== undefined) {
      this.assertHasEmails(input.emails);
      return this.mapEmailInputs(input.emails);
    }
    return [
      {
        label: DEFAULT_SITE_SETTINGS_EMAIL_LABEL,
        email: input.email ?? DEFAULT_SITE_SETTINGS_EMAIL,
        displayOrder: 0,
      },
    ];
  }

  private resolveUpdateEmails(
    existing: SiteSettingsEntity,
    input: UpdateSiteSettingsServiceInput,
  ): SiteSettingsEmailRepoInput[] | undefined {
    if (input.emails !== undefined) {
      this.assertHasEmails(input.emails);
      return this.mapEmailInputs(input.emails);
    }
    if (input.email === undefined) {
      return undefined;
    }
    const nextPrimaryEmail = input.email;
    const existingEmails = existing.emails ?? [];
    if (existingEmails.length === 0) {
      return [
        {
          label: DEFAULT_SITE_SETTINGS_EMAIL_LABEL,
          email: nextPrimaryEmail,
          displayOrder: 0,
        },
      ];
    }
    return existingEmails.map((emailItem, index) => ({
      label: emailItem.label,
      email: index === 0 ? nextPrimaryEmail : emailItem.email,
      displayOrder: emailItem.displayOrder,
    }));
  }

  private resolveCreatePhones(input: CreateSiteSettingsServiceInput): SiteSettingsPhoneRepoInput[] {
    if (input.phones !== undefined) {
      this.assertHasPhones(input.phones);
      return this.mapPhoneInputs(input.phones);
    }
    return [
      {
        label: DEFAULT_SITE_SETTINGS_PHONE_LABEL,
        phone: input.phone,
        displayOrder: 0,
      },
    ];
  }

  private resolveUpdatePhones(
    existing: SiteSettingsEntity,
    input: UpdateSiteSettingsServiceInput,
  ): SiteSettingsPhoneRepoInput[] | undefined {
    if (input.phones !== undefined) {
      this.assertHasPhones(input.phones);
      return this.mapPhoneInputs(input.phones);
    }
    if (input.phone === undefined) {
      return undefined;
    }
    const nextPrimaryPhone = input.phone;
    const existingPhones = existing.phones ?? [];
    if (existingPhones.length === 0) {
      return [
        {
          label: DEFAULT_SITE_SETTINGS_PHONE_LABEL,
          phone: nextPrimaryPhone,
          displayOrder: 0,
        },
      ];
    }
    return existingPhones.map((phoneItem, index) => ({
      label: phoneItem.label,
      phone: index === 0 ? nextPrimaryPhone : phoneItem.phone,
      displayOrder: phoneItem.displayOrder,
    }));
  }

  private getPrimaryEmailAddress(emails: readonly SiteSettingsEmailRepoInput[]): string {
    const primaryEmail = emails[0];
    if (!primaryEmail) {
      throw new SiteSettingsEmailsRequiredException();
    }
    return primaryEmail.email;
  }

  private getPrimaryPhoneNumber(phones: readonly SiteSettingsPhoneRepoInput[]): string {
    const primaryPhone = phones[0];
    if (!primaryPhone) {
      throw new SiteSettingsPhonesRequiredException();
    }
    return primaryPhone.phone;
  }

  private assertHasEmails(emails: readonly SiteSettingsEmailServiceInput[]): void {
    if (emails.length === 0) {
      throw new SiteSettingsEmailsRequiredException();
    }
  }

  private assertHasPhones(phones: readonly SiteSettingsPhoneServiceInput[]): void {
    if (phones.length === 0) {
      throw new SiteSettingsPhonesRequiredException();
    }
  }

  private mapEmailInputs(
    emails: readonly SiteSettingsEmailServiceInput[],
  ): SiteSettingsEmailRepoInput[] {
    return emails.map((email, index) => ({
      label: email.label,
      email: email.email,
      displayOrder: email.displayOrder ?? index,
    }));
  }

  private mapPhoneInputs(
    phones: readonly SiteSettingsPhoneServiceInput[],
  ): SiteSettingsPhoneRepoInput[] {
    return phones.map((phone, index) => ({
      label: phone.label,
      phone: phone.phone,
      displayOrder: phone.displayOrder ?? index,
    }));
  }
}
