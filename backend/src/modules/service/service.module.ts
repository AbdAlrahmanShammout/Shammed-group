import { Module } from '@nestjs/common';

import { MediaModule } from '@/modules/media/media.module';
import { ServicePrismaRepository } from '@/modules/service/repository/service-prisma.repository';
import { ServiceRepository } from '@/modules/service/repository/service.repository';
import { ServiceService } from '@/modules/service/service.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, MediaModule],
  providers: [ServiceService, { provide: ServiceRepository, useClass: ServicePrismaRepository }],
  exports: [ServiceService],
})
export class ServiceModule {}
