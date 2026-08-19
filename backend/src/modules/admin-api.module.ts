import { Module } from '@nestjs/common';

import { AuthAdminController } from '@/authentication/auth.admin.controller';
import { AuthModule } from '@/authentication/auth.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { LocationAdminController } from '@/modules/location/location.admin.controller';
import { LocationModule } from '@/modules/location/location.module';
import { MediaAdminController } from '@/modules/media/media.admin.controller';
import { MediaModule } from '@/modules/media/media.module';
import { SocialLinkAdminController } from '@/modules/social-link/social-link.admin.controller';
import { SocialLinkModule } from '@/modules/social-link/social-link.module';

@Module({
  imports: [AuthModule, LocationModule, MediaModule, SocialLinkModule],
  controllers: [
    AuthAdminController,
    LocationAdminController,
    MediaAdminController,
    SocialLinkAdminController,
  ],
  providers: [JwtAuthGuard, RolesGuard],
})
export class AdminApiModule {}
