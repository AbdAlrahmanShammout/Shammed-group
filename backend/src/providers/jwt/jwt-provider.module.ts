import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import { JwtTokenService } from '@/providers/jwt/jwt-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [JwtConfigService],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secretKey,
        signOptions: { expiresIn: jwtConfigService.expiresIn },
      }),
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtProviderModule {}
