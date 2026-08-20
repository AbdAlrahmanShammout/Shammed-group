import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { BaseMessageResponse } from '@/common/base/base-message-response.dto';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CreateLocationRequestDto } from '@/modules/location/dto/request/create-location-request.dto';
import { GetLocationsRequestDto } from '@/modules/location/dto/request/get-locations-request.dto';
import { UpdateLocationRequestDto } from '@/modules/location/dto/request/update-location-request.dto';
import { GetLocationsResponseDto } from '@/modules/location/dto/response/get-locations-response.dto';
import { LocationResponseDto } from '@/modules/location/dto/response/location-response.dto';
import { LocationService } from '@/modules/location/location.service';

@ApiTags('Admin - Location')
@Controller('admin/location')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class LocationAdminController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a company location' })
  @ApiBody({ type: CreateLocationRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: LocationResponseDto })
  async createLocation(@Body() requestDto: CreateLocationRequestDto): Promise<LocationResponseDto> {
    const location = await this.locationService.createLocation({
      name: requestDto.name,
      address: requestDto.address,
      googleMapsUrl: requestDto.googleMapsUrl,
      latitude: requestDto.latitude,
      longitude: requestDto.longitude,
      isVisible: requestDto.isVisible,
      isMapVisible: requestDto.isMapVisible,
      displayOrder: requestDto.displayOrder,
      phones: requestDto.phones.map((phone) => ({
        phone: phone.phone,
        displayOrder: phone.displayOrder,
      })),
    });
    return new LocationResponseDto(location);
  }

  @Get()
  @ApiOperation({ summary: 'List all company locations' })
  @ApiResponse({ status: HttpStatus.OK, type: GetLocationsResponseDto })
  async getLocations(@Query() query: GetLocationsRequestDto): Promise<GetLocationsResponseDto> {
    const page = await this.locationService.findLocations({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetLocationsResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company location' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: LocationResponseDto })
  async getLocation(@Param('id', ParseIntPipe) id: number): Promise<LocationResponseDto> {
    const location = await this.locationService.getLocationById(id);
    return new LocationResponseDto(location);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company location' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateLocationRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: LocationResponseDto })
  async updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestDto: UpdateLocationRequestDto,
  ): Promise<LocationResponseDto> {
    const location = await this.locationService.updateLocation({
      id,
      name: requestDto.name,
      address: requestDto.address,
      googleMapsUrl: requestDto.googleMapsUrl,
      latitude: requestDto.latitude,
      longitude: requestDto.longitude,
      isVisible: requestDto.isVisible,
      isMapVisible: requestDto.isMapVisible,
      displayOrder: requestDto.displayOrder,
      phones: requestDto.phones?.map((phone) => ({
        phone: phone.phone,
        displayOrder: phone.displayOrder,
      })),
    });
    return new LocationResponseDto(location);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company location' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: BaseMessageResponse })
  async deleteLocation(@Param('id', ParseIntPipe) id: number): Promise<BaseMessageResponse> {
    await this.locationService.deleteLocation(id);
    return new BaseMessageResponse({ message: 'Location deleted', status: 'ok' });
  }
}
