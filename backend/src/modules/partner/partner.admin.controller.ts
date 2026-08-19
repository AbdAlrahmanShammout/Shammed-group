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
import { CreatePartnerRequestDto } from '@/modules/partner/dto/request/create-partner-request.dto';
import { GetPartnersRequestDto } from '@/modules/partner/dto/request/get-partners-request.dto';
import { UpdatePartnerRequestDto } from '@/modules/partner/dto/request/update-partner-request.dto';
import { GetPartnersResponseDto } from '@/modules/partner/dto/response/get-partners-response.dto';
import { PartnerResponseDto } from '@/modules/partner/dto/response/partner-response.dto';
import { PartnerService } from '@/modules/partner/partner.service';

@ApiTags('Admin - Partner')
@Controller('admin/partner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class PartnerAdminController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a partner' })
  @ApiBody({ type: CreatePartnerRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: PartnerResponseDto })
  async createPartner(@Body() requestDto: CreatePartnerRequestDto): Promise<PartnerResponseDto> {
    const partner = await this.partnerService.createPartner({
      name: requestDto.name,
      shortDescription: requestDto.shortDescription,
      fullDescription: requestDto.fullDescription,
      specialization: requestDto.specialization,
      websiteUrl: requestDto.websiteUrl,
      country: requestDto.country,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
      logoMediaId: requestDto.logoMediaId,
    });
    return new PartnerResponseDto(partner);
  }

  @Get()
  @ApiOperation({ summary: 'List all partners' })
  @ApiResponse({ status: HttpStatus.OK, type: GetPartnersResponseDto })
  async getPartners(@Query() query: GetPartnersRequestDto): Promise<GetPartnersResponseDto> {
    const page = await this.partnerService.findPartners({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetPartnersResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a partner' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: PartnerResponseDto })
  async getPartner(@Param('id', ParseIntPipe) id: number): Promise<PartnerResponseDto> {
    const partner = await this.partnerService.getPartnerById(id);
    return new PartnerResponseDto(partner);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a partner' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePartnerRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: PartnerResponseDto })
  async updatePartner(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestDto: UpdatePartnerRequestDto,
  ): Promise<PartnerResponseDto> {
    const partner = await this.partnerService.updatePartner({
      id,
      name: requestDto.name,
      shortDescription: requestDto.shortDescription,
      fullDescription: requestDto.fullDescription,
      specialization: requestDto.specialization,
      websiteUrl: requestDto.websiteUrl,
      country: requestDto.country,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
      logoMediaId: requestDto.logoMediaId,
    });
    return new PartnerResponseDto(partner);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a partner' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: BaseMessageResponse })
  async deletePartner(@Param('id', ParseIntPipe) id: number): Promise<BaseMessageResponse> {
    await this.partnerService.deletePartner(id);
    return new BaseMessageResponse({ message: 'Partner deleted', status: 'ok' });
  }
}
