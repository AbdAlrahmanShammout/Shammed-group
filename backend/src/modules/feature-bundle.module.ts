import { Module } from '@nestjs/common';

import { AdminApiModule } from '@/modules/admin-api.module';
import { PublicApiModule } from '@/modules/public-api.module';

@Module({
  imports: [AdminApiModule, PublicApiModule],
})
export class FeatureBundleModule {}
