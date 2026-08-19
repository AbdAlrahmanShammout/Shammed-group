import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetServicesRequestDto } from '@/modules/service/dto/request/get-services-request.dto';
import { GetServicesResponseDto } from '@/modules/service/dto/response/get-services-response.dto';
import { ServiceResponseDto } from '@/modules/service/dto/response/service-response.dto';
import { ServiceService } from '@/modules/service/service.service';

@ApiTags('Public - Service')
@Controller('service')
export class ServicePublicController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @ApiOperation({ summary: 'List visible services' })
  @ApiResponse({ status: HttpStatus.OK, type: GetServicesResponseDto })
  async getServices(@Query() query: GetServicesRequestDto): Promise<GetServicesResponseDto> {
    const page = await this.serviceService.findPublicServices({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetServicesResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visible service' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ServiceResponseDto })
  async getService(@Param('id', ParseIntPipe) id: number): Promise<ServiceResponseDto> {
    const service = await this.serviceService.getPublicServiceById(id);
    return new ServiceResponseDto(service);
  }
}
