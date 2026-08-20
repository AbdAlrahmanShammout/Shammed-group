import { useMutation } from '@tanstack/react-query';

import { loginAdmin } from '@/features/auth/api/auth.api';
import type { LoginRequestDto, LoginResponseDto } from '@/generated/admin-auth.contract';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginRequestDto): Promise<LoginResponseDto> => loginAdmin(input),
  });
}
