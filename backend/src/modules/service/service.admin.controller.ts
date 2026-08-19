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
import { CreateServiceRequestDto } from '@/modules/service/dto/request/create-service-request.dto';
import { GetServicesRequestDto } from '@/modules/service/dto/request/get-services-request.dto';
import { UpdateServiceRequestDto } from '@/modules/service/dto/request/update-service-request.dto';
import { GetServicesResponseDto } from '@/modules/service/dto/response/get-services-response.dto';
import { ServiceResponseDto } from '@/modules/service/dto/response/service-response.dto';
import { ServiceService } from '@/modules/service/service.service';

@ApiTags('Admin - Service')
@Controller('admin/service')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class ServiceAdminController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a service' })
  @ApiBody({ type: CreateServiceRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: ServiceResponseDto })
  async createService(@Body() requestDto: CreateServiceRequestDto): Promise<ServiceResponseDto> {
    const service = await this.serviceService.createService({
      title: requestDto.title,
      description: requestDto.description,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
      imageMediaId: requestDto.imageMediaId,
    });
    return new ServiceResponseDto(service);
  }

  @Get()
  @ApiOperation({ summary: 'List all services' })
  @ApiResponse({ status: HttpStatus.OK, type: GetServicesResponseDto })
  async getServices(@Query() query: GetServicesRequestDto): Promise<GetServicesResponseDto> {
    const page = await this.serviceService.findServices({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetServicesResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ServiceResponseDto })
  async getService(@Param('id', ParseIntPipe) id: number): Promise<ServiceResponseDto> {
    const service = await this.serviceService.getServiceById(id);
    return new ServiceResponseDto(service);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateServiceRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: ServiceResponseDto })
  async updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestDto: UpdateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.serviceService.updateService({
      id,
      title: requestDto.title,
      description: requestDto.description,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
      imageMediaId: requestDto.imageMediaId,
    });
    return new ServiceResponseDto(service);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: BaseMessageResponse })
  async deleteService(@Param('id', ParseIntPipe) id: number): Promise<BaseMessageResponse> {
    await this.serviceService.deleteService(id);
    return new BaseMessageResponse({ message: 'Service deleted', status: 'ok' });
  }
}
