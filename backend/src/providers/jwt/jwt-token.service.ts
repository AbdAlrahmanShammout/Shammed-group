import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtInvalidException } from '@/providers/jwt/exceptions/jwt-invalid.exception';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify<T extends object>(token: string): Promise<T> {
    try {
      return await this.jwtService.verifyAsync<T>(token);
    } catch {
      throw new JwtInvalidException();
    }
  }
}
