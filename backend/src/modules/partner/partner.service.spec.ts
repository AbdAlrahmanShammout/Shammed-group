import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import { PartnerRepository } from '@/modules/partner/repository/partner.repository';
import { PartnerService } from '@/modules/partner/partner.service';

describe('PartnerService', () => {
  const expectedPartner = new PartnerEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    name: 'Example Pharma',
    shortDescription: 'International pharmaceutical manufacturer',
    fullDescription: null,
    specialization: 'Oncology',
    websiteUrl: 'https://www.example-pharma.com',
    country: 'Germany',
    isVisible: true,
    displayOrder: 0,
    logoMediaId: null,
  });
  let partnerService: PartnerService;
  let partnerRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    findAll: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let mediaService: {
    getMediaById: jest.Mock;
  };

  beforeEach(async () => {
    partnerRepository = {
      create: jest.fn().mockResolvedValue(expectedPartner),
      findById: jest.fn().mockResolvedValue(expectedPartner),
      findAll: jest.fn().mockResolvedValue({ entities: [expectedPartner], total: 1 }),
      update: jest.fn().mockResolvedValue(expectedPartner),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    mediaService = {
      getMediaById: jest.fn().mockResolvedValue({ id: 8 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerService,
        { provide: PartnerRepository, useValue: partnerRepository },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();
    partnerService = module.get(PartnerService);
  });

  it('creates a partner with default visibility and order', async () => {
    const actual = await partnerService.createPartner({
      name: 'Example Pharma',
      shortDescription: 'International pharmaceutical manufacturer',
    });
    expect(actual).toBe(expectedPartner);
    expect(partnerRepository.create).toHaveBeenCalledWith({
      name: 'Example Pharma',
      shortDescription: 'International pharmaceutical manufacturer',
      fullDescription: null,
      specialization: null,
      websiteUrl: null,
      country: null,
      isVisible: true,
      displayOrder: 0,
      logoMediaId: null,
    });
  });

  it('lists only visible partners for the public audience', async () => {
    await partnerService.findPublicPartners({ limit: 10, offset: 0 });
    expect(partnerRepository.findAll).toHaveBeenCalledWith({
      isVisible: true,
      limit: 10,
      offset: 0,
    });
  });

  it('hides a disabled partner from the public get', async () => {
    partnerRepository.findById.mockResolvedValue(
      new PartnerEntity({
        ...expectedPartner,
        isVisible: false,
      }),
    );
    await expect(partnerService.getPublicPartnerById(1)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
  });

  it('reorders a partner through displayOrder', async () => {
    await partnerService.updatePartner({ id: 1, displayOrder: 4 });
    expect(partnerRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        displayOrder: 4,
      }),
    );
  });

  it('throws ResourceNotFoundException when deleting a missing partner', async () => {
    partnerRepository.findById.mockResolvedValue(null);
    await expect(partnerService.deletePartner(99)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
    expect(partnerRepository.delete).not.toHaveBeenCalled();
  });
});
