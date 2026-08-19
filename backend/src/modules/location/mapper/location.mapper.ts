import { LocationPhoneEntity } from '@/modules/location/entity/location-phone.entity';
import { LocationEntity } from '@/modules/location/entity/location.entity';
import type { LocationType } from '@/modules/location/types/location-details-schema.type';

export class LocationMapper {
  static toEntity(schema: LocationType): LocationEntity {
    return new LocationEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      name: schema.name,
      address: schema.address,
      googleMapsUrl: schema.googleMapsUrl ?? null,
      latitude: LocationMapper.toOptionalNumber(schema.latitude),
      longitude: LocationMapper.toOptionalNumber(schema.longitude),
      isVisible: schema.isVisible,
      displayOrder: schema.displayOrder,
      phones: schema.phones?.map((phone) => LocationMapper.toPhoneEntity(phone)),
    });
  }

  private static toPhoneEntity(schema: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    phone: string;
    displayOrder: number;
    locationId: number;
  }): LocationPhoneEntity {
    const phone = new LocationPhoneEntity();
    phone.id = schema.id;
    phone.createdAt = schema.createdAt;
    phone.updatedAt = schema.updatedAt;
    phone.phone = schema.phone;
    phone.displayOrder = schema.displayOrder;
    phone.locationId = schema.locationId;
    return phone;
  }

  private static toOptionalNumber(value: unknown): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    return Number(value);
  }
}
