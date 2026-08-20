import { ApiProperty } from '@nestjs/swagger';

import { ContactInquiryResponse } from '@/modules/contact-inquiry/dto/response/contact-inquiry-response';
import type { ContactInquiryPage } from '@/modules/contact-inquiry/defs/contact-inquiry-service.defs';

export class GetContactInquiriesResponseDto {
  @ApiProperty({ type: [ContactInquiryResponse] })
  inquiries!: ContactInquiryResponse[];

  @ApiProperty({ example: 10 })
  total!: number;

  constructor(page: ContactInquiryPage) {
    this.inquiries = page.inquiries.map((e) => new ContactInquiryResponse(e));
    this.total = page.total;
  }
}
