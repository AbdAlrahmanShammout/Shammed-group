import { Module } from '@nestjs/common';

import { MediaModule } from '@/modules/media/media.module';
import { PartnerModule } from '@/modules/partner/partner.module';
import { ProductCategoryModule } from '@/modules/product-category/product-category.module';
import { ProductService } from '@/modules/product/product.service';
import { ProductPrismaRepository } from '@/modules/product/repository/product-prisma.repository';
import { ProductRepository } from '@/modules/product/repository/product.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, MediaModule, PartnerModule, ProductCategoryModule],
  providers: [ProductService, { provide: ProductRepository, useClass: ProductPrismaRepository }],
  exports: [ProductService],
})
export class ProductModule {}
