import { requestApi } from '@/api/http-client';
import type {
  CreateServiceRequestDto,
  DeleteServiceResponseDto,
  GetServicesResponseDto,
  ServiceResponseDto,
  UpdateServiceRequestDto,
} from '@/generated/admin-service.contract';

const ADMIN_SERVICE_PATH = '/admin/service';
const ADMIN_SERVICE_LIST_LIMIT = 100;

export async function getAdminServices(): Promise<GetServicesResponseDto> {
  return requestApi<GetServicesResponseDto>({
    path: `${ADMIN_SERVICE_PATH}?limit=${ADMIN_SERVICE_LIST_LIMIT}&offset=0`,
    method: 'GET',
  });
}

export async function createAdminService(
  input: CreateServiceRequestDto,
): Promise<ServiceResponseDto> {
  return requestApi<ServiceResponseDto>({
    path: ADMIN_SERVICE_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminService(input: {
  readonly serviceId: number;
  readonly body: UpdateServiceRequestDto;
}): Promise<ServiceResponseDto> {
  return requestApi<ServiceResponseDto>({
    path: `${ADMIN_SERVICE_PATH}/${input.serviceId}`,
    method: 'PATCH',
    body: input.body,
  });
}

export async function deleteAdminService(serviceId: number): Promise<DeleteServiceResponseDto> {
  return requestApi<DeleteServiceResponseDto>({
    path: `${ADMIN_SERVICE_PATH}/${serviceId}`,
    method: 'DELETE',
  });
}
