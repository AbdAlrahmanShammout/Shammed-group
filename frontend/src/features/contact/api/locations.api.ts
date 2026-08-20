import { requestApi } from '@/api/http-client';
import type { GetLocationsResponseDto } from '@/generated/public-contact.contract';

const LOCATIONS_PATH = '/location';

export async function getPublicLocations(): Promise<GetLocationsResponseDto> {
  return requestApi<GetLocationsResponseDto>({
    path: LOCATIONS_PATH,
    method: 'GET',
  });
}
