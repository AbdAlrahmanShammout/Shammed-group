import { ApiProperty } from '@nestjs/swagger';

import { Principal } from '@/common/auth/principal.interface';

export class AuthSessionResponseDto {
  @ApiProperty({ description: 'Synthetic admin principal identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Authenticated role', example: 'admin' })
  role: string;

  constructor(data: Principal) {
    this.id = data.id;
    this.role = data.role;
  }
}
