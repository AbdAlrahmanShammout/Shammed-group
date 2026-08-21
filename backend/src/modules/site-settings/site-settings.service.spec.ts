import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import { SiteSettingsEntity } from '@/modules/site-settings/entity/site-settings.entity';
import { SiteSettingsAlreadyExistsException } from '@/modules/site-settings/exceptions/site-settings-already-exists.exception';
import { SiteSettingsRepository } from '@/modules/site-settings/repository/site-settings.repository';
import { DEFAULT_SITE_SETTINGS_EMAIL } from '@/modules/site-settings/site-settings.constants';
import { SiteSettingsService } from '@/modules/site-settings/site-settings.service';

describe('SiteSettingsService', () => {
  const expectedSiteSettings = new SiteSettingsEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    companyName: 'Shammed Group',
    companyNameEnglish: 'Shammed Group',
    companyNameArabic: 'مجموعة شاميد',
    email: DEFAULT_SITE_SETTINGS_EMAIL,
    phone: '+963 11 000 0000',
    whatsApp: null,
    address: null,
    logoMediaId: null,
    faviconMediaId: null,
      placeholderMediaId: null,
      primaryColor: null,
      accentColor: null,
      backgroundColor: null,
      textColor: null,
      secondaryColor: null,
      borderColor: null,
  });
  let siteSettingsService: SiteSettingsService;
  let siteSettingsRepository: {
    create: jest.Mock;
    findSingleton: jest.Mock;
    update: jest.Mock;
  };
  let mediaService: {
    getMediaById: jest.Mock;
  };

  beforeEach(async () => {
    siteSettingsRepository = {
      create: jest.fn().mockResolvedValue(expectedSiteSettings),
      findSingleton: jest.fn().mockResolvedValue(expectedSiteSettings),
      update: jest.fn().mockResolvedValue(expectedSiteSettings),
    };
    mediaService = {
      getMediaById: jest.fn().mockResolvedValue({ id: 8 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteSettingsService,
        { provide: SiteSettingsRepository, useValue: siteSettingsRepository },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();
    siteSettingsService = module.get(SiteSettingsService);
  });

  it('creates site settings with the confirmed default email', async () => {
    siteSettingsRepository.findSingleton.mockResolvedValue(null);
    const actual = await siteSettingsService.createSiteSettings({
      companyName: 'Shammed Group',
      companyNameEnglish: 'Shammed Group',
      phone: '+963 11 000 0000',
    });
    expect(actual).toBe(expectedSiteSettings);
    expect(siteSettingsRepository.create).toHaveBeenCalledWith({
      companyName: 'Shammed Group',
      companyNameEnglish: 'Shammed Group',
      companyNameArabic: null,
      email: DEFAULT_SITE_SETTINGS_EMAIL,
      phone: '+963 11 000 0000',
      whatsApp: null,
      address: null,
      logoMediaId: null,
      faviconMediaId: null,
    });
  });

  it('rejects a second settings record', async () => {
    await expect(
      siteSettingsService.createSiteSettings({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        phone: '+963 11 000 0000',
      }),
    ).rejects.toBeInstanceOf(SiteSettingsAlreadyExistsException);
    expect(siteSettingsRepository.create).not.toHaveBeenCalled();
  });

  it('throws ResourceNotFoundException when settings are missing', async () => {
    siteSettingsRepository.findSingleton.mockResolvedValue(null);
    await expect(siteSettingsService.getSiteSettings()).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
  });

  it('validates logo media through MediaService before update', async () => {
    await siteSettingsService.updateSiteSettings({ logoMediaId: 8 });
    expect(mediaService.getMediaById).toHaveBeenCalledWith(8);
    expect(siteSettingsRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expectedSiteSettings.id,
        logoMediaId: 8,
      }),
    );
  });
});
