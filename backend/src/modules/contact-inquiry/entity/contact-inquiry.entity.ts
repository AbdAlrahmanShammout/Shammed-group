import { BaseEntity } from '@/common/base/base.entity';
import { EmailDeliveryStatus } from '@/modules/contact-inquiry/enum/general.enum';
import { ContactInquiryZodType } from '@/modules/contact-inquiry/zod/contact-inquiry.zod';

export class ContactInquiryEntity extends BaseEntity {
  fullName!: string;
  email!: string;
  phone!: string | null;
  subject!: string;
  message!: string;
  emailDeliveryStatus!: EmailDeliveryStatus;
  emailDeliveredAt!: Date | null;

  constructor(data: ContactInquiryZodType) {
    super();
    Object.assign(this, data);
  }
}
