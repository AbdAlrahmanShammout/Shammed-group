import { Injectable } from '@nestjs/common';

import { ADMIN_PRINCIPAL_ID } from '@/authentication/consts';
import type {
  LoginAuthServiceInput,
  LoginAuthServiceResult,
} from '@/authentication/defs/auth-service.defs';
import { Role } from '@/authentication/enum/role.enum';
import { AuthenticationFailedException } from '@/common/exceptions/authentication-failed.exception';
import { isEqualTimingSafe } from '@/common/helpers/timing-safe-equal.helper';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { JwtTokenService } from '@/providers/jwt/jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authConfigService: AuthConfigService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async login(input: LoginAuthServiceInput): Promise<LoginAuthServiceResult> {
    this.assertMatchingAdminPassword(input.password);
    const accessToken = await this.jwtTokenService.sign({
      principalId: ADMIN_PRINCIPAL_ID,
      role: Role.ADMIN,
    });
    return { accessToken };
  }

  private assertMatchingAdminPassword(password: string): void {
    if (!isEqualTimingSafe(password, this.authConfigService.adminPassword)) {
      throw new AuthenticationFailedException();
    }
  }
}
