import { Module } from '@nestjs/common';

import { DashboardService } from '@/modules/dashboard/dashboard.service';
import { DashboardReadModelPrismaRepository } from '@/modules/dashboard/repository/dashboard-read-model-prisma.repository';
import { DashboardReadModelRepository } from '@/modules/dashboard/repository/dashboard-read-model.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [
    DashboardService,
    { provide: DashboardReadModelRepository, useClass: DashboardReadModelPrismaRepository },
  ],
  exports: [DashboardService],
})
export class DashboardModule {}
