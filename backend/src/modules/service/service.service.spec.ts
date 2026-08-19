import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import { ServiceEntity } from '@/modules/service/entity/service.entity';
import { ServiceRepository } from '@/modules/service/repository/service.repository';
import { ServiceService } from '@/modules/service/service.service';

describe('ServiceService', () => {
  const expectedService = new ServiceEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    title: 'Custom Logistics Support',
    description: 'Regional warehousing and last-mile delivery for licensed products.',
    isVisible: true,
    displayOrder: 0,
    imageMediaId: null,
  });
  let serviceService: ServiceService;
  let serviceRepository: {
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
    serviceRepository = {
      create: jest.fn().mockResolvedValue(expectedService),
      findById: jest.fn().mockResolvedValue(expectedService),
      findAll: jest.fn().mockResolvedValue({ entities: [expectedService], total: 1 }),
      update: jest.fn().mockResolvedValue(expectedService),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    mediaService = {
      getMediaById: jest.fn().mockResolvedValue({ id: 8 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: ServiceRepository, useValue: serviceRepository },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();
    serviceService = module.get(ServiceService);
  });

  it('creates a service with a free-text title and default visibility', async () => {
    const actual = await serviceService.createService({
      title: 'Custom Logistics Support',
      description: 'Regional warehousing and last-mile delivery for licensed products.',
    });
    expect(actual).toBe(expectedService);
    expect(serviceRepository.create).toHaveBeenCalledWith({
      title: 'Custom Logistics Support',
      description: 'Regional warehousing and last-mile delivery for licensed products.',
      isVisible: true,
      displayOrder: 0,
      imageMediaId: null,
    });
  });

  it('lists only visible services for the public audience', async () => {
    await serviceService.findPublicServices({ limit: 10, offset: 0 });
    expect(serviceRepository.findAll).toHaveBeenCalledWith({
      isVisible: true,
      limit: 10,
      offset: 0,
    });
  });

  it('hides a disabled service from the public get', async () => {
    serviceRepository.findById.mockResolvedValue(
      new ServiceEntity({
        ...expectedService,
        isVisible: false,
      }),
    );
    await expect(serviceService.getPublicServiceById(1)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
  });

  it('reorders a service through displayOrder', async () => {
    await serviceService.updateService({ id: 1, displayOrder: 4 });
    expect(serviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        displayOrder: 4,
      }),
    );
  });

  it('throws ResourceNotFoundException when deleting a missing service', async () => {
    serviceRepository.findById.mockResolvedValue(null);
    await expect(serviceService.deleteService(99)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
    expect(serviceRepository.delete).not.toHaveBeenCalled();
  });
});
