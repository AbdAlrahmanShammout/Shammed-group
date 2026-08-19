import { Module } from '@nestjs/common';

import { HealthController } from '@/health/health.controller';
import { HealthService } from '@/health/health.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
