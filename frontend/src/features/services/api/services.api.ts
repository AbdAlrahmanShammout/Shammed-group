import { requestApi } from '@/api/http-client';
import type { GetServicesResponseDto } from '@/generated/public-service.contract';

const SERVICES_PATH = '/service';

export async function getPublicServices(): Promise<GetServicesResponseDto> {
  return requestApi<GetServicesResponseDto>({
    path: SERVICES_PATH,
    method: 'GET',
  });
}
