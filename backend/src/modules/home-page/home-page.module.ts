import { Module } from '@nestjs/common';

import { HomePageService } from '@/modules/home-page/home-page.service';
import { HomePagePrismaRepository } from '@/modules/home-page/repository/home-page-prisma.repository';
import { HomePageRepository } from '@/modules/home-page/repository/home-page.repository';
import { MediaModule } from '@/modules/media/media.module';
import { PartnerModule } from '@/modules/partner/partner.module';
import { ProductModule } from '@/modules/product/product.module';
import { ServiceModule } from '@/modules/service/service.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, MediaModule, PartnerModule, ProductModule, ServiceModule],
  providers: [HomePageService, { provide: HomePageRepository, useClass: HomePagePrismaRepository }],
  exports: [HomePageService],
})
export class HomePageModule {}
