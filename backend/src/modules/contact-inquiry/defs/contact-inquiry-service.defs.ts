export type CreateContactInquiryServiceInput = {
  readonly fullName: string;
  readonly email: string;
  readonly phone?: string;
  readonly subject: string;
  readonly message: string;
};

export type ListContactInquiriesServiceInput = {
  readonly limit: number;
  readonly offset: number;
  readonly status?: string;
};

export type ContactInquiryPage = {
  readonly inquiries: import('@/modules/contact-inquiry/entity/contact-inquiry.entity').ContactInquiryEntity[];
  readonly total: number;
};
