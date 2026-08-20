/**
 * Wire types for GET /admin/contact-inquiry endpoints.
 * Keep aligned with the admin ContactInquiry OpenAPI documents.
 * Do not import backend source types.
 */

export type EmailDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';

export type ContactInquiryResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly subject: string;
  readonly message: string;
  readonly emailDeliveryStatus: EmailDeliveryStatus;
  readonly emailDeliveredAt: string | null;
};

export type GetContactInquiriesResponseDto = {
  readonly inquiries: readonly ContactInquiryResponse[];
  readonly total: number;
};

export type ContactInquiryResponseDto = {
  readonly inquiry: ContactInquiryResponse;
};

export type GetContactInquiriesQuery = {
  readonly limit?: number;
  readonly offset?: number;
  readonly status?: EmailDeliveryStatus;
};
