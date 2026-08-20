import { EmailDeliveryStatus } from '@/modules/contact-inquiry/enum/general.enum';

export type CreateContactInquiryRepoInput = {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly subject: string;
  readonly message: string;
  readonly emailDeliveryStatus: EmailDeliveryStatus;
};

export type UpdateContactInquiryRepoInput = {
  readonly id: number;
  readonly emailDeliveryStatus?: EmailDeliveryStatus;
  readonly emailDeliveredAt?: Date | null;
};

export type FindContactInquiriesRepoInput = {
  readonly limit: number;
  readonly offset: number;
  readonly status?: EmailDeliveryStatus;
};
