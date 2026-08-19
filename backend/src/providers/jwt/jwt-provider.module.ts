import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import { JwtTokenService } from '@/providers/jwt/jwt-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [JwtConfigService],
      useFactory: async (jwtConfigService: JwtConfigService): Promise<JwtModuleOptions> =>
        ({
          secret: jwtConfigService.secretKey,
          signOptions: { expiresIn: jwtConfigService.expiresIn },
        }) as JwtModuleOptions,
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtProviderModule {}
