import { ContactInquiryEntity } from '@/modules/contact-inquiry/entity/contact-inquiry.entity';
import { EmailDeliveryStatus } from '@/modules/contact-inquiry/enum/general.enum';
import type { ContactInquiryType } from '@/modules/contact-inquiry/types/contact-inquiry-details-schema.type';

export class ContactInquiryMapper {
  static toEntity(schema: ContactInquiryType): ContactInquiryEntity {
    return new ContactInquiryEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      fullName: schema.fullName,
      email: schema.email,
      phone: schema.phone,
      subject: schema.subject,
      message: schema.message,
      emailDeliveryStatus: schema.emailDeliveryStatus as EmailDeliveryStatus,
      emailDeliveredAt: schema.emailDeliveredAt ?? null,
    });
  }
}
