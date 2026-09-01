import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
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
    phones: [
      {
        id: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        label: DEFAULT_SITE_SETTINGS_PHONE_LABEL,
        phone: '+963 11 000 0000',
        displayOrder: 0,
        siteSettingsId: 1,
      },
    ],
    emails: [
      {
        id: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        label: DEFAULT_SITE_SETTINGS_EMAIL_LABEL,
        email: DEFAULT_SITE_SETTINGS_EMAIL,
        displayOrder: 0,
        siteSettingsId: 1,
      },
    ],
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

  it('creates site settings with a default Primary phone', async () => {
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
      emails: [
        {
          label: DEFAULT_SITE_SETTINGS_EMAIL_LABEL,
          email: DEFAULT_SITE_SETTINGS_EMAIL,
          displayOrder: 0,
        },
      ],
      phone: '+963 11 000 0000',
      phones: [
        {
          label: DEFAULT_SITE_SETTINGS_PHONE_LABEL,
          phone: '+963 11 000 0000',
          displayOrder: 0,
        },
      ],
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
  });

  it('creates site settings with labeled phones and uses the first as the main phone', async () => {
    siteSettingsRepository.findSingleton.mockResolvedValue(null);
    await siteSettingsService.createSiteSettings({
      companyName: 'Shammed Group',
      companyNameEnglish: 'Shammed Group',
      phone: '+963 11 000 0000',
      phones: [
        { label: 'Sales', phone: '+963 11 111 1111' },
        { label: 'Accounting', phone: '+963 11 222 2222' },
      ],
    });
    expect(siteSettingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '+963 11 111 1111',
        phones: [
          { label: 'Sales', phone: '+963 11 111 1111', displayOrder: 0 },
          { label: 'Accounting', phone: '+963 11 222 2222', displayOrder: 1 },
        ],
      }),
    );
  });

  it('rejects an empty phones list', async () => {
    siteSettingsRepository.findSingleton.mockResolvedValue(null);
    await expect(
      siteSettingsService.createSiteSettings({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        phone: '+963 11 000 0000',
        phones: [],
      }),
    ).rejects.toBeInstanceOf(SiteSettingsPhonesRequiredException);
    expect(siteSettingsRepository.create).not.toHaveBeenCalled();
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

  it('replaces labeled phones and syncs the main phone to the first number', async () => {
    await siteSettingsService.updateSiteSettings({
      phones: [
        { label: 'Sales', phone: '+963 11 111 1111' },
        { label: 'Accounting', phone: '+963 11 222 2222' },
      ],
    });
    expect(siteSettingsRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '+963 11 111 1111',
        phones: [
          { label: 'Sales', phone: '+963 11 111 1111', displayOrder: 0 },
          { label: 'Accounting', phone: '+963 11 222 2222', displayOrder: 1 },
        ],
      }),
    );
  });

  it('keeps later labeled phones when only the main phone is updated', async () => {
    siteSettingsRepository.findSingleton.mockResolvedValue(
      new SiteSettingsEntity({
        ...expectedSiteSettings,
        phones: [
          {
            id: 1,
            createdAt: expectedSiteSettings.createdAt,
            updatedAt: expectedSiteSettings.updatedAt,
            label: 'Sales',
            phone: '+963 11 111 1111',
            displayOrder: 0,
            siteSettingsId: 1,
          },
          {
            id: 2,
            createdAt: expectedSiteSettings.createdAt,
            updatedAt: expectedSiteSettings.updatedAt,
            label: 'Accounting',
            phone: '+963 11 222 2222',
            displayOrder: 1,
            siteSettingsId: 1,
          },
        ],
      }),
    );
    await siteSettingsService.updateSiteSettings({ phone: '+963 11 333 3333' });
    expect(siteSettingsRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '+963 11 333 3333',
        phones: [
          { label: 'Sales', phone: '+963 11 333 3333', displayOrder: 0 },
          { label: 'Accounting', phone: '+963 11 222 2222', displayOrder: 1 },
        ],
      }),
    );
  });

  it('creates site settings with labeled emails and uses the first as the main email', async () => {
    siteSettingsRepository.findSingleton.mockResolvedValue(null);
    await siteSettingsService.createSiteSettings({
      companyName: 'Shammed Group',
      companyNameEnglish: 'Shammed Group',
      phone: '+963 11 000 0000',
      emails: [
        { label: 'Sales', email: 'sales@shammed-group.com' },
        { label: 'Accounting', email: 'accounts@shammed-group.com' },
      ],
    });
    expect(siteSettingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'sales@shammed-group.com',
        emails: [
          { label: 'Sales', email: 'sales@shammed-group.com', displayOrder: 0 },
          { label: 'Accounting', email: 'accounts@shammed-group.com', displayOrder: 1 },
        ],
      }),
    );
  });

  it('rejects an empty emails list', async () => {
    siteSettingsRepository.findSingleton.mockResolvedValue(null);
    await expect(
      siteSettingsService.createSiteSettings({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        phone: '+963 11 000 0000',
        emails: [],
      }),
    ).rejects.toBeInstanceOf(SiteSettingsEmailsRequiredException);
    expect(siteSettingsRepository.create).not.toHaveBeenCalled();
  });

  it('replaces labeled emails and syncs the main email to the first address', async () => {
    await siteSettingsService.updateSiteSettings({
      emails: [
        { label: 'Sales', email: 'sales@shammed-group.com' },
        { label: 'Accounting', email: 'accounts@shammed-group.com' },
      ],
    });
    expect(siteSettingsRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'sales@shammed-group.com',
        emails: [
          { label: 'Sales', email: 'sales@shammed-group.com', displayOrder: 0 },
          { label: 'Accounting', email: 'accounts@shammed-group.com', displayOrder: 1 },
        ],
      }),
    );
  });
});
