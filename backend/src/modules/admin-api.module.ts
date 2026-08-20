import { Module } from '@nestjs/common';

import { AuthAdminController } from '@/authentication/auth.admin.controller';
import { AuthModule } from '@/authentication/auth.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { AboutPageAdminController } from '@/modules/about-page/about-page.admin.controller';
import { AboutPageModule } from '@/modules/about-page/about-page.module';
import { DashboardAdminController } from '@/modules/dashboard/dashboard.admin.controller';
import { DashboardModule } from '@/modules/dashboard/dashboard.module';
import { HomePageAdminController } from '@/modules/home-page/home-page.admin.controller';
import { HomePageModule } from '@/modules/home-page/home-page.module';
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
import { ServiceAdminController } from '@/modules/service/service.admin.controller';
import { ServiceModule } from '@/modules/service/service.module';
import { SiteSettingsAdminController } from '@/modules/site-settings/site-settings.admin.controller';
import { SiteSettingsModule } from '@/modules/site-settings/site-settings.module';
import { SocialLinkAdminController } from '@/modules/social-link/social-link.admin.controller';
import { SocialLinkModule } from '@/modules/social-link/social-link.module';

@Module({
  imports: [
    AuthModule,
    AboutPageModule,
    DashboardModule,
    HomePageModule,
    LocationModule,
    MediaModule,
    PartnerModule,
    ProductCategoryModule,
    ProductModule,
    ServiceModule,
    SiteSettingsModule,
    SocialLinkModule,
  ],
  controllers: [
    AuthAdminController,
    AboutPageAdminController,
    DashboardAdminController,
    HomePageAdminController,
    LocationAdminController,
    MediaAdminController,
    PartnerAdminController,
    ProductCategoryAdminController,
    ProductAdminController,
    ServiceAdminController,
    SiteSettingsAdminController,
    SocialLinkAdminController,
  ],
  providers: [JwtAuthGuard, RolesGuard],
})
export class AdminApiModule {}
