import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { BaseMessageResponse } from '@/common/base/base-message-response.dto';
import {
  CONTACT_INQUIRY_THROTTLE_LIMIT,
  CONTACT_INQUIRY_THROTTLE_TTL_MS,
} from '@/common/constants/policy.constants';
import { ContactInquiryService } from '@/modules/contact-inquiry/contact-inquiry.service';
import { CreateContactInquiryRequestDto } from '@/modules/contact-inquiry/dto/request/create-contact-inquiry-request.dto';

@ApiTags('Public - Contact Inquiry')
@Controller('contact-inquiry')
export class ContactInquiryPublicController {
  constructor(private readonly contactInquiryService: ContactInquiryService) {}

  @Post()
  @Throttle({
    default: { ttl: CONTACT_INQUIRY_THROTTLE_TTL_MS, limit: CONTACT_INQUIRY_THROTTLE_LIMIT },
  })
  @ApiOperation({ summary: 'Submit a public contact inquiry' })
  @ApiBody({ type: CreateContactInquiryRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: BaseMessageResponse })
  async createContactInquiry(
    @Body() requestDto: CreateContactInquiryRequestDto,
  ): Promise<BaseMessageResponse> {
    await this.contactInquiryService.createContactInquiry({
      fullName: requestDto.fullName,
      email: requestDto.email,
      phone: requestDto.phone,
      subject: requestDto.subject,
      message: requestDto.message,
    });
    return new BaseMessageResponse({ message: 'Inquiry submitted', status: 'ok' });
  }
}
