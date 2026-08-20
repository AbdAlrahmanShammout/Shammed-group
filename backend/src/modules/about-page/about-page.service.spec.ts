import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { AboutPageEntity } from '@/modules/about-page/entity/about-page.entity';
import { AboutPageAlreadyExistsException } from '@/modules/about-page/exceptions/about-page-already-exists.exception';
import { AboutPageService } from '@/modules/about-page/about-page.service';
import { AboutPageRepository } from '@/modules/about-page/repository/about-page.repository';
import { MediaService } from '@/modules/media/media.service';

describe('AboutPageService', () => {
  const expectedAboutPage = new AboutPageEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    overview: 'Shammed Group was established in 2005.',
    overviewImageMediaId: null,
    vision: 'To be a trusted regional healthcare partner.',
    mission: 'Provide reliable distribution and representation.',
    values: 'Quality, trust, professionalism, innovation, partnership, and commitment.',
    capabilities: 'Distribution, international representation, and a regional sales network.',
  });
  const createInput = {
    overview: expectedAboutPage.overview,
    vision: expectedAboutPage.vision,
    mission: expectedAboutPage.mission,
    values: expectedAboutPage.values,
    capabilities: expectedAboutPage.capabilities,
  };
  let aboutPageService: AboutPageService;
  let aboutPageRepository: {
    create: jest.Mock;
    findSingleton: jest.Mock;
    update: jest.Mock;
  };
  let mediaService: {
    getMediaById: jest.Mock;
  };

  beforeEach(async () => {
    aboutPageRepository = {
      create: jest.fn().mockResolvedValue(expectedAboutPage),
      findSingleton: jest.fn().mockResolvedValue(expectedAboutPage),
      update: jest.fn().mockResolvedValue(expectedAboutPage),
    };
    mediaService = {
      getMediaById: jest.fn().mockResolvedValue({ id: 8 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutPageService,
        { provide: AboutPageRepository, useValue: aboutPageRepository },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();
    aboutPageService = module.get(AboutPageService);
  });

  it('creates the singleton about page with five free-form fields', async () => {
    aboutPageRepository.findSingleton.mockResolvedValue(null);
    const actual = await aboutPageService.createAboutPage(createInput);
    expect(actual).toBe(expectedAboutPage);
    expect(aboutPageRepository.create).toHaveBeenCalledWith({
      overview: createInput.overview,
      overviewImageMediaId: null,
      vision: createInput.vision,
      mission: createInput.mission,
      values: createInput.values,
      capabilities: createInput.capabilities,
    });
    expect(typeof createInput.values).toBe('string');
  });

  it('rejects a second about page record', async () => {
    await expect(aboutPageService.createAboutPage(createInput)).rejects.toBeInstanceOf(
      AboutPageAlreadyExistsException,
    );
    expect(aboutPageRepository.create).not.toHaveBeenCalled();
  });

  it('throws ResourceNotFoundException when the about page is missing', async () => {
    aboutPageRepository.findSingleton.mockResolvedValue(null);
    await expect(aboutPageService.getAboutPage()).rejects.toBeInstanceOf(ResourceNotFoundException);
  });

  it('validates overview media through MediaService before update', async () => {
    await aboutPageService.updateAboutPage({ overviewImageMediaId: 8 });
    expect(mediaService.getMediaById).toHaveBeenCalledWith(8);
    expect(aboutPageRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expectedAboutPage.id,
        overviewImageMediaId: 8,
      }),
    );
  });
});
