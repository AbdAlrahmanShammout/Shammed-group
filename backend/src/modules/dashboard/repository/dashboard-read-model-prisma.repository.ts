import { Injectable } from '@nestjs/common';

import {
  CatalogCount,
  DashboardStatistics,
} from '@/modules/dashboard/defs/dashboard-read-model.defs';
import { DashboardReadModelRepository } from '@/modules/dashboard/repository/dashboard-read-model.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class DashboardReadModelPrismaRepository implements DashboardReadModelRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async getCatalogCounts(): Promise<DashboardStatistics> {
    const [
      productTotal,
      productVisible,
      categoryTotal,
      categoryVisible,
      partnerTotal,
      partnerVisible,
      serviceTotal,
      serviceVisible,
    ] = await Promise.all([
      this.prismaProviderService.product.count(),
      this.prismaProviderService.product.count({ where: { isVisible: true } }),
      this.prismaProviderService.productCategory.count(),
      this.prismaProviderService.productCategory.count({ where: { isVisible: true } }),
      this.prismaProviderService.partner.count(),
      this.prismaProviderService.partner.count({ where: { isVisible: true } }),
      this.prismaProviderService.service.count(),
      this.prismaProviderService.service.count({ where: { isVisible: true } }),
    ]);
    return {
      products: this.toCatalogCount(productTotal, productVisible),
      categories: this.toCatalogCount(categoryTotal, categoryVisible),
      partners: this.toCatalogCount(partnerTotal, partnerVisible),
      services: this.toCatalogCount(serviceTotal, serviceVisible),
    };
  }

  private toCatalogCount(total: number, visible: number): CatalogCount {
    return {
      total,
      visible,
      hidden: total - visible,
    };
  }
}
