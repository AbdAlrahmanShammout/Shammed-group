import { Module } from '@nestjs/common';

import { LocationService } from '@/modules/location/location.service';
import { LocationPrismaRepository } from '@/modules/location/repository/location-prisma.repository';
import { LocationRepository } from '@/modules/location/repository/location.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [LocationService, { provide: LocationRepository, useClass: LocationPrismaRepository }],
  exports: [LocationService],
})
export class LocationModule {}
