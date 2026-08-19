import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/common/constants/policy.constants';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  CreateLocationServiceInput,
  GetLocationsServiceInput,
  LocationPhoneServiceInput,
  UpdateLocationServiceInput,
} from '@/modules/location/defs/location-service.defs';
import {
  LocationPage,
  LocationPhoneRepoInput,
} from '@/modules/location/defs/location-repository.defs';
import { LocationEntity } from '@/modules/location/entity/location.entity';
import { LocationCoordinatesIncompleteException } from '@/modules/location/exceptions/location-coordinates-incomplete.exception';
import { LocationPhonesRequiredException } from '@/modules/location/exceptions/location-phones-required.exception';
import { LocationRepository } from '@/modules/location/repository/location.repository';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async createLocation(input: CreateLocationServiceInput): Promise<LocationEntity> {
    this.assertHasPhones(input.phones);
    this.assertCoordinatePair({
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
    });
    return this.locationRepository.create({
      name: input.name,
      address: input.address,
      googleMapsUrl: input.googleMapsUrl ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      isVisible: input.isVisible ?? true,
      displayOrder: input.displayOrder ?? 0,
      phones: this.mapPhoneInputs(input.phones),
    });
  }

  async findLocationById(id: number): Promise<LocationEntity | null> {
    return this.locationRepository.findById(id);
  }

  async getLocationById(id: number): Promise<LocationEntity> {
    const location = await this.findLocationById(id);
    if (!location) {
      throw new ResourceNotFoundException('Location', id);
    }
    return location;
  }

  async getPublicLocationById(id: number): Promise<LocationEntity> {
    const location = await this.findLocationById(id);
    if (!location || !location.isVisible) {
      throw new ResourceNotFoundException('Location', id);
    }
    return location;
  }

  async findLocations(input: GetLocationsServiceInput = {}): Promise<LocationPage> {
    return this.locationRepository.findAll({
      isVisible: input.isVisible,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async findPublicLocations(input: GetLocationsServiceInput = {}): Promise<LocationPage> {
    return this.locationRepository.findAll({
      isVisible: true,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async updateLocation(input: UpdateLocationServiceInput): Promise<LocationEntity> {
    const existing = await this.getLocationById(input.id);
    this.assertCoordinatePair({
      latitude: input.latitude !== undefined ? input.latitude : existing.latitude,
      longitude: input.longitude !== undefined ? input.longitude : existing.longitude,
    });
    if (input.phones !== undefined) {
      this.assertHasPhones(input.phones);
    }
    return this.locationRepository.update({
      id: input.id,
      name: input.name,
      address: input.address,
      googleMapsUrl: input.googleMapsUrl,
      latitude: input.latitude,
      longitude: input.longitude,
      isVisible: input.isVisible,
      displayOrder: input.displayOrder,
      phones: input.phones ? this.mapPhoneInputs(input.phones) : undefined,
    });
  }

  async deleteLocation(id: number): Promise<void> {
    await this.getLocationById(id);
    await this.locationRepository.delete(id);
  }

  private assertHasPhones(phones: readonly LocationPhoneServiceInput[]): void {
    if (phones.length === 0) {
      throw new LocationPhonesRequiredException();
    }
  }

  private assertCoordinatePair(input: { latitude: number | null; longitude: number | null }): void {
    const hasLatitude = input.latitude !== null;
    const hasLongitude = input.longitude !== null;
    if (hasLatitude !== hasLongitude) {
      throw new LocationCoordinatesIncompleteException();
    }
  }

  private mapPhoneInputs(phones: readonly LocationPhoneServiceInput[]): LocationPhoneRepoInput[] {
    return phones.map((phone, index) => ({
      phone: phone.phone,
      displayOrder: phone.displayOrder ?? index,
    }));
  }
}
