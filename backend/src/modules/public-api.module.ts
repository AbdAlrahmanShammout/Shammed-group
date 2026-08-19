import { Module } from '@nestjs/common';

import { LocationPublicController } from '@/modules/location/location.public.controller';
import { LocationModule } from '@/modules/location/location.module';

@Module({
  imports: [LocationModule],
  controllers: [LocationPublicController],
})
export class PublicApiModule {}
