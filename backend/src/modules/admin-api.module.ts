import { Module } from '@nestjs/common';

import { AuthAdminController } from '@/authentication/auth.admin.controller';
import { AuthModule } from '@/authentication/auth.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { LocationAdminController } from '@/modules/location/location.admin.controller';
import { LocationModule } from '@/modules/location/location.module';
import { MediaAdminController } from '@/modules/media/media.admin.controller';
import { MediaModule } from '@/modules/media/media.module';

@Module({
  imports: [AuthModule, LocationModule, MediaModule],
  controllers: [AuthAdminController, LocationAdminController, MediaAdminController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class AdminApiModule {}
