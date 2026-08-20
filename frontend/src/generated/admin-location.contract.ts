/**
 * Wire types for admin location operations on the admin OpenAPI document.
 * Keep aligned with /admin/location.
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

export type LocationResponseDto = {
  readonly location: LocationResponse;
};

export type GetLocationsResponseDto = {
  readonly locations: readonly LocationResponse[];
  readonly total: number;
};

export type LocationPhoneRequestDto = {
  readonly phone: string;
  readonly displayOrder?: number;
};

export type CreateLocationRequestDto = {
  readonly name: string;
  readonly address: string;
  readonly googleMapsUrl?: string;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly isVisible?: boolean;
  readonly isMapVisible?: boolean;
  readonly displayOrder?: number;
  readonly phones: readonly LocationPhoneRequestDto[];
};

export type UpdateLocationRequestDto = {
  readonly name?: string;
  readonly address?: string;
  readonly googleMapsUrl?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly isVisible?: boolean;
  readonly isMapVisible?: boolean;
  readonly displayOrder?: number;
  readonly phones?: readonly LocationPhoneRequestDto[];
};

export type DeleteLocationResponseDto = {
  readonly message: string;
  readonly status: string;
};
