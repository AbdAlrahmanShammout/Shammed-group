import { requestApi } from '@/api/http-client';
import type { AuthSessionResponseDto, LoginRequestDto, LoginResponseDto } from '@/generated/admin-auth.contract';

const ADMIN_LOGIN_PATH = '/admin/auth/login';
const ADMIN_SESSION_PATH = '/admin/auth/me';

export async function loginAdmin(input: LoginRequestDto): Promise<LoginResponseDto> {
  return requestApi<LoginResponseDto>({
    path: ADMIN_LOGIN_PATH,
    method: 'POST',
    body: input,
  });
}

export async function getAdminSession(): Promise<AuthSessionResponseDto> {
  return requestApi<AuthSessionResponseDto>({
    path: ADMIN_SESSION_PATH,
    method: 'GET',
  });
}
