import { ApiProperty } from '@nestjs/swagger';

import type { LoginAuthServiceResult } from '@/authentication/defs/auth-service.defs';

export class LoginResponseDto {
  @ApiProperty({ description: 'Signed access token' })
  accessToken: string;

  constructor(data: LoginAuthServiceResult) {
    this.accessToken = data.accessToken;
  }
}
