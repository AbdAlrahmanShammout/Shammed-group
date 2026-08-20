import { requestApi } from '@/api/http-client';
import type {
  CreateLocationRequestDto,
  DeleteLocationResponseDto,
  GetLocationsResponseDto,
  LocationResponseDto,
  UpdateLocationRequestDto,
} from '@/generated/admin-location.contract';

const ADMIN_LOCATION_PATH = '/admin/location';
const ADMIN_LOCATION_LIST_LIMIT = 100;

export async function getAdminLocations(): Promise<GetLocationsResponseDto> {
  return requestApi<GetLocationsResponseDto>({
    path: `${ADMIN_LOCATION_PATH}?limit=${ADMIN_LOCATION_LIST_LIMIT}&offset=0`,
    method: 'GET',
  });
}

export async function createAdminLocation(
  input: CreateLocationRequestDto,
): Promise<LocationResponseDto> {
  return requestApi<LocationResponseDto>({
    path: ADMIN_LOCATION_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminLocation(input: {
  readonly locationId: number;
  readonly body: UpdateLocationRequestDto;
}): Promise<LocationResponseDto> {
  return requestApi<LocationResponseDto>({
    path: `${ADMIN_LOCATION_PATH}/${input.locationId}`,
    method: 'PATCH',
    body: input.body,
  });
}

export async function deleteAdminLocation(locationId: number): Promise<DeleteLocationResponseDto> {
  return requestApi<DeleteLocationResponseDto>({
    path: `${ADMIN_LOCATION_PATH}/${locationId}`,
    method: 'DELETE',
  });
}
