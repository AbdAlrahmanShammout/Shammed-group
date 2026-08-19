import { Module } from '@nestjs/common';

import { AuthAdminController } from '@/authentication/auth.admin.controller';
import { AuthModule } from '@/authentication/auth.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [AuthAdminController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class AdminApiModule {}
