import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ADMIN_PRINCIPAL_ID } from '@/authentication/consts';
import { Role } from '@/authentication/enum/role.enum';
import type { JwtAuthTokenPayload } from '@/authentication/types/jwt-auth-token-payload.type';
import { Principal } from '@/common/auth/principal.interface';
import { AuthenticationFailedException } from '@/common/exceptions/authentication-failed.exception';
import { JwtConfigService } from '@/config/jwt/jwt-config.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(jwtConfigService: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.secretKey,
    });
  }

  validate(payload: JwtAuthTokenPayload): Principal {
    if (!this.isAdminPrincipalPayload(payload)) {
      throw new AuthenticationFailedException();
    }
    return {
      id: payload.principalId,
      role: payload.role,
    };
  }

  private isAdminPrincipalPayload(payload: JwtAuthTokenPayload): boolean {
    return payload.principalId === ADMIN_PRINCIPAL_ID && payload.role === Role.ADMIN;
  }
}
