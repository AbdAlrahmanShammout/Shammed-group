/**
 * Wire types for GET /location and POST /contact-inquiry.
 * Keep aligned with the public OpenAPI documents.
 * Do not import backend source types.
 */
export type LocationPhoneResponse = {
  readonly id: number;
  readonly phone: string;
  readonly displayOrder: number;
};

export type LocationResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly name: string;
  readonly address: string;
  readonly googleMapsUrl?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly isVisible: boolean;
  readonly isMapVisible: boolean;
  readonly displayOrder: number;
  readonly phones: readonly LocationPhoneResponse[];
};

export type GetLocationsResponseDto = {
  readonly locations: readonly LocationResponse[];
  readonly total: number;
};

export type CreateContactInquiryRequestDto = {
  readonly fullName: string;
  readonly email: string;
  readonly phone?: string;
  readonly subject: string;
  readonly message: string;
};

export type CreateContactInquiryResponseDto = {
  readonly message: string;
  readonly status: string;
};
