export type CreateContactInquiryServiceInput = {
  readonly fullName: string;
  readonly email: string;
  readonly phone?: string;
  readonly subject: string;
  readonly message: string;
};
