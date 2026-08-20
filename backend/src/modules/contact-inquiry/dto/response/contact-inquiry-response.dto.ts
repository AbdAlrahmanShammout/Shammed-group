import { ApiProperty } from '@nestjs/swagger';

import { ContactInquiryResponse } from '@/modules/contact-inquiry/dto/response/contact-inquiry-response';
import type { ContactInquiryEntity } from '@/modules/contact-inquiry/entity/contact-inquiry.entity';

export class ContactInquiryResponseDto {
  @ApiProperty({ type: ContactInquiryResponse })
  inquiry!: ContactInquiryResponse;

  constructor(entity: ContactInquiryEntity) {
    this.inquiry = new ContactInquiryResponse(entity);
  }
}
