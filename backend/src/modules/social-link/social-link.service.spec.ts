import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { SocialLinkEntity } from '@/modules/social-link/entity/social-link.entity';
import { SocialLinkRepository } from '@/modules/social-link/repository/social-link.repository';
import { SocialLinkService } from '@/modules/social-link/social-link.service';

describe('SocialLinkService', () => {
  const expectedSocialLink = new SocialLinkEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/company/example',
    isVisible: true,
    displayOrder: 0,
  });
  let socialLinkService: SocialLinkService;
  let socialLinkRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    findAll: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    socialLinkRepository = {
      create: jest.fn().mockResolvedValue(expectedSocialLink),
      findById: jest.fn().mockResolvedValue(expectedSocialLink),
      findAll: jest.fn().mockResolvedValue({ entities: [expectedSocialLink], total: 1 }),
      update: jest.fn().mockResolvedValue(expectedSocialLink),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialLinkService,
        { provide: SocialLinkRepository, useValue: socialLinkRepository },
      ],
    }).compile();
    socialLinkService = module.get(SocialLinkService);
  });

  it('creates a social link with default visibility and order', async () => {
    const actual = await socialLinkService.createSocialLink({
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/example',
    });
    expect(actual).toBe(expectedSocialLink);
    expect(socialLinkRepository.create).toHaveBeenCalledWith({
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/example',
      isVisible: true,
      displayOrder: 0,
    });
  });

  it('lists only visible social links for the public audience', async () => {
    await socialLinkService.findPublicSocialLinks({ limit: 10, offset: 0 });
    expect(socialLinkRepository.findAll).toHaveBeenCalledWith({
      isVisible: true,
      limit: 10,
      offset: 0,
    });
  });

  it('hides a disabled social link from the public get', async () => {
    socialLinkRepository.findById.mockResolvedValue(
      new SocialLinkEntity({
        ...expectedSocialLink,
        isVisible: false,
      }),
    );
    await expect(socialLinkService.getPublicSocialLinkById(1)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
  });
});
