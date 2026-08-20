import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EmailDeliveryStatus } from '@/modules/contact-inquiry/enum/general.enum';
import type { ContactInquiryEntity } from '@/modules/contact-inquiry/entity/contact-inquiry.entity';

export class ContactInquiryResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  fullName!: string;

  @ApiProperty({ example: 'ada@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+963 11 000 0000' })
  phone!: string | null;

  @ApiProperty({ example: 'Product availability' })
  subject!: string;

  @ApiProperty({ example: 'Do you stock this product in Damascus?' })
  message!: string;

  @ApiProperty({ enum: EmailDeliveryStatus })
  emailDeliveryStatus!: EmailDeliveryStatus;

  @ApiPropertyOptional()
  emailDeliveredAt!: string | null;

  constructor(entity: ContactInquiryEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt.toISOString();
    this.updatedAt = entity.updatedAt.toISOString();
    this.fullName = entity.fullName;
    this.email = entity.email;
    this.phone = entity.phone;
    this.subject = entity.subject;
    this.message = entity.message;
    this.emailDeliveryStatus = entity.emailDeliveryStatus;
    this.emailDeliveredAt = entity.emailDeliveredAt ? entity.emailDeliveredAt.toISOString() : null;
  }
}
