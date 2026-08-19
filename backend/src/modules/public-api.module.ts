import { Module } from '@nestjs/common';

import { LocationPublicController } from '@/modules/location/location.public.controller';
import { LocationModule } from '@/modules/location/location.module';
import { SocialLinkPublicController } from '@/modules/social-link/social-link.public.controller';
import { SocialLinkModule } from '@/modules/social-link/social-link.module';

@Module({
  imports: [LocationModule, SocialLinkModule],
  controllers: [LocationPublicController, SocialLinkPublicController],
})
export class PublicApiModule {}
