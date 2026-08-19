import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '@/authentication/auth.service';
import { ADMIN_PRINCIPAL_ID } from '@/authentication/consts';
import { Role } from '@/authentication/enum/role.enum';
import { AuthenticationFailedException } from '@/common/exceptions/authentication-failed.exception';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { JwtTokenService } from '@/providers/jwt/jwt-token.service';

describe('AuthService', () => {
  const inputPassword = 'correct-admin-password';
  let authService: AuthService;
  let jwtTokenService: { sign: jest.Mock };

  beforeEach(async () => {
    jwtTokenService = {
      sign: jest.fn().mockResolvedValue('signed-access-token'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthConfigService,
          useValue: { adminPassword: inputPassword },
        },
        { provide: JwtTokenService, useValue: jwtTokenService },
      ],
    }).compile();
    authService = module.get(AuthService);
  });

  it('returns a signed access token when the password matches', async () => {
    const actual = await authService.login({ password: inputPassword });
    expect(actual).toEqual({ accessToken: 'signed-access-token' });
    expect(jwtTokenService.sign).toHaveBeenCalledWith({
      principalId: ADMIN_PRINCIPAL_ID,
      role: Role.ADMIN,
    });
  });

  it('throws AuthenticationFailedException when the password does not match', async () => {
    await expect(authService.login({ password: 'wrong-password' })).rejects.toBeInstanceOf(
      AuthenticationFailedException,
    );
    expect(jwtTokenService.sign).not.toHaveBeenCalled();
  });
});
