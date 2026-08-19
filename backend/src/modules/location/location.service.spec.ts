import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { LocationEntity } from '@/modules/location/entity/location.entity';
import { LocationCoordinatesIncompleteException } from '@/modules/location/exceptions/location-coordinates-incomplete.exception';
import { LocationPhonesRequiredException } from '@/modules/location/exceptions/location-phones-required.exception';
import { LocationService } from '@/modules/location/location.service';
import { LocationRepository } from '@/modules/location/repository/location.repository';

describe('LocationService', () => {
  const expectedLocation = new LocationEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    name: 'Damascus office',
    address: 'Mazzeh, Damascus',
    googleMapsUrl: null,
    latitude: 33.5138,
    longitude: 36.2765,
    isVisible: true,
    displayOrder: 0,
    phones: [
      {
        id: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        phone: '+963 11 123 4567',
        displayOrder: 0,
        locationId: 1,
      },
    ],
  });
  let locationService: LocationService;
  let locationRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    findAll: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    locationRepository = {
      create: jest.fn().mockResolvedValue(expectedLocation),
      findById: jest.fn().mockResolvedValue(expectedLocation),
      findAll: jest.fn().mockResolvedValue({ entities: [expectedLocation], total: 1 }),
      update: jest.fn().mockResolvedValue(expectedLocation),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationService, { provide: LocationRepository, useValue: locationRepository }],
    }).compile();
    locationService = module.get(LocationService);
  });

  it('creates a location with default visibility and phone order', async () => {
    const actual = await locationService.createLocation({
      name: 'Damascus office',
      address: 'Mazzeh, Damascus',
      latitude: 33.5138,
      longitude: 36.2765,
      phones: [{ phone: '+963 11 123 4567' }],
    });
    expect(actual).toBe(expectedLocation);
    expect(locationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
        displayOrder: 0,
        phones: [{ phone: '+963 11 123 4567', displayOrder: 0 }],
      }),
    );
  });

  it('rejects a location without phones', async () => {
    await expect(
      locationService.createLocation({
        name: 'Damascus office',
        address: 'Mazzeh, Damascus',
        phones: [],
      }),
    ).rejects.toBeInstanceOf(LocationPhonesRequiredException);
    expect(locationRepository.create).not.toHaveBeenCalled();
  });

  it('rejects latitude without longitude', async () => {
    await expect(
      locationService.createLocation({
        name: 'Damascus office',
        address: 'Mazzeh, Damascus',
        latitude: 33.5138,
        phones: [{ phone: '+963 11 123 4567' }],
      }),
    ).rejects.toBeInstanceOf(LocationCoordinatesIncompleteException);
    expect(locationRepository.create).not.toHaveBeenCalled();
  });

  it('lists only visible locations for the public audience', async () => {
    await locationService.findPublicLocations({ limit: 10, offset: 0 });
    expect(locationRepository.findAll).toHaveBeenCalledWith({
      isVisible: true,
      limit: 10,
      offset: 0,
    });
  });

  it('hides a hidden location from the public get', async () => {
    locationRepository.findById.mockResolvedValue(
      new LocationEntity({
        ...expectedLocation,
        isVisible: false,
        phones: expectedLocation.phones,
      }),
    );
    await expect(locationService.getPublicLocationById(1)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
  });

  it('throws ResourceNotFoundException when deleting a missing location', async () => {
    locationRepository.findById.mockResolvedValue(null);
    await expect(locationService.deleteLocation(99)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
    expect(locationRepository.delete).not.toHaveBeenCalled();
  });
});
