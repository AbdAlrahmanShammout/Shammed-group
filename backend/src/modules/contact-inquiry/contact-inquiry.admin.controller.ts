import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { BaseMessageResponse } from '@/common/base/base-message-response.dto';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ContactInquiryService } from '@/modules/contact-inquiry/contact-inquiry.service';
import { GetContactInquiriesRequestDto } from '@/modules/contact-inquiry/dto/request/get-contact-inquiries-request.dto';
import { ContactInquiryResponseDto } from '@/modules/contact-inquiry/dto/response/contact-inquiry-response.dto';
import { GetContactInquiriesResponseDto } from '@/modules/contact-inquiry/dto/response/get-contact-inquiries-response.dto';

@ApiTags('Admin - Contact Inquiries')
@Controller('admin/contact-inquiry')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class ContactInquiryAdminController {
  constructor(private readonly contactInquiryService: ContactInquiryService) {}

  @Get()
  @ApiOperation({ summary: 'List all contact inquiries with optional status filter' })
  @ApiResponse({ status: HttpStatus.OK, type: GetContactInquiriesResponseDto })
  async listContactInquiries(
    @Query() queryDto: GetContactInquiriesRequestDto,
  ): Promise<GetContactInquiriesResponseDto> {
    const page = await this.contactInquiryService.listContactInquiries({
      limit: queryDto.limit ?? 20,
      offset: queryDto.offset ?? 0,
      status: queryDto.status,
    });
    return new GetContactInquiriesResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single contact inquiry by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ContactInquiryResponseDto })
  async getContactInquiry(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContactInquiryResponseDto> {
    const inquiry = await this.contactInquiryService.getContactInquiry(id);
    return new ContactInquiryResponseDto(inquiry);
  }

  @Post(':id/resend')
  @ApiOperation({ summary: 'Resend notification email for a contact inquiry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ContactInquiryResponseDto })
  async resendNotification(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContactInquiryResponseDto> {
    const inquiry = await this.contactInquiryService.resendNotification(id);
    return new ContactInquiryResponseDto(inquiry);
  }
}
