import { BaseEntity } from '@/common/base/base.entity';
import { LocationPhoneEntity } from '@/modules/location/entity/location-phone.entity';
import { LocationZodType } from '@/modules/location/zod/location.zod';

export class LocationEntity extends BaseEntity {
  name!: string;
  address!: string;
  googleMapsUrl!: string | null;
  latitude!: number | null;
  longitude!: number | null;
  isVisible!: boolean;
  isMapVisible!: boolean;
  displayOrder!: number;
  phones?: LocationPhoneEntity[];

  constructor(data: LocationZodType) {
    super();
    Object.assign(this, data);
  }
}
