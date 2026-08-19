import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '@/authentication/auth.service';
import { JwtAuthStrategy } from '@/authentication/strategies/jwt-auth.strategy';
import { JwtProviderModule } from '@/providers/jwt/jwt-provider.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtProviderModule],
  providers: [AuthService, JwtAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
