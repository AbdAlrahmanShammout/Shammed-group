export type LocationPhoneServiceInput = {
  readonly phone: string;
  readonly displayOrder?: number;
};

export type CreateLocationServiceInput = {
  readonly name: string;
  readonly address: string;
  readonly googleMapsUrl?: string;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly isVisible?: boolean;
  readonly isMapVisible?: boolean;
  readonly displayOrder?: number;
  readonly phones: readonly LocationPhoneServiceInput[];
};

export type UpdateLocationServiceInput = {
  readonly id: number;
  readonly name?: string;
  readonly address?: string;
  readonly googleMapsUrl?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly isVisible?: boolean;
  readonly isMapVisible?: boolean;
  readonly displayOrder?: number;
  readonly phones?: readonly LocationPhoneServiceInput[];
};

export type GetLocationsServiceInput = {
  readonly isVisible?: boolean;
  readonly limit?: number;
  readonly offset?: number;
};
