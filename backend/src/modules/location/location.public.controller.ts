import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetLocationsRequestDto } from '@/modules/location/dto/request/get-locations-request.dto';
import { GetLocationsResponseDto } from '@/modules/location/dto/response/get-locations-response.dto';
import { LocationResponseDto } from '@/modules/location/dto/response/location-response.dto';
import { LocationService } from '@/modules/location/location.service';

@ApiTags('Public - Location')
@Controller('location')
export class LocationPublicController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiOperation({ summary: 'List visible company locations' })
  @ApiResponse({ status: HttpStatus.OK, type: GetLocationsResponseDto })
  async getLocations(@Query() query: GetLocationsRequestDto): Promise<GetLocationsResponseDto> {
    const page = await this.locationService.findPublicLocations({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetLocationsResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visible company location' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: LocationResponseDto })
  async getLocation(@Param('id', ParseIntPipe) id: number): Promise<LocationResponseDto> {
    const location = await this.locationService.getPublicLocationById(id);
    return new LocationResponseDto(location);
  }
}
