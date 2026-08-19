import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetPartnersRequestDto } from '@/modules/partner/dto/request/get-partners-request.dto';
import { GetPartnersResponseDto } from '@/modules/partner/dto/response/get-partners-response.dto';
import { PartnerResponseDto } from '@/modules/partner/dto/response/partner-response.dto';
import { PartnerService } from '@/modules/partner/partner.service';

@ApiTags('Public - Partner')
@Controller('partner')
export class PartnerPublicController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  @ApiOperation({ summary: 'List visible partners' })
  @ApiResponse({ status: HttpStatus.OK, type: GetPartnersResponseDto })
  async getPartners(@Query() query: GetPartnersRequestDto): Promise<GetPartnersResponseDto> {
    const page = await this.partnerService.findPublicPartners({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetPartnersResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visible partner' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: PartnerResponseDto })
  async getPartner(@Param('id', ParseIntPipe) id: number): Promise<PartnerResponseDto> {
    const partner = await this.partnerService.getPublicPartnerById(id);
    return new PartnerResponseDto(partner);
  }
}
