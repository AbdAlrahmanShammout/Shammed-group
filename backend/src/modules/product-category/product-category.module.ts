import { Module } from '@nestjs/common';

import { ProductCategoryService } from '@/modules/product-category/product-category.service';
import { ProductCategoryPrismaRepository } from '@/modules/product-category/repository/product-category-prisma.repository';
import { ProductCategoryRepository } from '@/modules/product-category/repository/product-category.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [
    ProductCategoryService,
    { provide: ProductCategoryRepository, useClass: ProductCategoryPrismaRepository },
  ],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
