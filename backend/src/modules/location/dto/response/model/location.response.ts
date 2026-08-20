import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { LocationPhoneResponse } from '@/modules/location/dto/response/model/location-phone.response';
import { LocationEntity } from '@/modules/location/entity/location.entity';

export class LocationResponse extends BaseModelResponseDto {
  @ApiProperty({ description: 'Branch name', example: 'Damascus office' })
  name: string;

  @ApiProperty({ description: 'Street address', example: 'Mazzeh, Damascus' })
  address: string;

  @ApiPropertyOptional({
    description: 'Google Maps URL',
    example: 'https://maps.google.com/?q=33.5138,36.2765',
  })
  googleMapsUrl?: string;

  @ApiPropertyOptional({ description: 'Geographic latitude', example: 33.5138 })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Geographic longitude', example: 36.2765 })
  longitude?: number;

  @ApiProperty({ description: 'Whether the location is public', example: true })
  isVisible: boolean;

  @ApiProperty({
    description: 'Whether the Google Map embed is shown in the public footer',
    example: true,
  })
  isMapVisible: boolean;

  @ApiProperty({ description: 'Sort order among locations', example: 0 })
  displayOrder: number;

  @ApiProperty({ type: () => [LocationPhoneResponse] })
  phones: LocationPhoneResponse[];

  constructor(data: LocationEntity) {
    super(data);
    this.name = data.name;
    this.address = data.address;
    this.googleMapsUrl = data.googleMapsUrl ?? undefined;
    this.latitude = data.latitude ?? undefined;
    this.longitude = data.longitude ?? undefined;
    this.isVisible = data.isVisible;
    this.isMapVisible = data.isMapVisible;
    this.displayOrder = data.displayOrder;
    this.phones = (data.phones ?? []).map((phone) => new LocationPhoneResponse(phone));
  }
}
