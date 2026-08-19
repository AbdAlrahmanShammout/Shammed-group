import { LocationEntity } from '@/modules/location/entity/location.entity';

export type LocationPhoneRepoInput = {
  readonly phone: string;
  readonly displayOrder: number;
};

export type CreateLocationRepoInput = {
  readonly name: string;
  readonly address: string;
  readonly googleMapsUrl: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly phones: readonly LocationPhoneRepoInput[];
};

export type UpdateLocationRepoInput = {
  readonly id: number;
  readonly name?: string;
  readonly address?: string;
  readonly googleMapsUrl?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly phones?: readonly LocationPhoneRepoInput[];
};

export type GetLocationsRepoInput = {
  readonly isVisible?: boolean;
  readonly limit: number;
  readonly offset: number;
};

export type LocationPage = {
  readonly entities: LocationEntity[];
  readonly total: number;
};
