import { Module } from '@nestjs/common';

import { LocationPublicController } from '@/modules/location/location.public.controller';
import { LocationModule } from '@/modules/location/location.module';
import { PartnerPublicController } from '@/modules/partner/partner.public.controller';
import { PartnerModule } from '@/modules/partner/partner.module';
import { ProductCategoryPublicController } from '@/modules/product-category/product-category.public.controller';
import { ProductCategoryModule } from '@/modules/product-category/product-category.module';
import { ProductPublicController } from '@/modules/product/product.public.controller';
import { ProductModule } from '@/modules/product/product.module';
import { ServicePublicController } from '@/modules/service/service.public.controller';
import { ServiceModule } from '@/modules/service/service.module';
import { SiteSettingsPublicController } from '@/modules/site-settings/site-settings.public.controller';
import { SiteSettingsModule } from '@/modules/site-settings/site-settings.module';
import { SocialLinkPublicController } from '@/modules/social-link/social-link.public.controller';
import { SocialLinkModule } from '@/modules/social-link/social-link.module';

@Module({
  imports: [
    LocationModule,
    PartnerModule,
    ProductCategoryModule,
    ProductModule,
    ServiceModule,
    SiteSettingsModule,
    SocialLinkModule,
  ],
  controllers: [
    LocationPublicController,
    PartnerPublicController,
    ProductCategoryPublicController,
    ProductPublicController,
    ServicePublicController,
    SiteSettingsPublicController,
    SocialLinkPublicController,
  ],
})
export class PublicApiModule {}
