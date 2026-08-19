import { ApiProperty } from '@nestjs/swagger';

import { LocationPhoneEntity } from '@/modules/location/entity/location-phone.entity';

export class LocationPhoneResponse {
  @ApiProperty({ description: 'Phone record identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Branch phone number', example: '+963 11 123 4567' })
  phone: string;

  @ApiProperty({ description: 'Sort order among phones', example: 0 })
  displayOrder: number;

  constructor(data: LocationPhoneEntity) {
    this.id = data.id;
    this.phone = data.phone;
    this.displayOrder = data.displayOrder;
  }
}
