import { Module } from '@nestjs/common';

import { AuthAdminController } from '@/authentication/auth.admin.controller';
import { AuthModule } from '@/authentication/auth.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { LocationAdminController } from '@/modules/location/location.admin.controller';
import { LocationModule } from '@/modules/location/location.module';
import { MediaAdminController } from '@/modules/media/media.admin.controller';
import { MediaModule } from '@/modules/media/media.module';
import { PartnerAdminController } from '@/modules/partner/partner.admin.controller';
import { PartnerModule } from '@/modules/partner/partner.module';
import { ProductCategoryAdminController } from '@/modules/product-category/product-category.admin.controller';
import { ProductCategoryModule } from '@/modules/product-category/product-category.module';
import { ProductAdminController } from '@/modules/product/product.admin.controller';
import { ProductModule } from '@/modules/product/product.module';
import { SiteSettingsAdminController } from '@/modules/site-settings/site-settings.admin.controller';
import { SiteSettingsModule } from '@/modules/site-settings/site-settings.module';
import { SocialLinkAdminController } from '@/modules/social-link/social-link.admin.controller';
import { SocialLinkModule } from '@/modules/social-link/social-link.module';

@Module({
  imports: [
    AuthModule,
    LocationModule,
    MediaModule,
    PartnerModule,
    ProductCategoryModule,
    ProductModule,
    SiteSettingsModule,
    SocialLinkModule,
  ],
  controllers: [
    AuthAdminController,
    LocationAdminController,
    MediaAdminController,
    PartnerAdminController,
    ProductCategoryAdminController,
    ProductAdminController,
    SiteSettingsAdminController,
    SocialLinkAdminController,
  ],
  providers: [JwtAuthGuard, RolesGuard],
})
export class AdminApiModule {}
